import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from './contact'

type MockRes = VercelResponse & {
  statusCode: number
  body: unknown
  headers: Record<string, string>
}

function mockReq(overrides: Partial<VercelRequest> & { body?: unknown } = {}): VercelRequest {
  return {
    method: 'POST',
    headers: {},
    body: {
      name: 'Carlos',
      lastname: 'Hermida',
      email: 'dj@example.com',
      phone: '091332854',
      message: 'Quiero cotizar un evento para diciembre.',
      service: 'dj',
      opcionDj: 'full',
    },
    ...overrides,
  } as VercelRequest
}

function mockRes(): MockRes {
  const res = {
    statusCode: 200,
    body: null as unknown,
    headers: {} as Record<string, string>,
    setHeader(key: string, value: string) {
      this.headers[key] = value
      return this
    },
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(data: unknown) {
      this.body = data
      return this
    },
    end() {
      return this
    },
  }
  return res as unknown as MockRes
}

describe('api/contact handler', () => {
  const originalEnv = process.env.CONTACT_WEBHOOK_URL

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    if (originalEnv === undefined) {
      delete process.env.CONTACT_WEBHOOK_URL
    } else {
      process.env.CONTACT_WEBHOOK_URL = originalEnv
    }
  })

  it('responde 500 si falta CONTACT_WEBHOOK_URL', async () => {
    delete process.env.CONTACT_WEBHOOK_URL
    const res = mockRes()
    await handler(mockReq(), res)
    expect(res.statusCode).toBe(500)
    expect(res.body).toMatchObject({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('responde 500 si el webhook no es 2xx', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://hooks.example/contact'
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 502 } as Response)
    const res = mockRes()
    await handler(mockReq(), res)
    expect(res.statusCode).toBe(500)
    expect(res.body).toMatchObject({ ok: false })
  })

  it('responde 200 si el webhook es 2xx', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://hooks.example/contact'
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 200 } as Response)
    const res = mockRes()
    await handler(mockReq(), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({ ok: true })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('no llama al webhook si el honeypot está lleno', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://hooks.example/contact'
    const res = mockRes()
    await handler(mockReq({ body: { website: 'http://spam.test' } }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({ ok: true })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('acota CORS al origen de producción', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://hooks.example/contact'
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 200 } as Response)
    const res = mockRes()
    await handler(
      mockReq({ headers: { origin: 'https://djcarloshermida.vercel.app' } as VercelRequest['headers'] }),
      res,
    )
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://djcarloshermida.vercel.app')
  })

  it('no usa Access-Control-Allow-Origin *', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://hooks.example/contact'
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 200 } as Response)
    const res = mockRes()
    await handler(mockReq({ headers: { origin: 'https://evil.example' } as VercelRequest['headers'] }), res)
    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined()
  })
})

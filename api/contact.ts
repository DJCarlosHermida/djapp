import type { VercelRequest, VercelResponse } from '@vercel/node'
import { honeypotFilled, validateContactBody } from '../src/contactValidation'

const PRODUCTION_ORIGIN = 'https://djcarloshermida.vercel.app'
const WEBHOOK_TIMEOUT_MS = 8000
const DELIVERY_ERROR =
  'No se pudo procesar la consulta. Intentá de nuevo o escribinos por WhatsApp.'
const SUCCESS_MESSAGE = '¡Consulta recibida! Te contactaré a la brevedad.'

function allowedOrigins(): Set<string> {
  const allowed = new Set([PRODUCTION_ORIGIN])
  const vercelUrl = process.env.VERCEL_URL?.replace(/^https?:\/\//, '')
  if (vercelUrl) allowed.add(`https://${vercelUrl}`)
  return allowed
}

function corsOrigin(req: VercelRequest): string | null {
  const origin = req.headers.origin
  if (!origin || Array.isArray(origin)) return null
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return origin
  }
  return allowedOrigins().has(origin) ? origin : null
}

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = corsOrigin(req)
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function deliverToWebhook(payload: unknown, webhook: string): Promise<void> {
  const whRes = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  })
  if (!whRes.ok) {
    throw new Error(`webhook_status_${whRes.status}`)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido.' })
  }

  if (honeypotFilled(req.body)) {
    return res.status(200).json({ ok: true, message: SUCCESS_MESSAGE })
  }

  const parsed = validateContactBody(req.body)
  if (!parsed.ok) {
    return res.status(400).json({ ok: false, error: parsed.error })
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim()
  if (!webhook) {
    console.error('[contact] CONTACT_WEBHOOK_URL no está configurada')
    return res.status(500).json({ ok: false, error: DELIVERY_ERROR })
  }

  const payload = {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
    source: 'djapp-contact-form',
  }

  try {
    await deliverToWebhook(payload, webhook)
    console.info('[contact]', JSON.stringify(payload))
    return res.status(200).json({
      ok: true,
      message: SUCCESS_MESSAGE,
    })
  } catch (err) {
    console.error('[contact] error', err)
    return res.status(500).json({
      ok: false,
      error: DELIVERY_ERROR,
    })
  }
}

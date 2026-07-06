import type { VercelRequest, VercelResponse } from '@vercel/node'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s+()-]{6,20}$/
const SERVICES = new Set(['dj', 'musica', 'web'])
const OPCIONES_DJ = new Set(['basico', 'estandar', 'full'])

type ContactPayload = {
  name: string
  lastname: string
  email: string
  phone: string
  message: string
  service: string
  opcionDj: string
}

function trimField(value: unknown, max = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function validateBody(body: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Datos del formulario inválidos.' }
  }

  const raw = body as Record<string, unknown>
  const name = trimField(raw.name, 80)
  const lastname = trimField(raw.lastname, 80)
  const email = trimField(raw.email, 120)
  const phone = trimField(raw.phone, 30)
  const message = trimField(raw.message, 4000)
  const service = trimField(raw.service, 20)
  const opcionDj = trimField(raw.opcionDj, 20)

  if (name.length < 2) return { ok: false, error: 'El nombre es obligatorio (mínimo 2 caracteres).' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Ingresá un email válido.' }
  if (!PHONE_RE.test(phone)) return { ok: false, error: 'Ingresá un teléfono válido.' }
  if (!SERVICES.has(service)) return { ok: false, error: 'Seleccioná un servicio válido.' }
  if (message.length < 10) return { ok: false, error: 'El mensaje debe tener al menos 10 caracteres.' }
  if (opcionDj && !OPCIONES_DJ.has(opcionDj)) {
    return { ok: false, error: 'La opción de DJ seleccionada no es válida.' }
  }

  return {
    ok: true,
    data: { name, lastname, email, phone, message, service, opcionDj },
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido.' })
  }

  const parsed = validateBody(req.body)
  if (!parsed.ok) {
    return res.status(400).json({ ok: false, error: parsed.error })
  }

  const { data } = parsed
  const receivedAt = new Date().toISOString()

  const payload = {
    ...data,
    receivedAt,
    source: 'djapp-contact-form',
  }

  try {
    const webhook = process.env.CONTACT_WEBHOOK_URL
    if (webhook) {
      const whRes = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!whRes.ok) {
        console.error('CONTACT_WEBHOOK_URL respondió', whRes.status)
      }
    }

    console.info('[contact]', JSON.stringify(payload))

    return res.status(200).json({
      ok: true,
      message: '¡Consulta recibida! Te contactaré a la brevedad.',
    })
  } catch (err) {
    console.error('[contact] error', err)
    return res.status(500).json({
      ok: false,
      error: 'No se pudo procesar la consulta. Intentá de nuevo o escribinos por WhatsApp.',
    })
  }
}

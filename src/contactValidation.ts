export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^[\d\s+()-]{6,20}$/

export const CONTACT_SERVICES = ['dj', 'musica', 'web'] as const
export const CONTACT_OPCIONES_DJ = ['basico', 'estandar', 'full'] as const

const SERVICE_SET = new Set<string>(CONTACT_SERVICES)
const OPCION_SET = new Set<string>(CONTACT_OPCIONES_DJ)

export type ContactPayload = {
  name: string
  lastname: string
  email: string
  phone: string
  message: string
  service: string
  opcionDj: string
}

export type ContactValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string }

export function trimField(value: unknown, max = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function honeypotFilled(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false
  const website = trimField((body as Record<string, unknown>).website, 200)
  return website.length > 0
}

export function validateContactFields(raw: Record<string, unknown>): ContactValidationResult {
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
  if (!SERVICE_SET.has(service)) return { ok: false, error: 'Seleccioná un servicio válido.' }
  if (message.length < 10) return { ok: false, error: 'El mensaje debe tener al menos 10 caracteres.' }
  if (opcionDj && !OPCION_SET.has(opcionDj)) {
    return { ok: false, error: 'La opción de DJ seleccionada no es válida.' }
  }

  return {
    ok: true,
    data: { name, lastname, email, phone, message, service, opcionDj },
  }
}

export function validateContactBody(body: unknown): ContactValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Datos del formulario inválidos.' }
  }
  return validateContactFields(body as Record<string, unknown>)
}

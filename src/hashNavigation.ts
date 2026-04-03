import type { OpcionDiscotecaId, ServicioId } from './types'

/** Secciones principales (orden = orden en la página, para scroll spy). */
export const APP_SECTION_IDS = [
  'home',
  'about',
  'services',
  'galeria',
  'resenas',
  'form',
  'social',
] as const

export type AppSectionId = (typeof APP_SECTION_IDS)[number]

/** Anclas permitidas fuera de secciones completas (p. ej. bloque remix dentro de servicios). */
export const EXTRA_ALLOWED_HASH_IDS = ['remix'] as const
export type ExtraHashId = (typeof EXTRA_ALLOWED_HASH_IDS)[number]

export const SERVICIO_TO_SLUG: Record<ServicioId, string> = {
  dj: 'djydiscoteca',
  musica: 'musica',
  web: 'web',
}

export const SLUG_TO_SERVICIO: Record<string, ServicioId> = {
  djydiscoteca: 'dj',
  musica: 'musica',
  web: 'web',
}

const OPCION_DISCOTECA_SLUGS: OpcionDiscotecaId[] = ['basico', 'estandar', 'full']

export type ParsedAppHash =
  | { kind: 'empty' }
  | { kind: 'section'; id: AppSectionId }
  | { kind: 'anchor'; id: ExtraHashId }
  | { kind: 'services'; servicio: ServicioId; opcion: OpcionDiscotecaId | null }
  | { kind: 'services-root' }
  | { kind: 'invalid' }

export function parseAppHash(hash: string): ParsedAppHash {
  const h = hash.startsWith('#') ? hash.slice(1) : hash
  let decoded: string
  try {
    decoded = decodeURIComponent(h).trim()
  } catch {
    return { kind: 'invalid' }
  }

  if (!decoded) return { kind: 'empty' }

  if (decoded.includes('..') || decoded.includes('\\')) return { kind: 'invalid' }

  if (decoded === 'services') return { kind: 'services-root' }

  if (decoded.startsWith('services/')) {
    const parts = decoded.slice('services/'.length).split('/').filter(Boolean)
    const slug = parts[0] || ''
    const servicio = SLUG_TO_SERVICIO[slug]
    if (!servicio) return { kind: 'services-root' }
    let opcion: OpcionDiscotecaId | null = null
    if (servicio === 'dj' && parts[1] && OPCION_DISCOTECA_SLUGS.includes(parts[1] as OpcionDiscotecaId)) {
      opcion = parts[1] as OpcionDiscotecaId
    }
    return { kind: 'services', servicio, opcion }
  }

  if (decoded.includes('/')) return { kind: 'invalid' }

  if ((APP_SECTION_IDS as readonly string[]).includes(decoded)) {
    return { kind: 'section', id: decoded as AppSectionId }
  }
  if ((EXTRA_ALLOWED_HASH_IDS as readonly string[]).includes(decoded)) {
    return { kind: 'anchor', id: decoded as ExtraHashId }
  }

  return { kind: 'invalid' }
}

export function scrollToHashTarget(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior, block: 'start' })
}

/** Sección cuya parte superior ha pasado la línea de activación (comportamiento tipo scrollspy). */
export function getScrollSpySection(): AppSectionId {
  const activateAt = window.innerHeight * 0.32
  let current: AppSectionId = 'home'
  for (const id of APP_SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = el.getBoundingClientRect().top
    if (top <= activateAt) current = id
  }
  return current
}

export function replaceHash(nextHash: string) {
  const path = window.location.pathname + window.location.search
  const next = nextHash.startsWith('#') ? nextHash : `#${nextHash}`
  if (window.location.hash === next) return
  window.history.replaceState(null, '', path + next)
}

/** Si el hash no está permitido, fuerza #home (protección de “rutas”). */
export function guardHashOrRedirect(): ParsedAppHash {
  const parsed = parseAppHash(window.location.hash)
  const raw = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash

  if (parsed.kind === 'invalid') {
    replaceHash('home')
    return { kind: 'section', id: 'home' }
  }
  if (parsed.kind === 'empty') {
    replaceHash('home')
    return { kind: 'section', id: 'home' }
  }
  if (parsed.kind === 'services-root' && raw !== 'services' && raw.startsWith('services/')) {
    replaceHash('services')
  }
  return parsed
}

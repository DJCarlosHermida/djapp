import { useEffect, useRef } from 'react'
import type { OpcionDiscotecaId, ServicioId } from '../types'
import {
  SERVICIO_TO_SLUG,
  guardHashOrRedirect,
  getScrollSpySection,
  replaceHash,
  scrollToHashTarget,
} from '../hashNavigation'
import type { ParsedAppHash } from '../hashNavigation'

type UseAppHashNavigationOptions = {
  servicioSeleccionado: ServicioId | null
  opcionDiscoteca: OpcionDiscotecaId | null
  setServicioSeleccionado: (v: ServicioId | null) => void
  setOpcionDiscoteca: (v: OpcionDiscotecaId | null) => void
  initialServicio: ServicioId | null
}

export function useAppHashNavigation({
  servicioSeleccionado,
  opcionDiscoteca,
  setServicioSeleccionado,
  setOpcionDiscoteca,
  initialServicio,
}: UseAppHashNavigationOptions) {
  const servicesContainerRef = useRef<HTMLElement | null>(null)
  const prevServicioRef = useRef<ServicioId | null>(initialServicio)

  const applyParsedHash = (parsed: ParsedAppHash) => {
    switch (parsed.kind) {
      case 'section':
        setServicioSeleccionado(null)
        setOpcionDiscoteca(null)
        requestAnimationFrame(() => scrollToHashTarget(parsed.id, 'auto'))
        break
      case 'anchor':
        setServicioSeleccionado(null)
        setOpcionDiscoteca(null)
        requestAnimationFrame(() => scrollToHashTarget(parsed.id, 'auto'))
        break
      case 'services-root':
        setServicioSeleccionado(null)
        setOpcionDiscoteca(null)
        requestAnimationFrame(() => scrollToHashTarget('services', 'auto'))
        break
      case 'services':
        setServicioSeleccionado(parsed.servicio)
        setOpcionDiscoteca(parsed.servicio === 'dj' ? parsed.opcion : null)
        requestAnimationFrame(() => scrollToHashTarget('services', 'auto'))
        break
      case 'empty':
        setServicioSeleccionado(null)
        setOpcionDiscoteca(null)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!servicioSeleccionado) setOpcionDiscoteca(null)
  }, [servicioSeleccionado, setOpcionDiscoteca])

  useEffect(() => {
    if (!servicioSeleccionado) return
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesContainerRef.current && !servicesContainerRef.current.contains(e.target as Node)) {
        setServicioSeleccionado(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [servicioSeleccionado, setServicioSeleccionado])

  useEffect(() => {
    const parsed = guardHashOrRedirect()
    applyParsedHash(parsed)
    const onHashChange = () => {
      const p = guardHashOrRedirect()
      applyParsedHash(p)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
    // Montaje inicial únicamente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!servicioSeleccionado) return
    const slug = SERVICIO_TO_SLUG[servicioSeleccionado]
    const child = servicioSeleccionado === 'dj' && opcionDiscoteca ? `/${opcionDiscoteca}` : ''
    replaceHash(`services/${slug}${child}`)
  }, [servicioSeleccionado, opcionDiscoteca])

  useEffect(() => {
    const prev = prevServicioRef.current
    prevServicioRef.current = servicioSeleccionado
    if (prev !== null && servicioSeleccionado === null) {
      replaceHash(getScrollSpySection())
    }
  }, [servicioSeleccionado])

  useEffect(() => {
    if (servicioSeleccionado) return undefined

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        replaceHash(getScrollSpySection())
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    requestAnimationFrame(() => {
      requestAnimationFrame(onScroll)
    })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [servicioSeleccionado])

  return { servicesContainerRef }
}

import React, { useState, useEffect, useRef } from 'react'
import {
  Navbar,
  Hero,
  Footer,
  AboutSection,
  SocialSection,
  ServicesSection,
  ResenasSection,
  GaleriaSection,
  ContactSection,
  YouSong,
} from './components'
import type { Evento, OpcionDiscotecaId, ServicioId } from './types'
import { IDLE_TIMEOUT_MS, SCROLL_THRESHOLD, THROTTLE_MS } from './data'
import {
  SERVICIO_TO_SLUG,
  parseAppHash,
  guardHashOrRedirect,
  getScrollSpySection,
  replaceHash,
  scrollToHashTarget,
} from './hashNavigation'
import type { ParsedAppHash } from './hashNavigation'

const App: React.FC = () => {
  const [routePath, setRoutePath] = useState(() => normalizeRoutePath(window.location.pathname))
  const [equalizerActive, setEqualizerActive] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)
  const [cotizacionServicio, setCotizacionServicio] = useState<ServicioId | null>(null)
  const [cotizacionOpcionDj, setCotizacionOpcionDj] = useState<OpcionDiscotecaId | null>(null)

  const initialServices = (() => {
    const p = parseAppHash(window.location.hash)
    if (p.kind === 'services') return { servicio: p.servicio, opcion: p.opcion }
    return { servicio: null as ServicioId | null, opcion: null as OpcionDiscotecaId | null }
  })()

  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioId | null>(initialServices.servicio)
  const [opcionDiscoteca, setOpcionDiscoteca] = useState<OpcionDiscotecaId | null>(initialServices.opcion)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTriggerRef = useRef(0)
  const servicesContainerRef = useRef<HTMLElement | null>(null)
  const prevServicioRef = useRef<ServicioId | null>(initialServices.servicio)

  const THEME_KEY = 'djcarloshermida-theme'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null
      if (saved === 'dark' || saved === 'light') return saved
    } catch (_) {}
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (_) {}
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    const handleRouteChange = () => setRoutePath(normalizeRoutePath(window.location.pathname))

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const startIdleOffTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setEqualizerActive(false), IDLE_TIMEOUT_MS)
  }

  const onActivity = (skipThrottle = false) => {
    const now = Date.now()
    if (!skipThrottle && now - lastTriggerRef.current < THROTTLE_MS) return
    lastTriggerRef.current = now
    setEqualizerActive(true)
    startIdleOffTimer()
  }

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMouseMove = () => onActivity(false)
    const onClick = () => onActivity(true)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!servicioSeleccionado) setOpcionDiscoteca(null)
  }, [servicioSeleccionado])

  useEffect(() => {
    if (!servicioSeleccionado) return
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesContainerRef.current && !servicesContainerRef.current.contains(e.target as Node)) {
        setServicioSeleccionado(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [servicioSeleccionado])

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
    const parsed = guardHashOrRedirect()
    applyParsedHash(parsed)
    const onHashChange = () => {
      const p = guardHashOrRedirect()
      applyParsedHash(p)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const name = formData.get('name')?.toString() ?? ''
    const lastname = formData.get('lastname')?.toString() ?? ''
    const phone = formData.get('phone')?.toString() ?? ''
    const email = formData.get('Email')?.toString() ?? ''
    const message = formData.get('message')?.toString() ?? ''
    const service = formData.get('service')?.toString() ?? ''
    const opcionDj = formData.get('opcionDj')?.toString() ?? ''

    const servicioEtiqueta: Record<string, string> = {
      dj: 'DJ y Discoteca',
      musica: 'Producción musical y remixes',
      web: 'Programación web',
    }
    const opcionDjEtiqueta: Record<string, string> = {
      basico: 'Básico',
      estandar: 'Estándar',
      full: 'Full',
    }

    const lineas = [
      `Nombre: ${name}`.trim(),
      lastname ? `Apellido: ${lastname}` : '',
      `Email: ${email}`,
      `Teléfono: ${phone}`,
      service ? `Servicio: ${servicioEtiqueta[service] ?? service}` : '',
      opcionDj ? `Opción DJ: ${opcionDjEtiqueta[opcionDj] ?? opcionDj}` : '',
      '',
      'Mensaje:',
      message,
    ].filter(Boolean)

    const body = lineas.join('\n')
    const subject =
      `Consulta web | ${[name, lastname].filter(Boolean).join(' ')}`.replace(/\s+/g, ' ').trim() ||
      'Consulta web DJ Carlos Hermida'

    const mailto = `mailto:djcarloshermida@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setCotizacionServicio(null)
    setCotizacionOpcionDj(null)
    formElement.reset()
    window.location.href = mailto
  }

  const handleCotizarServicio = (payload: { servicio: ServicioId; opcionDiscoteca: OpcionDiscotecaId | null }) => {
    setCotizacionServicio(payload.servicio)
    setCotizacionOpcionDj(payload.opcionDiscoteca)
    requestAnimationFrame(() => {
      document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  if (routePath === '/yousong') {
    return <YouSong />
  }

  return (
    <>
      <Navbar
        equalizerActive={equalizerActive}
        navScrolled={navScrolled}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Hero />
      <main>
        <AboutSection />
        <ServicesSection
          ref={servicesContainerRef}
          servicioSeleccionado={servicioSeleccionado}
          onSelectServicio={setServicioSeleccionado}
          opcionDiscoteca={opcionDiscoteca}
          onSelectOpcionDiscoteca={setOpcionDiscoteca}
          onCotizar={handleCotizarServicio}
        />
        <GaleriaSection
          eventoSeleccionado={eventoSeleccionado}
          onSelectEvento={setEventoSeleccionado}
        />
        <ResenasSection />
        <ContactSection
          onSubmit={handleSubmit}
          initialServicio={cotizacionServicio}
          initialOpcionDiscoteca={cotizacionOpcionDj}
        />
        <SocialSection />
      </main>
      <Footer />
    </>
  )
}

const normalizeRoutePath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '')
  return normalizedPath || '/'
}

export default App

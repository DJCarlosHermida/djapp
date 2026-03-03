import React, { useState, useEffect, useRef } from 'react'
import {
  Navbar,
  Hero,
  Footer,
  AboutSection,
  SocialSection,
  ServicesSection,
  GaleriaSection,
  ContactSection,
} from './components'
import type { Evento, OpcionDiscotecaId, ServicioId } from './types'
import { IDLE_TIMEOUT_MS, SCROLL_THRESHOLD, THROTTLE_MS } from './data'

const SERVICIO_TO_SLUG: Record<ServicioId, string> = {
  dj: 'djydiscoteca',
  musica: 'musica',
  web: 'web',
}
const SLUG_TO_SERVICIO: Record<string, ServicioId> = {
  djydiscoteca: 'dj',
  musica: 'musica',
  web: 'web',
}

const OPCION_DISCOTECA_SLUGS: OpcionDiscotecaId[] = ['basico', 'estandar', 'full']

function parseServicesHash(): { servicio: ServicioId | null; opcion: OpcionDiscotecaId | null } {
  const hash = window.location.hash.slice(1)
  if (!hash.startsWith('services/')) return { servicio: null, opcion: null }
  const parts = hash.slice('services/'.length).split('/').filter(Boolean)
  const slug = parts[0] || ''
  const servicio = SLUG_TO_SERVICIO[slug] ?? null
  let opcion: OpcionDiscotecaId | null = null
  if (servicio === 'dj' && parts[1] && OPCION_DISCOTECA_SLUGS.includes(parts[1] as OpcionDiscotecaId)) {
    opcion = parts[1] as OpcionDiscotecaId
  }
  return { servicio, opcion }
}

const App: React.FC = () => {
  const [equalizerActive, setEqualizerActive] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)
  const parsed = () => parseServicesHash()
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioId | null>(() => parsed().servicio)
  const [opcionDiscoteca, setOpcionDiscoteca] = useState<OpcionDiscotecaId | null>(() => parsed().opcion)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTriggerRef = useRef(0)
  const servicesContainerRef = useRef<HTMLElement | null>(null)

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

  // Sincronizar URL #services/slug y #services/slug/hijo al seleccionar servicio u opción
  useEffect(() => {
    if (servicioSeleccionado) {
      const slug = SERVICIO_TO_SLUG[servicioSeleccionado]
      const child = servicioSeleccionado === 'dj' && opcionDiscoteca ? `/${opcionDiscoteca}` : ''
      window.history.replaceState(null, '', `#services/${slug}${child}`)
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + '#services')
    }
  }, [servicioSeleccionado, opcionDiscoteca])

  // Al cargar o al cambiar el hash, abrir servicio (y opción) y hacer scroll a #services
  useEffect(() => {
    const applyHash = () => {
      const { servicio, opcion } = parseServicesHash()
      if (servicio) {
        setServicioSeleccionado(servicio)
        setOpcionDiscoteca(servicio === 'dj' ? opcion : null)
        requestAnimationFrame(() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      } else {
        setServicioSeleccionado(null)
        setOpcionDiscoteca(null)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const name = formData.get('name')?.toString() ?? ''
    const phone = formData.get('phone')?.toString() ?? ''
    const email = formData.get('Email')?.toString() ?? ''
    const message = formData.get('message')?.toString() ?? ''

    const subject = `-Nombre ${name} -Teléfono ${phone} -Email ${email}`
    const mailto = `mailto:djcarloshermida@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

    formElement.reset()
    window.location.href = mailto
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
        <ServicesSection
          ref={servicesContainerRef}
          servicioSeleccionado={servicioSeleccionado}
          onSelectServicio={setServicioSeleccionado}
          opcionDiscoteca={opcionDiscoteca}
          onSelectOpcionDiscoteca={setOpcionDiscoteca}
        />
        <AboutSection />
        <GaleriaSection
          eventoSeleccionado={eventoSeleccionado}
          onSelectEvento={setEventoSeleccionado}
        />
        <ContactSection onSubmit={handleSubmit} />
        <SocialSection />
      </main>
      <Footer />
    </>
  )
}

export default App

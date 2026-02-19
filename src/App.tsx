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
} from './Components'
import type { Evento, ServicioId } from './types'
import { IDLE_TIMEOUT_MS, SCROLL_THRESHOLD, THROTTLE_MS } from './data'

const App: React.FC = () => {
  const [equalizerActive, setEqualizerActive] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioId | null>(null)
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
    if (!servicioSeleccionado) return
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesContainerRef.current && !servicesContainerRef.current.contains(e.target as Node)) {
        setServicioSeleccionado(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [servicioSeleccionado])

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

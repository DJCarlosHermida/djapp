import React, { useState } from 'react'
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
  WhatsAppFab,
} from './components'
import type { Evento, OpcionDiscotecaId, ServicioId } from './types'
import { parseAppHash } from './hashNavigation'
import { useTheme } from './hooks/useTheme'
import { useEqualizerActivity } from './hooks/useEqualizerActivity'
import { useNavScrolled } from './hooks/useNavScrolled'
import { useAppHashNavigation } from './hooks/useAppHashNavigation'
import { useContactForm } from './hooks/useContactForm'

const App: React.FC = () => {
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

  const { theme, toggleTheme } = useTheme()
  const equalizerActive = useEqualizerActivity()
  const navScrolled = useNavScrolled()
  const { servicesContainerRef } = useAppHashNavigation({
    servicioSeleccionado,
    opcionDiscoteca,
    setServicioSeleccionado,
    setOpcionDiscoteca,
    initialServicio: initialServices.servicio,
  })

  const { handleSubmit, status, errorMessage, successMessage } = useContactForm({
    onSuccess: () => {
      setCotizacionServicio(null)
      setCotizacionOpcionDj(null)
    },
  })

  const handleCotizarServicio = (payload: { servicio: ServicioId; opcionDiscoteca: OpcionDiscotecaId | null }) => {
    setCotizacionServicio(payload.servicio)
    setCotizacionOpcionDj(payload.opcionDiscoteca)
    requestAnimationFrame(() => {
      document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
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
          submitStatus={status}
          submitError={errorMessage}
          submitSuccess={successMessage}
          initialServicio={cotizacionServicio}
          initialOpcionDiscoteca={cotizacionOpcionDj}
        />
        <SocialSection />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}

export default App

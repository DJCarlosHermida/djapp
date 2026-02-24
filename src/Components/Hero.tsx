import React, { useState, useEffect } from 'react'
import { SCROLL_THRESHOLD } from '../data'

const Hero: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
  <header id="home" className={`hero d-flex align-items-center text-white${scrolled ? ' hero--scrolled' : ''}`}>
    <div className="hero-overlay"></div>
    <div className="container position-relative text-center text-md-start">
      <div className="row align-items-center g-4">
        <div className="col-md-7">
          <p className="text-uppercase small mb-2 text-accent">
            DJ y Discoteca para todo tipo de eventos...
          </p>
          <h1 className="display-3 fw-bold mb-3 hero-title">CARLOS HERMIDA</h1>
          <p className="lead mb-4 hero-subtitle">
            | Bodas | 15 Años | Despedidas | Desfiles | Amplificaciones | Infantiles | Eventos Empresariales |
          </p>
          <div className="d-flex flex-wrap gap-3">
            <a href="#form" className="btn btn-primary btn-lg rounded-pill px-4">
              Reserva tu fecha
            </a>
            <a href="#galeria" className="btn btn-outline-light btn-lg rounded-pill px-4">
              Ver Eventos
            </a>
          </div>
        </div>
        <div className="col-md-5 d-none d-md-block">
          <div className="hero-card shadow-lg rounded-4 p-4 bg-dark bg-opacity-75">
            <p className="mb-2 text-uppercase small text-accent">Experiencia</p>
            <h2 className="h3 mb-3" style={{ color: '#ff9f43' }}>Más de 20 años de trayectoria</h2>
            <p className="mb-3 small">
              DJ y Productor Uruguayo. Especializado en eventos sociales y corporativos. <br />
              - Bodas - 15 Años - Despedidas - Graduaciones - Infantiles - Empresariales - Desfiles - Amplificaciones . . . <br />
            </p>
            <ul className="list-unstyled small mb-0">
              <li><i style={{ color: '#ff9f43' }}>*</i> Servicio Integral Para Fiestas: DJ, sonido e iluminación . . .</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
  )
}

export default Hero

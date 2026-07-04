import React from 'react'
import { EQUALIZER_BARS } from '../data'
import UruguayFlag from './UruguayFlag'

type NavbarProps = {
  equalizerActive: boolean
  navScrolled: boolean
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

const Navbar: React.FC<NavbarProps> = ({ equalizerActive, navScrolled, theme, onToggleTheme }) => (
  <nav className={`navbar navbar-expand-lg navbar-dark bg-transparent fixed-top blur-navbar navbar-with-equalizer ${equalizerActive ? 'navbar--equalizer-active' : ''} ${navScrolled ? 'navbar--scrolled' : ''}`}>
    <div className="navbar-equalizer-bg" aria-hidden="true">
      {Array.from({ length: EQUALIZER_BARS }, (_, i) => (
        <span
          key={i}
          className="navbar-equalizer-bar"
          style={{ animationDelay: `${(i * 0.03) % 1}s` }}
        />
      ))}
    </div>
    <div className="container navbar-equalizer-content">
      <a className="navbar-brand fw-bold" href="#home">
        DJ Carlos Hermida | <i style={{ color: 'orange' }}> Music &amp; Web </i>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav gap-2">
          <li className="nav-item">
            <a className="nav-link" href="#home" title='Inicio'>Home</a>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link" href="#remix">Remix</a>
          </li> */}
          <li className="nav-item">
            <a className="nav-link" href="#services" title='Servicios'>Servicios</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#about" title='Sobre mí'>Sobre mí</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#galeria" title='Galería'>Galería</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#social" title='Redes Sociales'>Redes</a>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link theme-toggle btn btn-link border-0 p-2"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </li>
          <li className="nav-item d-flex align-items-center">
            <UruguayFlag size={24} className="nav-flag" />
          </li>
          <li className="nav-item">
            <a className="btn btn-sm btn-light ms-lg-3" href="#form" title='Contacto' >Contacto</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
)

export default Navbar

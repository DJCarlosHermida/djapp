import { forwardRef, useRef } from 'react'
import type { OpcionDiscotecaId, ServicioId } from '../types'
import { PORTFOLIO_LINKS, portfolioPreviewUrl, TECH_STACK } from '../data'

const OPCIONES_DISCOTECA: Array<{
  id: OpcionDiscotecaId
  nombre: string
  incluye: string
  descripcion: string
  precio: string
  videoUrl?: string
}> = [
  {
    id: 'basico',
    nombre: 'Servicio Básico',
    incluye: 'DJ + Audio JBL + Iluminación Básica',
    descripcion: 'Ideal para eventos íntimos o con presupuesto acotado. Incluye DJ con música en vivo, audio JBL profesional e iluminación básica para ambientar tu fiesta.',
    precio: '$8.000',
  },
  {
    id: 'estandar',
    nombre: 'Servicio Estándar',
    incluye: 'DJ + Audio JBL + Iluminación LED + Pantalla Gigante + Bola Espejos + Máquina de Humo',
    descripcion: 'La opción más elegida. Incluye todo lo del básico más pantalla gigante, bola de espejos y máquina de humo para darle otro nivel a tu evento.',
    precio: '$12.000',
  },
  {
    id: 'full',
    nombre: 'Servicio Full',
    incluye: 'DJ + Audio JBL + Iluminación LED + Show Laser + Pista LED + 2 Máquinas de Humo + Bolas Espejos',
    descripcion: 'Experiencia completa de discoteca. Todo lo del estándar más show láser, pista LED y doble máquina de humo para una fiesta inolvidable.',
    precio: '$21.000',
  },
]

type ServicesSectionProps = {
  servicioSeleccionado: ServicioId | null
  onSelectServicio: (id: ServicioId | null) => void
  opcionDiscoteca: OpcionDiscotecaId | null
  onSelectOpcionDiscoteca: (id: OpcionDiscotecaId | null) => void
}

const ServicesSection = forwardRef<HTMLElement, ServicesSectionProps>(
  function ServicesSectionInner({ servicioSeleccionado, onSelectServicio, opcionDiscoteca, onSelectOpcionDiscoteca }, ref) {
    const videoWrapperRef = useRef<HTMLDivElement>(null)

    const toggleFullscreen = () => {
      const el = videoWrapperRef.current
      if (!el) return
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch(() => {})
      } else {
        document.exitFullscreen()
      }
    }

    return (
      <section ref={ref} id="services" className="services-section py-5">
        <span id="remix" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />
        <div className="container">
          {!servicioSeleccionado ? (
        <>
          <h2 className="services-title h2 text-center mb-2" style={{ color: 'orange' }}>
            DJ, Music & Web
          </h2>
          <p className="services-subtitle text-center text-muted mb-5">
            Experiencia, equipamiento y versatilidad para tu proyecto.
          </p>
          <div className="row g-4">
            <div className="col-md-4">
              <div
                className="card h-100 pro-card"
                onClick={() => onSelectServicio('dj')}
                onKeyDown={(e) => e.key === 'Enter' && onSelectServicio('dj')}
                role="button"
                tabIndex={0}
                aria-label="Ver más sobre DJ para fiestas y eventos"
              >
                <div className="pro-card-accent" aria-hidden />
                <div className="card-body">
                  <div className="pro-card-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="h5 pro-card-title">DJ y Discoteca</h3>
                  <p className="pro-card-desc mb-0">
                    Para todo tipo de fiestas y eventosMusicalización profesional para fiestas de 15, casamientos, discotecas y eventos empresariales.
                    Sonido PA de alta calidad iluminación y Pista LED.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card h-100 pro-card"
                onClick={() => onSelectServicio('musica')}
                onKeyDown={(e) => e.key === 'Enter' && onSelectServicio('musica')}
                role="button"
                tabIndex={0}
                aria-label="Ver más sobre Producción Musical y Remixes"
              >
                <div className="pro-card-accent" aria-hidden />
                <div className="card-body">
                  <div className="pro-card-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <h3 className="h5 pro-card-title" id="remix">Producción Musical y Remixes</h3>
                  <p className="pro-card-desc mb-0">
                    Pistas originales (Cumbia, Electrónica, Rap, Trap, Reggaetón, Rock). <br />
                    Remix, spots y jingles. Grabación acapella y banda. <br />
                    Mezcla y mastering.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card h-100 pro-card"
                onClick={() => onSelectServicio('web')}
                onKeyDown={(e) => e.key === 'Enter' && onSelectServicio('web')}
                role="button"
                tabIndex={0}
                aria-label="Ver más sobre Programación Web y portfolio"
              >
                <div className="pro-card-accent" aria-hidden />
                <div className="card-body">
                  <div className="pro-card-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <h3 className="h5 pro-card-title">Programación Web</h3>
                  <p className="pro-card-desc mb-0">
                    Creación de aplicaciones web, SPA y tienda online (e-commerce). <br />
                    <strong><b>Frontend:</b></strong> React, TypeScript, Astro, Tailwind, Vite. <br />
                    <strong><b>Backend:</b></strong> Node.js, Express, Nest, Firebase, MongoDB, SQL, Testing.
                  </p>
                  <p className="galeria-label text-uppercase small mb-0 mt-2 text-center">Portfolio</p>
                </div>
              </div>
            </div>
          </div>
        </>
          ) : (
        <div className="services-detail">
          <button
            type="button"
            className="galeria-back btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
            onClick={() => onSelectServicio(null)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a servicios
          </button>
          <p className="services-label text-uppercase small mb-1">Servicio</p>
          {servicioSeleccionado === 'dj' && (
            <>
              {opcionDiscoteca == null ? (
                <>
                  <h2 className="services-title h2 mb-3">DJ y Discoteca</h2>
                  <p className="services-label text-uppercase small mb-3">Opciones de Discoteca</p>
                  <div className="row g-4">
                    {OPCIONES_DISCOTECA.map((opcion) => (
                      <div key={opcion.id} className="col-12 col-md-4">
                        <div
                          className="card h-100 border rounded-3 p-3 services-discoteca-card"
                          onClick={() => onSelectOpcionDiscoteca(opcion.id)}
                          onKeyDown={(e) => e.key === 'Enter' && onSelectOpcionDiscoteca(opcion.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Ver ${opcion.nombre}`}
                        >
                          <h3 className="h6 mb-2" style={{ color: 'orange' }}>{opcion.nombre}</h3>
                          <p className="small text-muted mb-2">{opcion.incluye}</p>
                          <p className="fw-bold mb-0 fs-5">{opcion.precio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (() => {
                const opcion = OPCIONES_DISCOTECA.find((o) => o.id === opcionDiscoteca)!
                return (
                  <>
                    <button
                      type="button"
                      className="galeria-back btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-3"
                      onClick={() => onSelectOpcionDiscoteca(null)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Volver a opciones
                    </button>
                    <h2 className="services-title h2 mb-2">{opcion.nombre}</h2>
                    <p className="text-muted mb-3">{opcion.descripcion}</p>
                    <p className="small text-muted mb-3">
                      <strong>Incluye:</strong> {opcion.incluye} — {opcion.precio}
                    </p>
                    <div
                      ref={videoWrapperRef}
                      className="services-discoteca-video-wrap position-relative rounded-3 overflow-hidden bg-dark mb-0"
                      style={{ width: '350px', maxWidth: '100%' }}
                    >
                      <div className="ratio ratio-16x9">
                        {opcion.videoUrl ? (
                          <iframe
                            title={`Video ${opcion.nombre}`}
                            src={opcion.videoUrl}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center text-white-50">
                            Video próximamente
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm position-absolute bottom-0 end-0 m-2 services-discoteca-video-fullscreen-btn"
                        onClick={toggleFullscreen}
                        title="Pantalla completa"
                        aria-label="Pantalla completa"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                      </button>
                    </div>
                  </>
                )
              })()}
            </>
          )}
          {servicioSeleccionado === 'musica' && (
            <>
              <h2 className="services-title h2 mb-3">Producción Musical y Remixes</h2>
              <p className="services-label text-uppercase small mb-2">Remix</p>
              <div className="services-soundcloud-wrap ratio ratio-16x9 rounded-3 overflow-hidden">
                <iframe
                  title="SoundCloud DJ Carlos Hermida - Producción y Remixes"
                  width="100%"
                  height="450"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1186284883&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"/>
              </div>
            </>
          )}
          {servicioSeleccionado === 'web' && (
            <>
              <h2 className="services-title h2 mb-2">Programación Web</h2>
              <p className="galeria-label text-uppercase small mb-4">Portfolio</p>
              <div className="row g-3">
                {PORTFOLIO_LINKS.map((item) => {
                  const thumbSrc =
                    item.thumbnail ?? (item.url !== '#' ? portfolioPreviewUrl(item.url) : null)
                  const body = (
                    <>
                      {thumbSrc ? (
                        <div className="ratio ratio-16x9 services-portfolio-thumb">
                          <img
                            src={thumbSrc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="services-portfolio-thumb__img"
                          />
                        </div>
                      ) : (
                        <div className="ratio ratio-16x9 services-portfolio-thumb services-portfolio-thumb--placeholder" aria-hidden>
                          <div className="services-portfolio-thumb__placeholder-inner">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="services-portfolio-thumb__placeholder-icon">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="services-portfolio-link__body p-3">
                        <span className="d-flex align-items-center justify-content-between gap-2">
                          <strong className="services-portfolio-link__title">{item.nombre}</strong>
                          {item.url !== '#' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="services-portfolio-link__ext flex-shrink-0">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          ) : (
                            <span className="badge bg-secondary flex-shrink-0">Próximamente</span>
                          )}
                        </span>
                        {item.descripcion && (
                          <p className="small services-portfolio-link__desc mb-0 mt-2">{item.descripcion}</p>
                        )}
                      </div>
                    </>
                  )
                  return (
                    <div key={item.nombre} className="col-12 col-md-6 col-lg-4">
                      {item.url !== '#' ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="services-portfolio-link card h-100 text-decoration-none border rounded-3 overflow-hidden p-0"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="services-portfolio-link card h-100 border rounded-3 overflow-hidden p-0 opacity-75">
                          {body}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="tech-stack mt-5 pt-4">
                <p className="galeria-label text-uppercase small mb-3">Tecnologías</p>
                <div className="tech-stack__grid">
                  {TECH_STACK.map((tech) => (
                    <div key={tech.slug} className="tech-stack__item" title={tech.name}>
                      {tech.fallbackIcon ? (
                        <span className="tech-stack__icon tech-stack__icon--fallback" style={{ color: tech.color ? `#${tech.color}` : undefined }} aria-hidden>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                        </span>
                      ) : (
                        <img
                          src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color ?? ''}`}
                          alt=""
                          width={32}
                          height={32}
                          className="tech-stack__icon"
                        />
                      )}
                      <span className="tech-stack__label">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
          )}
        </div>
      </section>
    );
  }
)

ServicesSection.displayName = 'ServicesSection'

export default ServicesSection

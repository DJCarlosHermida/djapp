import { forwardRef } from 'react'
import type { ServicioId } from '../types'
import { PORTFOLIO_LINKS } from '../data'

type ServicesSectionProps = {
  servicioSeleccionado: ServicioId | null
  onSelectServicio: (id: ServicioId | null) => void
}

const ServicesSection = forwardRef<HTMLElement, ServicesSectionProps>(
  function ServicesSectionInner({ servicioSeleccionado, onSelectServicio }, ref) {
    return (
  <section ref={ref} id="services" className="services-section py-5">
    <span id="remix" aria-hidden="true" style={{ position: 'absolute', top: 0 }} />
    <div className="container">
      {!servicioSeleccionado ? (
        <>
          <h2 className="services-title h2 text-center mb-2">
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
              <h2 className="services-title h2 mb-3">DJ y Discoteca</h2>
              <p className="text-muted mb-3">
                Servicio integral para fiestas y eventos: musicalización profesional, sonido PA e iluminación.
              </p>
              <ul className="list-unstyled text-muted mb-0">
                <li className="mb-2">· Bodas, 15 años, despedidas, desfiles, infantiles</li>
                <li className="mb-2">· Eventos empresariales y corporativos</li>
                <li className="mb-2">· Amplificación e iluminación profesional</li>
              </ul>
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
                {PORTFOLIO_LINKS.map((item) => (
                  <div key={item.nombre} className="col-12 col-md-6 col-lg-4">
                    {item.url !== '#' ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="services-portfolio-link card h-100 text-decoration-none border rounded-3 p-3"
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          <strong className="services-portfolio-link__title">{item.nombre}</strong>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </span>
                        {item.descripcion && <p className="small services-portfolio-link__desc mb-0 mt-2">{item.descripcion}</p>}
                      </a>
                    ) : (
                      <div className="services-portfolio-link card h-100 border rounded-3 p-3 opacity-75">
                        <span className="d-flex align-items-center justify-content-between">
                          <strong className="services-portfolio-link__title">{item.nombre}</strong>
                          <span className="badge bg-secondary">Próximamente</span>
                        </span>
                        {item.descripcion && <p className="small services-portfolio-link__desc mb-0 mt-2">{item.descripcion}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  </section>
    )
  }
)

ServicesSection.displayName = 'ServicesSection'

export default ServicesSection

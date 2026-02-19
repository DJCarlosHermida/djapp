import React from 'react'
import type { Evento } from '../types'
import { EVENTOS_GALERIA } from '../data'

type GaleriaSectionProps = {
  eventoSeleccionado: Evento | null
  onSelectEvento: (ev: Evento | null) => void
}

const GaleriaSection: React.FC<GaleriaSectionProps> = ({ eventoSeleccionado, onSelectEvento }) => (
  <section id="galeria" className="galeria-section py-5">
    <div className="container">
      {!eventoSeleccionado ? (
        <>
          <h2 className="galeria-title h2 text-center mb-2">Galería de eventos</h2>
          <div className="row g-4 galeria-grid">
            {EVENTOS_GALERIA.map((ev) => (
              <div key={ev.id} className="col-md-6 col-lg-4">
                {ev.instagramHighlightUrl ? (
                  <a
                    href={ev.instagramHighlightUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="galeria-card card h-100 text-decoration-none"
                    aria-label={`Ver ${ev.nombre} en Instagram`}
                  >
                    <div className="galeria-card-img-wrap ratio ratio-16x9 overflow-hidden">
                      <img
                        src={ev.portada}
                        alt=""
                        className="object-fit-cover galeria-card-img"
                        loading="lazy"
                      />
                      <div className="galeria-card-overlay">
                        <span className="galeria-card-cta">Ver en Instagram</span>
                        <span className="galeria-card-count">Destacada</span>
                      </div>
                    </div>
                    <div className="card-body galeria-card-body">
                      <h3 className="h5 card-title mb-1">{ev.nombre}</h3>
                      {(ev.fecha || ev.lugar) && (
                        <p className="small text-muted mb-0">
                          {[ev.fecha, ev.lugar].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </a>
                ) : (
                  <div
                    className="galeria-card card h-100"
                    onClick={() => onSelectEvento(ev)}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectEvento(ev)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver galería de ${ev.nombre}`}
                  >
                    <div className="galeria-card-img-wrap ratio ratio-16x9 overflow-hidden">
                      <img
                        src={ev.portada}
                        alt=""
                        className="object-fit-cover galeria-card-img"
                        loading="lazy"
                      />
                      <div className="galeria-card-overlay">
                        <span className="galeria-card-cta">Ver galería</span>
                        <span className="galeria-card-count">{ev.items.length} fotos</span>
                      </div>
                    </div>
                    <div className="card-body galeria-card-body">
                      <h3 className="h5 card-title mb-1">{ev.nombre}</h3>
                      {(ev.fecha || ev.lugar) && (
                        <p className="small text-muted mb-0">
                          {[ev.fecha, ev.lugar].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            className="galeria-back btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
            onClick={() => onSelectEvento(null)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a galería
          </button>
          <p className="galeria-label text-uppercase small mb-1">{eventoSeleccionado.fecha ?? 'Evento'}</p>
          <h2 className="galeria-title h2 mb-2">{eventoSeleccionado.nombre}</h2>
          {eventoSeleccionado.lugar && (
            <p className="text-muted mb-4">{eventoSeleccionado.lugar}</p>
          )}
          <div className="row g-3 galeria-media-grid">
            {eventoSeleccionado.items.map((item) => (
              <div key={item.id} className="col-6 col-md-4 col-lg-3">
                <div className="galeria-media-item rounded overflow-hidden shadow-sm">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title ?? ''}
                      className="galeria-media-img img-fluid"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="galeria-media-video w-100"
                      poster={item.thumbnail}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </section>
)

export default GaleriaSection

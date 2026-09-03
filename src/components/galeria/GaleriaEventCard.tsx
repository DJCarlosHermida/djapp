import React from 'react'
import type { Evento } from '../../types'
import { eventoPortadaUrl } from '../../data'
import { etiquetaContenido } from './galeriaUtils'

type GaleriaEventCardProps = {
  ev: Evento
  stagger: number
  imagenError: boolean
  onImagenError: () => void
  onSelectEvento: (ev: Evento) => void
}

function CardBody({ ev }: { ev: Evento }) {
  return (
    <div className="card-body galeria-card-body">
      {ev.categoria && <span className="galeria-card-badge">{ev.categoria}</span>}
      <h3 className="h5 card-title mb-1">{ev.nombre}</h3>
      {(ev.fecha || ev.lugar) && (
        <p className="small text-muted mb-0">
          {[ev.fecha, ev.lugar].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  )
}

function CardCover({
  ev,
  portada,
  imagenError,
  onImagenError,
  cta,
  count,
}: {
  ev: Evento
  portada: string
  imagenError: boolean
  onImagenError: () => void
  cta: string
  count: string
}) {
  return (
    <div className="galeria-card-img-wrap ratio ratio-16x9 overflow-hidden">
      <img
        src={portada}
        alt={`Portada del evento ${ev.nombre}`}
        className="object-fit-cover galeria-card-img"
        loading="lazy"
        decoding="async"
        onError={onImagenError}
      />
      {imagenError && (
        <div className="galeria-media-fallback">
          <span>No se pudo cargar la portada</span>
        </div>
      )}
      <div className="galeria-card-overlay">
        <span className="galeria-card-cta">{cta}</span>
        <span className="galeria-card-count">{count}</span>
      </div>
    </div>
  )
}

const GaleriaEventCard: React.FC<GaleriaEventCardProps> = ({
  ev,
  stagger,
  imagenError,
  onImagenError,
  onSelectEvento,
}) => {
  const portada = eventoPortadaUrl(ev)
  const label = etiquetaContenido(ev)

  return (
    <div
      className="col-12 col-sm-6 col-lg-4 galeria-grid__cell"
      style={{ '--galeria-stagger': stagger } as React.CSSProperties}
    >
      {ev.instagramHighlightUrl ? (
        <a
          href={ev.instagramHighlightUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="galeria-card card h-100 text-decoration-none"
          aria-label={`Ver ${ev.nombre} en Instagram`}
        >
          <CardCover
            ev={ev}
            portada={portada}
            imagenError={imagenError}
            onImagenError={onImagenError}
            cta="Ver en Instagram"
            count={label || 'Destacada'}
          />
          <CardBody ev={ev} />
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
          <CardCover
            ev={ev}
            portada={portada}
            imagenError={imagenError}
            onImagenError={onImagenError}
            cta="Ver galería"
            count={label}
          />
          <CardBody ev={ev} />
        </div>
      )}
    </div>
  )
}

export default GaleriaEventCard

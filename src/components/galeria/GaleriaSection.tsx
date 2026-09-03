import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Evento } from '../../types'
import { EVENTOS_GALERIA } from '../../data'
import { useGaleriaLightbox } from '../../hooks/useGaleriaLightbox'
import { useImageErrors } from '../../hooks/useImageErrors'
import { useShareFeedback } from '../../hooks/useShareFeedback'
import GaleriaEventCard from './GaleriaEventCard'
import GaleriaFilterBar from './GaleriaFilterBar'
import GaleriaLightbox from './GaleriaLightbox'
import GaleriaMediaGrid from './GaleriaMediaGrid'

type GaleriaSectionProps = {
  eventoSeleccionado: Evento | null
  onSelectEvento: (ev: Evento | null) => void
}

const GaleriaSection: React.FC<GaleriaSectionProps> = ({ eventoSeleccionado, onSelectEvento }) => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [inlineYoutubePlayingId, setInlineYoutubePlayingId] = useState<string | null>(null)
  const inlinePlayerWrapRef = useRef<HTMLDivElement>(null)
  const { imagenesConError, marcarImagenError } = useImageErrors()

  const items = eventoSeleccionado?.items ?? []
  const lightbox = useGaleriaLightbox(items)
  const shareUrl = lightbox.itemModal?.url ?? ''
  const { feedbackToast, copiarEnlace, compartir } = useShareFeedback({
    shareUrl,
    itemModal: lightbox.itemModal,
    eventoNombre: eventoSeleccionado?.nombre,
  })

  const categorias = useMemo(() => {
    const set = new Set<string>()
    EVENTOS_GALERIA.forEach((ev) => {
      if (ev.categoria) set.add(ev.categoria)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [])

  const eventosFiltrados = useMemo(() => {
    if (filtroCategoria === 'todos') return EVENTOS_GALERIA
    return EVENTOS_GALERIA.filter((ev) => ev.categoria === filtroCategoria)
  }, [filtroCategoria])

  useEffect(() => {
    setInlineYoutubePlayingId(null)
  }, [eventoSeleccionado?.id])

  return (
    <section id="galeria" className="galeria-section py-5">
      <div className="container galeria-section__content">
        {!eventoSeleccionado ? (
          <>
            <header className="galeria-header text-center mx-auto">
              <h2 className="galeria-title h2 mb-3">Galería de eventos</h2>
              <div className="galeria-header__rule mx-auto" aria-hidden />
              <p className="galeria-header__count small text-muted mb-0">
                {eventosFiltrados.length === 0
                  ? 'Sin álbumes en este filtro'
                  : `${eventosFiltrados.length} ${eventosFiltrados.length === 1 ? 'álbum' : 'álbumes'}`}
              </p>
            </header>

            <GaleriaFilterBar
              categorias={categorias}
              filtroCategoria={filtroCategoria}
              onSelectCategoria={setFiltroCategoria}
            />

            {eventosFiltrados.length === 0 ? (
              <div className="galeria-empty text-center mx-auto">
                <p className="galeria-empty__title mb-1">No hay eventos en esta categoría</p>
                <p className="galeria-empty__hint small text-muted mb-0">Probá con otro filtro o volvé a «Todos».</p>
              </div>
            ) : (
              <div key={filtroCategoria} className="row g-4 galeria-grid galeria-grid--events">
                {eventosFiltrados.map((ev, index) => (
                  <GaleriaEventCard
                    key={ev.id}
                    ev={ev}
                    stagger={Math.min(index, 16)}
                    imagenError={imagenesConError.has(`portada-${ev.id}`)}
                    onImagenError={() => marcarImagenError(`portada-${ev.id}`)}
                    onSelectEvento={onSelectEvento}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className="galeria-back btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-3"
              onClick={() => onSelectEvento(null)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver a galería
            </button>
            <header className="galeria-event-header">
              <div className="d-flex flex-column flex-md-row flex-md-wrap align-items-start justify-content-between gap-3 gap-md-4">
                <div className="galeria-event-header__titles">
                  <p className="galeria-label text-uppercase small mb-2">{eventoSeleccionado.fecha ?? 'Evento'}</p>
                  <h2 className="galeria-title h2 mb-0">{eventoSeleccionado.nombre}</h2>
                  {eventoSeleccionado.lugar && (
                    <p className="galeria-event-header__place text-muted mb-0 mt-2">{eventoSeleccionado.lugar}</p>
                  )}
                </div>
                <div className="galeria-event-meta d-flex flex-wrap gap-2 align-items-center">
                  {eventoSeleccionado.categoria && (
                    <span className="galeria-event-pill">{eventoSeleccionado.categoria}</span>
                  )}
                  <span className="galeria-event-pill galeria-event-pill--muted">
                    {eventoSeleccionado.items.length}{' '}
                    {eventoSeleccionado.items.length === 1 ? 'ítem' : 'ítems'}
                  </span>
                </div>
              </div>
            </header>
            <GaleriaMediaGrid
              items={eventoSeleccionado.items}
              eventoNombre={eventoSeleccionado.nombre}
              imagenesConError={imagenesConError}
              marcarImagenError={marcarImagenError}
              inlineYoutubePlayingId={inlineYoutubePlayingId}
              onPlayInline={setInlineYoutubePlayingId}
              inlinePlayerWrapRef={inlinePlayerWrapRef}
              onOpenItem={lightbox.openItem}
              onRememberFocus={lightbox.rememberFocus}
            />

            {lightbox.itemModal && (
              <GaleriaLightbox
                itemModal={lightbox.itemModal}
                items={items}
                currentIndex={lightbox.currentIndex}
                eventoNombre={eventoSeleccionado.nombre}
                feedbackToast={feedbackToast}
                overlayRef={lightbox.modalOverlayRef}
                closeButtonRef={lightbox.closeButtonRef}
                youtubeWrapRef={lightbox.lightboxYoutubeWrapRef}
                touchStartXRef={lightbox.touchStartXRef}
                onClose={lightbox.closeModal}
                onPrev={lightbox.goPrev}
                onNext={lightbox.goNext}
                onShare={compartir}
                onCopyLink={copiarEnlace}
                onToggleYoutubeFullscreen={lightbox.toggleYoutubeFullscreen}
                onImagenError={marcarImagenError}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default GaleriaSection

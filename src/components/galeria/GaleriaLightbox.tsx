import React from 'react'
import type { MediaItem } from '../../types'
import { youtubeEmbedSrc } from '../../data'
import type { ShareFeedbackToast } from '../../hooks/useShareFeedback'

type GaleriaLightboxProps = {
  itemModal: MediaItem
  items: MediaItem[]
  currentIndex: number
  eventoNombre?: string
  feedbackToast: ShareFeedbackToast | null
  overlayRef: React.RefObject<HTMLDivElement | null>
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
  youtubeWrapRef: React.RefObject<HTMLDivElement | null>
  touchStartXRef: React.MutableRefObject<number | null>
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onShare: () => void
  onCopyLink: () => void
  onToggleYoutubeFullscreen: () => void
  onImagenError: (key: string) => void
}

const GaleriaLightbox: React.FC<GaleriaLightboxProps> = ({
  itemModal,
  items,
  currentIndex,
  eventoNombre,
  feedbackToast,
  overlayRef,
  closeButtonRef,
  youtubeWrapRef,
  touchStartXRef,
  onClose,
  onPrev,
  onNext,
  onShare,
  onCopyLink,
  onToggleYoutubeFullscreen,
  onImagenError,
}) => {
  const modalYoutubeEmbed = youtubeEmbedSrc(itemModal.url)

  return (
    <div
      ref={overlayRef}
      className="galeria-modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-3"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada"
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="galeria-modal-close btn btn-light btn-sm rounded-circle p-2"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {items.length > 1 && currentIndex > 0 && (
        <button
          type="button"
          className="galeria-modal-nav galeria-modal-nav--prev btn btn-light rounded-circle"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Anterior"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      {items.length > 1 && currentIndex >= 0 && currentIndex < items.length - 1 && (
        <button
          type="button"
          className="galeria-modal-nav galeria-modal-nav--next btn btn-light rounded-circle"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Siguiente"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div
        className="galeria-modal-inner d-flex flex-column align-items-center"
        style={{ maxWidth: 'min(96vw, 1200px)', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartXRef.current = e.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          const startX = touchStartXRef.current
          const endX = e.changedTouches[0]?.clientX
          touchStartXRef.current = null
          if (startX == null || endX == null || items.length <= 1) return
          const deltaX = endX - startX
          if (Math.abs(deltaX) < 45) return
          if (deltaX > 0) onPrev()
          else onNext()
        }}
      >
        <div className="galeria-modal-toolbar w-100 mb-3">
          <div className="galeria-modal-bar d-flex flex-wrap align-items-center justify-content-center gap-2 py-2 px-3">
            {items.length > 1 && currentIndex >= 0 && (
              <span className="galeria-modal-counter small text-white-50 me-md-1">
                {currentIndex + 1} / {items.length}
              </span>
            )}
            <button type="button" className="btn btn-sm galeria-modal-action" onClick={onShare}>
              Compartir
            </button>
            <button type="button" className="btn btn-sm galeria-modal-action" onClick={onCopyLink}>
              Copiar enlace
            </button>
            {feedbackToast && (
              <span
                className={`galeria-modal-toast galeria-modal-toast--${feedbackToast.tone} small`}
                role="status"
              >
                {feedbackToast.message}
              </span>
            )}
          </div>
        </div>

        <div
          className="galeria-modal-content position-relative rounded-3 overflow-hidden w-100"
          style={{ maxHeight: 'min(78vh, 900px)' }}
        >
          {itemModal.type === 'image' ? (
            <img
              src={itemModal.url}
              alt={itemModal.title ?? `Foto del evento ${eventoNombre ?? ''}`.trim()}
              className="img-fluid d-block mx-auto"
              style={{ maxHeight: 'min(78vh, 900px)', objectFit: 'contain', width: '100%' }}
              decoding="async"
              onError={() => onImagenError(`modal-${itemModal.id}-${itemModal.url}`)}
            />
          ) : modalYoutubeEmbed ? (
            <div
              ref={youtubeWrapRef}
              className="position-relative bg-black rounded overflow-hidden galeria-modal-yt-wrap mx-auto w-100"
            >
              <div className="ratio ratio-16x9">
                <iframe
                  title={itemModal.title ?? 'Video'}
                  src={`${modalYoutubeEmbed}?rel=0`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              <button
                type="button"
                className="btn btn-sm position-absolute bottom-0 end-0 m-2 galeria-modal-yt-fullscreen-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleYoutubeFullscreen()
                }}
                title="Pantalla completa"
                aria-label="Pantalla completa"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            </div>
          ) : (
            <video
              src={itemModal.url}
              controls
              autoPlay
              className="w-100 d-block"
              style={{ maxHeight: 'min(78vh, 900px)' }}
              poster={itemModal.thumbnail}
            />
          )}
        </div>
        {itemModal.title && (
          <p className="text-white-50 small mt-2 mb-0 text-center">{itemModal.title}</p>
        )}
      </div>
    </div>
  )
}

export default GaleriaLightbox

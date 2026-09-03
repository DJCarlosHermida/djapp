import React from 'react'
import type { MediaItem } from '../../types'
import { youtubeEmbedSrc, youtubeThumbUrl } from '../../data'
import { toggleFullscreen } from '../../dom/fullscreen'
import { isInlineYoutubeItem } from './galeriaUtils'

type GaleriaMediaGridProps = {
  items: MediaItem[]
  eventoNombre: string
  imagenesConError: Set<string>
  marcarImagenError: (key: string) => void
  inlineYoutubePlayingId: string | null
  onPlayInline: (id: string | null) => void
  inlinePlayerWrapRef: React.RefObject<HTMLDivElement | null>
  onOpenItem: (item: MediaItem, focusEl?: HTMLElement | null) => void
  onRememberFocus: (el: HTMLElement | null) => void
}

const GaleriaMediaGrid: React.FC<GaleriaMediaGridProps> = ({
  items,
  eventoNombre,
  imagenesConError,
  marcarImagenError,
  inlineYoutubePlayingId,
  onPlayInline,
  inlinePlayerWrapRef,
  onOpenItem,
  onRememberFocus,
}) => (
  <div className="row g-3 galeria-media-grid">
    {items.map((item) => {
      const ytThumb = item.type === 'video' ? youtubeThumbUrl(item.url) : null
      const ytEmbed = item.type === 'video' ? youtubeEmbedSrc(item.url) : null
      const inline = isInlineYoutubeItem(item)
      const playingInline = inline && inlineYoutubePlayingId === item.id
      const maxInlineW = item.lightboxMaxWidth ?? 300

      if (inline && ytEmbed) {
        return (
          <div key={`${item.id}-${item.url}`} className="col-12">
            <div className="mx-auto galeria-inline-yt-wrap" style={{ maxWidth: `min(100%, ${maxInlineW}px)`, width: '100%' }}>
              {playingInline ? (
                <>
                  <div
                    ref={inlinePlayerWrapRef}
                    className="position-relative bg-black rounded overflow-hidden shadow-sm galeria-inline-yt"
                  >
                    <div className="ratio ratio-16x9">
                      <iframe
                        title={item.title ?? 'Video'}
                        src={`${ytEmbed}?rel=0&autoplay=1`}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm position-absolute bottom-0 end-0 m-2 galeria-modal-yt-fullscreen-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFullscreen(inlinePlayerWrapRef.current)
                      }}
                      title="Pantalla completa"
                      aria-label="Pantalla completa"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-link galeria-inline-yt-back d-block mx-auto mt-2"
                    onClick={() => onPlayInline(null)}
                    aria-label="Volver a la portada del video"
                  >
                    Volver a la portada
                  </button>
                </>
              ) : (
                <div
                  className="galeria-media-item rounded overflow-hidden shadow-sm position-relative"
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPlayInline(item.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onPlayInline(item.id)}
                  aria-label={item.title ? `Reproducir: ${item.title}` : 'Reproducir video'}
                >
                  <img
                    src={item.thumbnail ?? ytThumb ?? ''}
                    alt={item.title ?? ''}
                    className="galeria-media-img img-fluid"
                    loading="lazy"
                    decoding="async"
                    onError={() => marcarImagenError(`thumb-${item.id}-${item.url}`)}
                  />
                  {imagenesConError.has(`thumb-${item.id}-${item.url}`) && (
                    <div className="galeria-media-fallback">
                      <span>No se pudo cargar la miniatura</span>
                    </div>
                  )}
                  <span className="galeria-media-play" aria-hidden>
                    <span className="galeria-media-play__ring">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </div>
              )}
              {item.title && (
                <p className="small text-muted mt-2 mb-0 text-center">{item.title}</p>
              )}
            </div>
          </div>
        )
      }

      return (
        <div key={`${item.id}-${item.url}`} className="col-6 col-md-4 col-lg-3">
          <div
            className="galeria-media-item rounded overflow-hidden shadow-sm position-relative"
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onClick={() => onOpenItem(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onOpenItem(item, e.currentTarget)
              }
            }}
            onClickCapture={(e) => {
              onRememberFocus(e.currentTarget as HTMLElement)
            }}
            aria-label={item.type === 'image' ? `Ver imagen: ${item.title ?? 'Foto'}` : 'Ver video'}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.title ?? `Foto del evento ${eventoNombre}`}
                className="galeria-media-img img-fluid"
                loading="lazy"
                decoding="async"
                onError={() => marcarImagenError(`item-${item.id}-${item.url}`)}
              />
            ) : ytThumb && ytEmbed ? (
              <>
                <img
                  src={item.thumbnail ?? ytThumb}
                  alt={item.title ?? ''}
                  className="galeria-media-img img-fluid"
                  loading="lazy"
                  decoding="async"
                  onError={() => marcarImagenError(`item-${item.id}-${item.url}`)}
                />
                <span className="galeria-media-play" aria-hidden>
                  <span className="galeria-media-play__ring">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </>
            ) : (
              <video
                src={item.url}
                className="galeria-media-video w-100"
                poster={item.thumbnail}
                preload="metadata"
                muted
                playsInline
              />
            )}
            {imagenesConError.has(`item-${item.id}-${item.url}`) && (
              <div className="galeria-media-fallback">
                <span>No se pudo cargar este contenido</span>
              </div>
            )}
          </div>
        </div>
      )
    })}
  </div>
)

export default GaleriaMediaGrid

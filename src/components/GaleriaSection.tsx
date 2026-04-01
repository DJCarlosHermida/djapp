import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { Evento, MediaItem } from '../types'
import { EVENTOS_GALERIA, eventoPortadaUrl, youtubeEmbedSrc, youtubeThumbUrl } from '../data'

type GaleriaSectionProps = {
  eventoSeleccionado: Evento | null
  onSelectEvento: (ev: Evento | null) => void
}

function etiquetaContenido(ev: Evento): string {
  if (ev.instagramHighlightUrl && ev.items.length === 0) return 'Destacada'
  const n = ev.items.length
  if (n === 0) return ''
  const imgs = ev.items.filter((i) => i.type === 'image').length
  const vids = ev.items.filter((i) => i.type === 'video').length
  if (imgs && vids) return `${imgs} foto${imgs > 1 ? 's' : ''} · ${vids} video${vids > 1 ? 's' : ''}`
  if (vids) return `${vids} video${vids > 1 ? 's' : ''}`
  return `${imgs} foto${imgs > 1 ? 's' : ''}`
}

function isInlineYoutubeItem(item: MediaItem): boolean {
  return !!(item.playInline && item.type === 'video' && youtubeEmbedSrc(item.url))
}

const GaleriaSection: React.FC<GaleriaSectionProps> = ({ eventoSeleccionado, onSelectEvento }) => {
  const [itemModal, setItemModal] = useState<MediaItem | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [copiado, setCopiado] = useState(false)
  const [inlineYoutubePlayingId, setInlineYoutubePlayingId] = useState<string | null>(null)
  const lightboxYoutubeWrapRef = useRef<HTMLDivElement>(null)
  const inlinePlayerWrapRef = useRef<HTMLDivElement>(null)

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

  const closeModal = useCallback(() => setItemModal(null), [])

  const items = eventoSeleccionado?.items ?? []
  const currentIndex = itemModal ? items.findIndex((it) => it.id === itemModal.id && it.url === itemModal.url) : -1

  const goPrev = useCallback(() => {
    let idx = currentIndex
    while (idx > 0) {
      idx--
      const it = items[idx]
      if (!isInlineYoutubeItem(it)) {
        setItemModal(it)
        return
      }
    }
  }, [items, currentIndex])

  const goNext = useCallback(() => {
    let idx = currentIndex
    while (idx < items.length - 1) {
      idx++
      const it = items[idx]
      if (!isInlineYoutubeItem(it)) {
        setItemModal(it)
        return
      }
    }
  }, [items, currentIndex])

  const shareUrl = itemModal?.url ?? ''
  const modalYoutubeEmbed = itemModal ? youtubeEmbedSrc(itemModal.url) : null

  const copiarEnlace = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch (_) {}
  }, [shareUrl])

  const toggleYoutubeFullscreen = useCallback(() => {
    const el = lightboxYoutubeWrapRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }, [])

  const toggleInlineFullscreen = useCallback(() => {
    const el = inlinePlayerWrapRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }, [])

  const compartir = useCallback(async () => {
    if (!shareUrl || !itemModal) return
    const title = eventoSeleccionado ? `${eventoSeleccionado.nombre} · DJ Carlos Hermida` : 'DJ Carlos Hermida'
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: shareUrl })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        await copiarEnlace()
      }
    } else {
      await copiarEnlace()
    }
  }, [shareUrl, itemModal, eventoSeleccionado, copiarEnlace])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!itemModal) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    if (itemModal) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [itemModal, closeModal, goPrev, goNext])

  return (
    <section id="galeria" className="galeria-section py-5">
      <div className="container">
        {!eventoSeleccionado ? (
          <>
            <h2 className="galeria-title h2 text-center mb-2">Galería de eventos</h2>
            <p className="galeria-subtitle text-center text-muted mb-4">
              Filtrá por tipo de evento y abrí cada álbum. Compartí fotos y videos desde la vista ampliada.
            </p>

            <div className="galeria-filters d-flex flex-wrap justify-content-center gap-2 mb-4" role="toolbar" aria-label="Filtrar galería">
              <button
                type="button"
                className={`galeria-filter-chip btn btn-sm ${filtroCategoria === 'todos' ? 'galeria-filter-chip--active' : ''}`}
                onClick={() => setFiltroCategoria('todos')}
              >
                Todos
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`galeria-filter-chip btn btn-sm ${filtroCategoria === cat ? 'galeria-filter-chip--active' : ''}`}
                  onClick={() => setFiltroCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {eventosFiltrados.length === 0 ? (
              <p className="text-center text-muted mb-0">No hay eventos en esta categoría.</p>
            ) : (
              <div className="row g-4 galeria-grid">
                {eventosFiltrados.map((ev) => {
                  const portada = eventoPortadaUrl(ev)
                  const label = etiquetaContenido(ev)
                  return (
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
                              src={portada}
                              alt=""
                              className="object-fit-cover galeria-card-img"
                              loading="lazy"
                            />
                            <div className="galeria-card-overlay">
                              <span className="galeria-card-cta">Ver en Instagram</span>
                              <span className="galeria-card-count">{label || 'Destacada'}</span>
                            </div>
                          </div>
                          <div className="card-body galeria-card-body">
                            {ev.categoria && <span className="galeria-card-badge">{ev.categoria}</span>}
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
                              src={portada}
                              alt=""
                              className="object-fit-cover galeria-card-img"
                              loading="lazy"
                            />
                            <div className="galeria-card-overlay">
                              <span className="galeria-card-cta">Ver galería</span>
                              <span className="galeria-card-count">{label}</span>
                            </div>
                          </div>
                          <div className="card-body galeria-card-body">
                            {ev.categoria && <span className="galeria-card-badge">{ev.categoria}</span>}
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
                  )
                })}
              </div>
            )}
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
              {eventoSeleccionado.items.map((item) => {
                const ytThumb = item.type === 'video' ? youtubeThumbUrl(item.url) : null
                const ytEmbed = item.type === 'video' ? youtubeEmbedSrc(item.url) : null
                const inline = isInlineYoutubeItem(item)
                const playingInline = inline && inlineYoutubePlayingId === item.id
                const maxInlineW = item.lightboxMaxWidth ?? 300

                if (inline && ytEmbed) {
                  return (
                    <div key={`${item.id}-${item.url}`} className="col-12">
                      <div className="mx-auto" style={{ maxWidth: maxInlineW, width: '100%' }}>
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
                                  toggleInlineFullscreen()
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
                              onClick={() => setInlineYoutubePlayingId(null)}
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
                            onClick={() => setInlineYoutubePlayingId(item.id)}
                            onKeyDown={(e) => e.key === 'Enter' && setInlineYoutubePlayingId(item.id)}
                            aria-label={item.title ? `Reproducir: ${item.title}` : 'Reproducir video'}
                          >
                            <img
                              src={item.thumbnail ?? ytThumb ?? ''}
                              alt={item.title ?? ''}
                              className="galeria-media-img img-fluid"
                              loading="lazy"
                            />
                            <span className="galeria-media-play" aria-hidden>
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
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
                      onClick={() => setItemModal(item)}
                      onKeyDown={(e) => e.key === 'Enter' && setItemModal(item)}
                      aria-label={item.type === 'image' ? `Ver imagen: ${item.title ?? 'Foto'}` : 'Ver video'}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.title ?? ''}
                          className="galeria-media-img img-fluid"
                          loading="lazy"
                        />
                      ) : ytThumb && ytEmbed ? (
                        <>
                          <img
                            src={item.thumbnail ?? ytThumb}
                            alt={item.title ?? ''}
                            className="galeria-media-img img-fluid"
                            loading="lazy"
                          />
                          <span className="galeria-media-play" aria-hidden>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
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
                    </div>
                  </div>
                )
              })}
            </div>

            {itemModal && (
              <div
                className="galeria-modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-3"
                onClick={closeModal}
                role="dialog"
                aria-modal="true"
                aria-label="Vista ampliada"
              >
                <button
                  type="button"
                  className="galeria-modal-close btn btn-light btn-sm rounded-circle p-2"
                  onClick={closeModal}
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
                      goPrev()
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
                      goNext()
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
                >
                  <div className="galeria-modal-toolbar d-flex flex-wrap align-items-center justify-content-center gap-2 w-100 mb-2">
                    {items.length > 1 && currentIndex >= 0 && (
                      <span className="galeria-modal-counter small text-white-50 me-md-2">
                        {currentIndex + 1} / {items.length}
                      </span>
                    )}
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={compartir}>
                      Compartir enlace
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={copiarEnlace}>
                      Copiar enlace
                    </button>
                    {copiado && <span className="small text-success">Copiado</span>}
                  </div>

                  <div
                    className="galeria-modal-content position-relative rounded overflow-hidden shadow-lg w-100"
                    style={{ maxHeight: 'min(78vh, 900px)' }}
                  >
                    {itemModal.type === 'image' ? (
                      <img
                        src={itemModal.url}
                        alt={itemModal.title ?? ''}
                        className="img-fluid d-block mx-auto"
                        style={{ maxHeight: 'min(78vh, 900px)', objectFit: 'contain', width: '100%' }}
                      />
                    ) : modalYoutubeEmbed ? (
                      <div
                        ref={lightboxYoutubeWrapRef}
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
                            toggleYoutubeFullscreen()
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
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default GaleriaSection

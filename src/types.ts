export type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
}

export type Evento = {
  id: string
  nombre: string
  fecha?: string
  lugar?: string
  portada: string
  items: MediaItem[]
  /** Si está definido, el detalle muestra un enlace a este highlight de Instagram en lugar del grid. */
  instagramHighlightUrl?: string
}

export type ServicioId = 'dj' | 'musica' | 'web'

export type PortfolioLink = {
  nombre: string
  url: string
  descripcion?: string
}

export type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
  /** Ancho máximo en px del reproductor embebido en la página (ej. video de boda). */
  lightboxMaxWidth?: number
  /** Si es true (YouTube), al hacer clic se reproduce en la galería sin abrir modal. */
  playInline?: boolean
}

export type Evento = {
  id: string
  nombre: string
  fecha?: string
  lugar?: string
  /** Etiqueta para filtros de galería (ej. Bodas, 15 años). */
  categoria?: string
  portada: string
  items: MediaItem[]
  /** Si está definido, el detalle muestra un enlace a este highlight de Instagram en lugar del grid. */
  instagramHighlightUrl?: string
}

export type ServicioId = 'dj' | 'musica' | 'web'

/** Solo aplica al servicio DJ (opciones de discoteca) */
export type OpcionDiscotecaId = 'basico' | 'estandar' | 'full'

export type PortfolioLink = {
  nombre: string
  url: string
  descripcion?: string
  /** Si se define, sustituye la vista previa automática (p. ej. `/img/portfolio/proyecto.webp`) */
  thumbnail?: string
}

/** Tecnología para mostrar como miniatura (nombre + slug en simple-icons y color opcional) */
export type TechItem = {
  name: string
  slug: string
  color?: string
  /** Si es true, no se usa CDN y se muestra un icono fallback inline (ej. bcrypt no está en simple-icons) */
  fallbackIcon?: boolean
}

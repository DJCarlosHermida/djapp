import type { Evento, PortfolioLink, TechItem } from './types'

export const EQUALIZER_BARS = 48
export const IDLE_TIMEOUT_MS = 4000
export const SCROLL_THRESHOLD = 40
export const THROTTLE_MS = 200
export const WHATSAPP_PHONE = '59891332854'
export const CONTACT_EMAIL = 'djcarloshermida@outlook.com'

/** Rutas bajo /public/img/galeria */
const gal = (file: string) => `/img/galeria/${file}`

export const SERVICIO_ETIQUETAS: Record<'dj' | 'musica' | 'web', string> = {
  dj: 'DJ y Discoteca',
  musica: 'Producción musical y remixes',
  web: 'Programación web',
}

export const OPCION_DJ_ETIQUETAS: Record<'basico' | 'estandar' | 'full', string> = {
  basico: 'Básico',
  estandar: 'Estándar',
  full: 'Full',
}

export const EVENTOS_GALERIA: Evento[] = [
  {
    id: 'boda-casamiento',
    nombre: 'BODAS & CASAMIENTOS',
    categoria: 'Bodas',
    fecha: 'Diciembre 2024',
    lugar: 'Uruguay',
    portada: '',
    items: [
      {
        id: '1',
        type: 'video',
        url: 'https://youtu.be/XfUUHudkdTs',
        title: 'Boda Ana & Lucho',
        lightboxMaxWidth: 300,
        playInline: false,
      },
      {
        id: '2',
        type: 'video',
        url: 'https://youtu.be/nhh1XQ7G8Qc',
        title: 'Casamiento Anacelia & Pablo',
        lightboxMaxWidth: 300,
        playInline: false,
      },
    ],
  },
  {
    id: 'fiesta-15',
    nombre: '15 AÑOS',
    categoria: '15 años',
    fecha: 'Noviembre 2024',
    lugar: 'Montevideo y zona',
    portada: gal('6-1200x1600-800x1067.jpg'),
    items: [
      {
        id: '1',
        type: 'video',
        url: 'https://youtu.be/wXe6WHC6Ai0?list=PLqXyPPT4x331SvYcUJEIMzLiWsD2U-Mjp',
        title: 'Fiesta de 15 años',
      },
      {
        id: '2',
        type: 'image',
        url: gal('2-1200x800-800x533.jpg'),
        title: 'XV Agustina Rodríguez — Piedras Coloradas',
      },
      {
        id: '3',
        type: 'image',
        url: gal('4-1200x800-800x533.jpg'),
        title: 'XV Florence Wallace — Loma Verde, Young',
      },
      {
        id: '4',
        type: 'image',
        url: gal('7-1200x1600-800x1067.jpg'),
        title: 'XV Tamila De Los Santos — Ajupy, Young',
      },
      {
        id: '5',
        type: 'image',
        url: gal('8-1200x1600-800x1067.jpg'),
        title: 'XV Tamila De Los Santos — Ajupy, Young',
      },
    ],
  },
  {
    id: 'empresarial-corporativo',
    nombre: 'EVENTOS EMPRESARIALES & CORPORATIVOS',
    categoria: 'Empresarial',
    fecha: '2024',
    lugar: 'Uruguay',
    portada: '/img/ander-burdain-180587-2000x1333.jpg',
    items: [
      {
        id: '1',
        type: 'image',
        url: gal('12-1200x800-800x533.jpg'),
        title: 'Ambientación y sonido en evento corporativo',
      },
      {
        id: '2',
        type: 'image',
        url: gal('13-1200x800-800x533.jpg'),
        title: 'Iluminación y pista para evento empresarial',
      },
      {
        id: '3',
        type: 'image',
        url: gal('16-1200x800-800x533.jpg'),
        title: 'Musicalización profesional en vivo',
      },
    ],
  },
  {
    id: 'despedidas-graduaciones',
    nombre: 'DESPEDIDAS & GRADUACIONES',
    categoria: 'Despedidas',
    fecha: '2024',
    lugar: 'Montevideo',
    portada: gal('15-1200x800-800x533.jpg'),
    items: [
      {
        id: '1',
        type: 'image',
        url: gal('15-1200x800-800x533.jpg'),
        title: 'Despedida — pista y ambientación',
      },
      {
        id: '2',
        type: 'image',
        url: gal('17-1200x800-800x533.jpg'),
        title: 'Graduación — iluminación y sonido',
      },
      {
        id: '3',
        type: 'image',
        url: gal('5-1200x800-800x533.jpg'),
        title: 'XV Lucía Apollonia — Loma Verde, Young',
      },
    ],
  },
  {
    id: 'desfiles-2024',
    nombre: 'DESFILES',
    categoria: 'Desfiles',
    fecha: '2024',
    lugar: 'Montevideo',
    portada: gal('10-1200x800-800x533.jpg'),
    items: [
      {
        id: '1',
        type: 'image',
        url: gal('10-1200x800-800x533.jpg'),
        title: 'Desfile — iluminación escénica',
      },
      {
        id: '2',
        type: 'image',
        url: gal('11-1200x800-800x533.jpg'),
        title: 'Desfile — ambientación y sonido',
      },
      {
        id: '3',
        type: 'image',
        url: gal('14-1200x800-800x533.jpg'),
        title: 'Desfile — producción integral',
      },
    ],
  },
  {
    id: 'destacada-instagram',
    nombre: 'HIGHLIGHT DE INSTAGRAM',
    categoria: 'Instagram',
    fecha: 'Instagram',
    portada: '/img/mbr-1620x1080.jpg',
    items: [],
    instagramHighlightUrl: 'https://www.instagram.com/stories/highlights/18103991278703363/',
  },
]

/** Vista previa del sitio a partir de su URL (puedes usar `thumbnail` en cada ítem para una imagen propia). */
export function portfolioPreviewUrl(siteUrl: string, width = 640): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(siteUrl)}?w=${width}`
}

/** Convierte una URL de YouTube (watch, youtu.be o embed) en `src` de iframe; `null` si es `#` o no reconocida. */
export function youtubeEmbedSrc(url: string): string | null {
  if (!url || url === '#') return null
  const trimmed = url.trim()
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/i)
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`
  const vMatch = trimmed.match(/[?&]v=([^&]+)/)
  if (vMatch) return `https://www.youtube.com/embed/${decodeURIComponent(vMatch[1])}`
  const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/i)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  return null
}

/** ID de video YouTube a partir de URL; `null` si no aplica. */
export function youtubeVideoIdFromUrl(url: string): string | null {
  const embed = youtubeEmbedSrc(url)
  if (!embed) return null
  const m = embed.match(/embed\/([^?/]+)/)
  return m ? m[1] : null
}

/** Miniatura YouTube para usar como poster o portada. */
export function youtubeThumbUrl(url: string): string | null {
  const id = youtubeVideoIdFromUrl(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

/** Portada visible del evento: propia, miniatura del primer YouTube o imagen por defecto. */
export function eventoPortadaUrl(ev: Evento): string {
  if (ev.portada) return ev.portada
  const firstVideo = ev.items.find((i) => i.type === 'video')
  if (firstVideo) {
    const thumb = youtubeThumbUrl(firstVideo.url)
    if (thumb) return thumb
  }
  return '/img/mbr-1620x1080.jpg'
}

/** Portfolio: texto y estilo por proyecto */
export const PORTFOLIO_LINKS: PortfolioLink[] = [
  { nombre: 'Cantor Criollo', url: 'https://cantorcriolloweb.vercel.app/', descripcion: 'Tiene como intención divulgar materiales de diferentes formatos que forman parte del archivo Marcos Velásquez. Por citar algunos ejemplos: fotografías, afiches, grabaciones, textos, conciertos y letras de canciones . ' },
  { nombre: 'Estudio GP', url: 'https://estudiogp.uy/', descripcion: 'Brindamos soluciones contables personalizadas para pequeñas, medianas y grandes empresas, asegurando su éxito y crecimiento con un equipo de expertos.' },
  {
    nombre: 'Inquilinos Verificados',
    url: 'https://inquilinosverificados.vercel.app/',
    descripcion:
      'Plataforma para alquilar en Uruguay sin comisiones inmobiliarias ni garantías clásicas, con perfiles de inquilinos revisados a mano.',
  },
  { nombre: 'DJ TEAM | Ecommerce', url: 'https://djcarloshermida.vercel.app/', descripcion: 'Simulador de e-commerce de productos para fiestas y eventos: catálogo, carrito y flujo de compra.' },

  /* {
    nombre: 'Game Car',
    url: 'https://djcarloshermida.github.io/gameCar/',
    descripcion:
      'Juego en el navegador: evitá chocar con otros autos usando las flechas del teclado. Clic para comenzar, ritmo arcade y reglas claras en pantalla.',
  },
  {
    nombre: 'Game Pollo',
    url: 'https://djcarloshermida.github.io/gamePollo/',
    descripcion:
      'Ayudá al pollito a cruzar el camino: movimiento con flechas, pantalla de carga y textos en inglés y español. Replay para volver a jugar.',
  },
  {
    nombre: 'Snake Game',
    url: 'https://djcarloshermida.github.io/gameSnake/',
    descripcion:
      'Clásico Snake en el navegador: control con flechas, puntaje en pantalla y la mecánica que todos conocen.',
  }, */

  {
    nombre: 'Chat WebSocket',
    url: 'https://chat-websocket-p00q.onrender.com/',
    descripcion:
      'Aplicación de chat en tiempo real con WebSocket: mensajes instantáneos y usuarios conectados en vivo.',
  },
]

/** Tecnologías mostradas como miniaturas debajo del portfolio */
export const TECH_STACK: TechItem[] = [
  { name: 'HTML', slug: 'html5', color: 'E34F26' },
  { name: 'CSS', slug: 'css', color: '1572B6' },
  { name: 'Sass', slug: 'sass', color: 'CC6699' },
  { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E' },
  { name: 'React', slug: 'react', color: '61DAFB' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
  { name: 'Astro', slug: 'astro', color: 'FF5D01' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
  { name: 'Vite', slug: 'vite', color: '646CFF' },
  { name: 'Express', slug: 'express', color: '000000' },
  { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
  { name: 'NestJS', slug: 'nestjs', color: 'E0234E' },
  { name: 'Firebase', slug: 'firebase', color: 'FFCA28' },
  { name: 'MongoDB', slug: 'mongodb', color: '47A248' },
  { name: 'SQL', slug: 'postgresql', color: '4169E1' },
  { name: 'Docker', slug: 'docker', color: '2496ED' },
  { name: 'Git', slug: 'git', color: 'F05032' },
  { name: 'bcrypt', slug: 'bcrypt', color: '00A8E1', fallbackIcon: true },
  { name: 'Vitest', slug: 'vitest', color: '6E9F18' },
]

export type TestimonioItem = {
  id: string
  nombre: string
  tipoEvento: string
  texto: string
  rating: 1 | 2 | 3 | 4 | 5
}

export const TESTIMONIOS: TestimonioItem[] = [
  {
    id: 'testimonio-1',
    nombre: 'Valentina y Martin',
    tipoEvento: 'Boda',
    texto:
      'Carlos hizo que la fiesta no parara en toda la noche. Sonido impecable, gran lectura del público y trato súper profesional.',
    rating: 5,
  },
  {
    id: 'testimonio-2',
    nombre: 'Familia Rodríguez',
    tipoEvento: 'Fiesta de 15',
    texto: 'Contratamos el servicio estándar y fue excelente.',
    rating: 5,
  },
  {
    id: 'testimonio-3',
    nombre: 'Empresa Delta',
    tipoEvento: 'Evento empresarial',
    texto: 'Muy recomendable para eventos empresariales.',
    rating: 5,
  },
]

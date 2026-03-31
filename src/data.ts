import type { Evento, PortfolioLink, TechItem } from './types'

export const EQUALIZER_BARS = 48
export const IDLE_TIMEOUT_MS = 4000
export const SCROLL_THRESHOLD = 40
export const THROTTLE_MS = 200

export const EVENTOS_GALERIA: Evento[] = [
  {
    id: 'boda-martinez-2024',
    nombre: 'BODAS & CASAMIENTOS',
    fecha: 'Diciembre 2024',
    lugar: 'Punta del Este',
    portada: '/img/mbr-1620x1080.jpg',
    items: [
      { id: '1', type: 'image', url: '/img/mbr-1620x1080.jpg', title: 'DJ en acción' }
    ],
  },
  {
    id: 'fiesta-15-2024',
    nombre: '15 AÑOS',
    fecha: 'Noviembre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/evento15/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/f15-1/800/600' }
    ],
  },
  {
    id: 'corporativo-2024',
    nombre: 'EVENTOS EMPRESARIALES',
    fecha: 'Octubre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/corp/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/corp1/800/600' },
      { id: '2', type: 'image', url: 'https://picsum.photos/seed/corp2/800/600' },
    ],
  },
  {
    id: 'despedidas-2024',
    nombre: 'DESPEDIDAS',
    fecha: 'Octubre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/corp/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/corp1/800/600' }
    ],
  },
  {
    id: 'desfiles-2024',
    nombre: 'DESFILES',
    fecha: 'Octubre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/corp/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/corp1/800/600' }
    ],
  },
  {
    id: 'destacada-instagram',
    nombre: 'HIGHLIGHT DE INSTAGRAM',
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

/** Portfolio: texto y estilo por proyecto */
export const PORTFOLIO_LINKS: PortfolioLink[] = [
  { nombre: 'Cantor Criollo', url: 'https://cantorcriollo.com.uy/', descripcion: 'Tiene como intención divulgar materiales de diferentes formatos que forman parte del archivo Marcos Velásquez. Por citar algunos ejemplos: fotografías, afiches, grabaciones, textos, conciertos y letras de canciones . ' },
  { nombre: 'Estudio GP', url: 'https://estudiogp.uy/', descripcion: 'Brindamos soluciones contables personalizadas para pequeñas, medianas y grandes empresas, asegurando su éxito y crecimiento con un equipo de expertos.' },
  { nombre: 'DJ TEAM | Ecommerce', url: 'https://djcarloshermida.vercel.app/', descripcion: 'Simulador de e-commerce de productos para fiestas y eventos: catálogo, carrito y flujo de compra.' },
  {
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
  },
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
  { name: 'bcrypt', slug: 'bcrypt', color: '00A8E1', fallbackIcon: true },
  { name: 'Vitest', slug: 'vitest', color: '6E9F18' },
]

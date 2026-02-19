import type { Evento, PortfolioLink } from './types'

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

/** Portfolio: texto y estilo por proyecto */
export const PORTFOLIO_LINKS: PortfolioLink[] = [
  { nombre: 'Cantor Criollo', url: 'https://cantorcriollo.com.uy/', descripcion: 'Tiene como intención divulgar materiales de diferentes formatos que forman parte del archivo Marcos Velásquez. Por citar algunos ejemplos: fotografías, afiches, grabaciones, textos, conciertos y letras de canciones . ' },
  { nombre: 'Estudio GP', url: 'https://estudiogp.uy/', descripcion: 'Brindamos soluciones contables personalizadas para pequeñas, medianas y grandes empresas, asegurando su éxito y crecimiento con un equipo de expertos.' },
  { nombre: 'DJ TEAM | Ecommerce', url: 'https://djcarloshermida.vercel.app/', descripcion: 'Simulador de e-commerce de productos para fiestas y eventos: catálogo, carrito y flujo de compra.' },
]

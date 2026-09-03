import type { Evento, MediaItem } from '../../types'
import { youtubeEmbedSrc } from '../../data'

export function etiquetaContenido(ev: Evento): string {
  if (ev.instagramHighlightUrl && ev.items.length === 0) return 'Destacada'
  const n = ev.items.length
  if (n === 0) return ''
  const imgs = ev.items.filter((i) => i.type === 'image').length
  const vids = ev.items.filter((i) => i.type === 'video').length
  if (imgs && vids) return `${imgs} foto${imgs > 1 ? 's' : ''} · ${vids} video${vids > 1 ? 's' : ''}`
  if (vids) return `${vids} video${vids > 1 ? 's' : ''}`
  return `${imgs} foto${imgs > 1 ? 's' : ''}`
}

export function isInlineYoutubeItem(item: MediaItem): boolean {
  return !!(item.playInline && item.type === 'video' && youtubeEmbedSrc(item.url))
}

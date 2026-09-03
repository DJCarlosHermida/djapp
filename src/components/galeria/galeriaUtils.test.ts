import { describe, expect, it } from 'vitest'
import type { Evento, MediaItem } from '../../types'
import { etiquetaContenido, isInlineYoutubeItem } from './galeriaUtils'

const baseEvento: Evento = {
  id: 'x',
  nombre: 'Test',
  portada: '',
  items: [],
}

describe('etiquetaContenido', () => {
  it('marca highlight de Instagram sin ítems', () => {
    expect(
      etiquetaContenido({
        ...baseEvento,
        instagramHighlightUrl: 'https://instagram.com/x',
      }),
    ).toBe('Destacada')
  })

  it('cuenta fotos y videos', () => {
    const items: MediaItem[] = [
      { id: '1', type: 'image', url: '/a.jpg' },
      { id: '2', type: 'image', url: '/b.jpg' },
      { id: '3', type: 'video', url: 'https://youtu.be/abc' },
    ]
    expect(etiquetaContenido({ ...baseEvento, items })).toBe('2 fotos · 1 video')
  })
})

describe('isInlineYoutubeItem', () => {
  it('requiere playInline y URL de YouTube', () => {
    expect(
      isInlineYoutubeItem({
        id: '1',
        type: 'video',
        url: 'https://youtu.be/abc123',
        playInline: true,
      }),
    ).toBe(true)
    expect(
      isInlineYoutubeItem({
        id: '1',
        type: 'video',
        url: 'https://youtu.be/abc123',
        playInline: false,
      }),
    ).toBe(false)
  })
})

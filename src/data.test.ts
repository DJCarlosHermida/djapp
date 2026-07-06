import { describe, expect, it } from 'vitest'
import { youtubeEmbedSrc, youtubeThumbUrl, youtubeVideoIdFromUrl } from './data'

describe('youtubeEmbedSrc', () => {
  it('convierte youtu.be', () => {
    expect(youtubeEmbedSrc('https://youtu.be/XfUUHudkdTs')).toBe(
      'https://www.youtube.com/embed/XfUUHudkdTs',
    )
  })

  it('convierte watch URL', () => {
    expect(youtubeEmbedSrc('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('devuelve null para # o vacío', () => {
    expect(youtubeEmbedSrc('#')).toBeNull()
    expect(youtubeEmbedSrc('')).toBeNull()
  })
})

describe('youtubeVideoIdFromUrl', () => {
  it('extrae ID desde embed', () => {
    expect(youtubeVideoIdFromUrl('https://youtu.be/nhh1XQ7G8Qc')).toBe('nhh1XQ7G8Qc')
  })
})

describe('youtubeThumbUrl', () => {
  it('genera miniatura hqdefault', () => {
    expect(youtubeThumbUrl('https://youtu.be/XfUUHudkdTs')).toBe(
      'https://i.ytimg.com/vi/XfUUHudkdTs/hqdefault.jpg',
    )
  })
})

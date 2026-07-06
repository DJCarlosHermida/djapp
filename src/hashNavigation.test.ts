import { describe, expect, it } from 'vitest'
import {
  parseAppHash,
  SERVICIO_TO_SLUG,
  SLUG_TO_SERVICIO,
} from './hashNavigation'

describe('parseAppHash', () => {
  it('parsea sección vacía como empty', () => {
    expect(parseAppHash('')).toEqual({ kind: 'empty' })
    expect(parseAppHash('#')).toEqual({ kind: 'empty' })
  })

  it('parsea secciones principales', () => {
    expect(parseAppHash('#galeria')).toEqual({ kind: 'section', id: 'galeria' })
    expect(parseAppHash('form')).toEqual({ kind: 'section', id: 'form' })
  })

  it('parsea servicios con slug y opción DJ', () => {
    expect(parseAppHash('#services/djydiscoteca/basico')).toEqual({
      kind: 'services',
      servicio: 'dj',
      opcion: 'basico',
    })
    expect(parseAppHash('#services/musica')).toEqual({
      kind: 'services',
      servicio: 'musica',
      opcion: null,
    })
  })

  it('rechaza hashes inválidos', () => {
    expect(parseAppHash('#foo/bar')).toEqual({ kind: 'invalid' })
    expect(parseAppHash('#..')).toEqual({ kind: 'invalid' })
  })
})

describe('SERVICIO_TO_SLUG / SLUG_TO_SERVICIO', () => {
  it('son inversos para todos los servicios', () => {
    for (const [id, slug] of Object.entries(SERVICIO_TO_SLUG)) {
      expect(SLUG_TO_SERVICIO[slug]).toBe(id)
    }
  })
})

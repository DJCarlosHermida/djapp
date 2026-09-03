import { describe, expect, it } from 'vitest'
import {
  honeypotFilled,
  validateContactBody,
  validateContactFields,
} from './contactValidation'

const valid = {
  name: 'Carlos',
  lastname: 'Hermida',
  email: 'dj@example.com',
  phone: '091332854',
  message: 'Quiero cotizar un evento para diciembre.',
  service: 'dj',
  opcionDj: 'full',
}

describe('validateContactFields', () => {
  it('acepta un payload válido', () => {
    const result = validateContactFields(valid)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.email).toBe('dj@example.com')
      expect(result.data.service).toBe('dj')
    }
  })

  it('rechaza nombre corto', () => {
    expect(validateContactFields({ ...valid, name: 'A' })).toEqual({
      ok: false,
      error: 'El nombre es obligatorio (mínimo 2 caracteres).',
    })
  })

  it('rechaza email inválido', () => {
    expect(validateContactFields({ ...valid, email: 'no-es-email' }).ok).toBe(false)
  })

  it('rechaza servicio desconocido', () => {
    expect(validateContactFields({ ...valid, service: 'foto' })).toEqual({
      ok: false,
      error: 'Seleccioná un servicio válido.',
    })
  })

  it('rechaza opción DJ inválida', () => {
    expect(validateContactFields({ ...valid, opcionDj: 'premium' }).ok).toBe(false)
  })

  it('permite opción DJ vacía', () => {
    const result = validateContactFields({ ...valid, opcionDj: '' })
    expect(result.ok).toBe(true)
  })
})

describe('validateContactBody', () => {
  it('rechaza body nulo', () => {
    expect(validateContactBody(null)).toEqual({
      ok: false,
      error: 'Datos del formulario inválidos.',
    })
  })
})

describe('honeypotFilled', () => {
  it('es false si website está vacío', () => {
    expect(honeypotFilled({ ...valid, website: '  ' })).toBe(false)
    expect(honeypotFilled(valid)).toBe(false)
  })

  it('es true si website tiene texto', () => {
    expect(honeypotFilled({ website: 'https://spam.test' })).toBe(true)
  })
})

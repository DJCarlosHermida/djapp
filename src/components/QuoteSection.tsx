import React, { useMemo, useState } from 'react'
import type { OpcionDiscotecaId } from '../types'
import { WHATSAPP_PHONE } from '../data'

type QuoteSectionProps = {
  defaultOpcionDiscoteca: OpcionDiscotecaId | null
}

const BASE_PRICES: Record<OpcionDiscotecaId, number> = {
  basico: 8000,
  estandar: 12000,
  full: 21000,
}

const OPCION_LABEL: Record<OpcionDiscotecaId, string> = {
  basico: 'Servicio Basico',
  estandar: 'Servicio Estandar',
  full: 'Servicio Full',
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ defaultOpcionDiscoteca }) => {
  const [opcion, setOpcion] = useState<OpcionDiscotecaId>(defaultOpcionDiscoteca ?? 'estandar')
  const [horas, setHoras] = useState(4)
  const [invitados, setInvitados] = useState(80)
  const [traslado, setTraslado] = useState(false)
  const [laser, setLaser] = useState(false)
  const [pistaLed, setPistaLed] = useState(false)

  const presupuesto = useMemo(() => {
    const base = BASE_PRICES[opcion]
    const extraHoras = Math.max(0, horas - 4) * 1500
    const extraInvitados = invitados > 120 ? Math.ceil((invitados - 120) / 50) * 1000 : 0
    const extraTraslado = traslado ? 1800 : 0
    const extraLaser = laser ? 2500 : 0
    const extraPistaLed = pistaLed ? 3500 : 0
    return base + extraHoras + extraInvitados + extraTraslado + extraLaser + extraPistaLed
  }, [opcion, horas, invitados, traslado, laser, pistaLed])

  const whatsappUrl = useMemo(() => {
    const msg =
      `Hola Carlos, quiero una cotizacion para ${OPCION_LABEL[opcion]}. ` +
      `Horas: ${horas}. Invitados: ${invitados}. ` +
      `Extras: traslado=${traslado ? 'si' : 'no'}, laser=${laser ? 'si' : 'no'}, pista LED=${pistaLed ? 'si' : 'no'}. ` +
      `Presupuesto estimado web: $${presupuesto.toLocaleString('es-UY')}.`
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
  }, [opcion, horas, invitados, traslado, laser, pistaLed, presupuesto])

  return (
    <section id="cotizador" className="py-5 quote-section">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-lg-7">
            <h2 className="h2 mb-2">Cotizador rapido DJ y Discoteca</h2>
            <p className="text-muted mb-4">Obtene una referencia inmediata y segui la consulta por WhatsApp.</p>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="quote-opcion">Paquete</label>
                <select
                  id="quote-opcion"
                  className="form-select"
                  value={opcion}
                  onChange={(e) => setOpcion(e.target.value as OpcionDiscotecaId)}
                >
                  <option value="basico">Basico</option>
                  <option value="estandar">Estandar</option>
                  <option value="full">Full</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="quote-horas">Horas</label>
                <input
                  id="quote-horas"
                  type="number"
                  min={2}
                  max={12}
                  className="form-control"
                  value={horas}
                  onChange={(e) => setHoras(Number(e.target.value) || 4)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="quote-invitados">Invitados</label>
                <input
                  id="quote-invitados"
                  type="number"
                  min={20}
                  max={1200}
                  className="form-control"
                  value={invitados}
                  onChange={(e) => setInvitados(Number(e.target.value) || 80)}
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mt-3">
              <label className="form-check">
                <input className="form-check-input me-2" type="checkbox" checked={traslado} onChange={(e) => setTraslado(e.target.checked)} />
                <span className="form-check-label">Traslado de equipos</span>
              </label>
              <label className="form-check">
                <input className="form-check-input me-2" type="checkbox" checked={laser} onChange={(e) => setLaser(e.target.checked)} />
                <span className="form-check-label">Show laser</span>
              </label>
              <label className="form-check">
                <input className="form-check-input me-2" type="checkbox" checked={pistaLed} onChange={(e) => setPistaLed(e.target.checked)} />
                <span className="form-check-label">Pista LED</span>
              </label>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="quote-summary p-4 rounded-3">
              <p className="text-uppercase small mb-2 quote-summary__label">Estimado</p>
              <p className="quote-summary__price mb-2">${presupuesto.toLocaleString('es-UY')}</p>
              <p className="text-muted small mb-3">Valor orientativo. El presupuesto final se confirma por fecha, lugar y requerimientos.</p>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-success w-100">
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteSection

import React, { useEffect, useState } from 'react'
import { CONTACT_EMAIL, WHATSAPP_DEFAULT_MSG, WHATSAPP_PHONE } from '../data'
import type { ContactSubmitStatus } from '../hooks/useContactForm'
import type { OpcionDiscotecaId, ServicioId } from '../types'

type ContactSectionProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<boolean>
  submitStatus: ContactSubmitStatus
  submitError: string | null
  submitSuccess: string | null
  initialServicio: ServicioId | null
  initialOpcionDiscoteca: OpcionDiscotecaId | null
}

const ContactSection: React.FC<ContactSectionProps> = ({
  onSubmit,
  submitStatus,
  submitError,
  submitSuccess,
  initialServicio,
  initialOpcionDiscoteca,
}) => {
  const [servicio, setServicio] = useState<ServicioId | ''>(initialServicio ?? '')
  const [opcionDj, setOpcionDj] = useState<OpcionDiscotecaId | ''>(initialOpcionDiscoteca ?? '')

  useEffect(() => {
    setServicio(initialServicio ?? '')
    setOpcionDj(initialOpcionDiscoteca ?? '')
  }, [initialServicio, initialOpcionDiscoteca])

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const ok = await onSubmit(event)
    if (ok) {
      setServicio('')
      setOpcionDj('')
    }
  }

  const isLoading = submitStatus === 'loading'

  return (
  <section id="form" className="py-5">
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-lg-6 order-2 order-lg-1">
          <h2 className="h2 mb-3">Consultá por DJ, música o web</h2>
          <p className="mb-4">
            Completá el formulario y te respondo a la brevedad. Trabajo tres líneas: discoteca para eventos, producción musical y desarrollo web.
          </p>
          <p className="mb-4">
            Si es un evento, indicá fecha, tipo (boda, 15, corporativo, despedida, desfile…), lugar, horario y cantidad de personas.
            <br />
            Si es música: remix, colaboración o producción (género, referencias y plazo).
            <br />
            Si es web: tipo de proyecto (sitio, app o e-commerce) y qué necesitás resolver.
          </p>
          <p className="mb-4 small text-muted">
            Si el envío falla, escribinos por WhatsApp o a{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MSG)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-success mb-4"
          >
            Consulta rápida por WhatsApp
          </a>
          {submitSuccess && (
            <div className="alert alert-success" role="status">
              {submitSuccess}
            </div>
          )}
          {submitError && (
            <div className="alert alert-danger" role="alert">
              {submitError}
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="contact-form row g-3" noValidate>
            <div className="contact-honeypot d-none" aria-hidden="true">
              <label htmlFor="website">Sitio web</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Nombre*</label>
              <input id="name" name="name" className="form-control" required disabled={isLoading} />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastname" className="form-label">Apellido</label>
              <input id="lastname" name="lastname" className="form-control" disabled={isLoading} />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email*</label>
              <input id="email" name="email" type="email" className="form-control" required disabled={isLoading} />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Teléfono*</label>
              <input id="phone" name="phone" className="form-control" required disabled={isLoading} />
            </div>
            <div className="col-md-6">
              <label htmlFor="service" className="form-label">Servicio a cotizar*</label>
              <select
                id="service"
                name="service"
                className="form-select"
                required
                disabled={isLoading}
                value={servicio}
                onChange={(e) => {
                  const value = e.target.value as ServicioId | ''
                  setServicio(value)
                  if (value !== 'dj') setOpcionDj('')
                }}
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option value="dj">DJ y Discoteca</option>
                <option value="musica">Producción Musical y Remixes</option>
                <option value="web">Programación Web</option>
              </select>
            </div>
            {servicio === 'dj' && (
              <div className="col-md-6">
                <label htmlFor="opcionDj" className="form-label">Opción DJ</label>
                <select
                  id="opcionDj"
                  name="opcionDj"
                  className="form-select"
                  disabled={isLoading}
                  value={opcionDj}
                  onChange={(e) => setOpcionDj(e.target.value as OpcionDiscotecaId | '')}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="basico">Básico</option>
                  <option value="estandar">Estándar</option>
                  <option value="full">Full</option>
                </select>
              </div>
            )}
            <div className="col-12">
              <label htmlFor="message" className="form-label">Mensaje*</label>
              <textarea id="message" name="message" rows={4} className="form-control" required disabled={isLoading} />
            </div>
            <div className="col-12">
              <small className="text-muted">* campos obligatorios</small>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-dark" disabled={isLoading}>
                {isLoading ? 'Enviando…' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
        <div className="col-12 col-lg-4 order-1 order-lg-2 offset-lg-2">
          <div className="ratio ratio-4x3">
            <iframe
              title="Ubicación DJ Carlos Hermida"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.8221505575693!2d-56.122603870672926!3d-34.86069588006259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f80b74d204053%3A0x9ea5ba12099a8632!2sVeracierto%20%26%20Do%C3%B1a%20Soledad%2C%2012100%20Montevideo%2C%20Departamento%20de%20Montevideo!5e0!3m2!1ses-419!2suy!4v1651100818310!5m2!1ses-419!2suy"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ContactSection

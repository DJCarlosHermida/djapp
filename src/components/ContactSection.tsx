import React, { useEffect, useState } from 'react'
import { WHATSAPP_PHONE } from '../data'
import type { OpcionDiscotecaId, ServicioId } from '../types'

type ContactSectionProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  initialServicio: ServicioId | null
  initialOpcionDiscoteca: OpcionDiscotecaId | null
}

const ContactSection: React.FC<ContactSectionProps> = ({
  onSubmit,
  initialServicio,
  initialOpcionDiscoteca,
}) => {
  const [servicio, setServicio] = useState<ServicioId | ''>(initialServicio ?? '')
  const [opcionDj, setOpcionDj] = useState<OpcionDiscotecaId | ''>(initialOpcionDiscoteca ?? '')

  useEffect(() => {
    setServicio(initialServicio ?? '')
    setOpcionDj(initialOpcionDiscoteca ?? '')
  }, [initialServicio, initialOpcionDiscoteca])

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(event)
    setServicio('')
    setOpcionDj('')
  }

  return (
  <section id="form" className="py-5">
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-lg-6 order-2 order-lg-1">
          <h2 className="h2 mb-3">Ante cualquier duda, consulta o solicitud...</h2>
          <p className="mb-4">
            Completá el formulario y me pondré en contacto contigo.
          </p>
          <p className="mb-4">
            Cuéntame la fecha en que se realizará el evento, qué tipo de evento deseas realizar
            (fiesta de 15, casamiento, desfile, infantil, graduación, despedida etc...)
            Lugar, horario y cantidad de personas. De esa manera podré asesorarte ajustando el presupuesto a tus necesidades. <br />
            <br />
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Carlos, quiero consultar disponibilidad y presupuesto para un evento.')}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-success mb-4"
          >
            Consulta rapida por WhatsApp
          </a>
          <form onSubmit={handleFormSubmit} className="contact-form row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Nombre*</label>
              <input id="name" name="name" className="form-control" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastname" className="form-label">Apellido</label>
              <input id="lastname" name="lastname" className="form-control" />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email*</label>
              <input id="email" name="Email" type="email" className="form-control" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Teléfono*</label>
              <input id="phone" name="phone" className="form-control" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="service" className="form-label">Servicio a cotizar*</label>
              <select
                id="service"
                name="service"
                className="form-select"
                required
                value={servicio}
                onChange={(e) => {
                  const value = e.target.value as ServicioId | ''
                  setServicio(value)
                  if (value !== 'dj') setOpcionDj('')
                }}
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option value="dj">DJ y Discoteca</option>
                <option value="musica">Produccion Musical y Remixes</option>
                <option value="web">Programacion Web</option>
              </select>
            </div>
            {servicio === 'dj' && (
              <div className="col-md-6">
                <label htmlFor="opcionDj" className="form-label">Opcion DJ</label>
                <select
                  id="opcionDj"
                  name="opcionDj"
                  className="form-select"
                  value={opcionDj}
                  onChange={(e) => setOpcionDj(e.target.value as OpcionDiscotecaId | '')}
                >
                  <option value="">Selecciona una opcion</option>
                  <option value="basico">Basico</option>
                  <option value="estandar">Estandar</option>
                  <option value="full">Full</option>
                </select>
              </div>
            )}
            <div className="col-12">
              <label htmlFor="message" className="form-label">Mensaje*</label>
              <textarea id="message" name="message" rows={4} className="form-control" required />
            </div>
            <div className="col-12">
              <small className="text-muted">* campos obligatorios</small> <br />
              <small className="text-muted">
                ** Para mayor seguridad el formulario cargará automaticamente los datos ingresados a tu aplicación de correo, solo tenés que confirmar el envío
              </small>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-dark">
                Enviar
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

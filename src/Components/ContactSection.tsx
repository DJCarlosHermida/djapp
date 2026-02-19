import React from 'react'

type ContactSectionProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const ContactSection: React.FC<ContactSectionProps> = ({ onSubmit }) => (
  <section id="form" className="py-5">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-6">
          <h2 className="h2 mb-3">Ante cualquier duda, consulta o para solicitar presupuesto</h2>
          <p className="mb-4">
            Completá el formulario y me pondré en contacto contigo.
          </p>
          <p className="mb-4">
            Cuéntame la fecha en que se realizará el evento, qué tipo de evento deseas realizar
            (fiesta de 15, casamiento, desfile, infantil, graduación, despedida etc...)
            Lugar, horario y cantidad de personas. <br />
            <br />
          </p>
          <form onSubmit={onSubmit} className="contact-form row g-3">
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
            <div className="col-12">
              <label htmlFor="message" className="form-label">Mensaje*</label>
              <textarea id="message" name="message" rows={4} className="form-control" required />
            </div>
            <div className="col-12">
              <small className="text-muted">* campos obligatorios</small> <br />
              <small className="text-muted">* para mayor seguridad, el formulario se enviará desde tu correo electrónico</small>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-dark">Enviar</button>
            </div>
          </form>
        </div>
        <div className="col-lg-4">
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

export default ContactSection

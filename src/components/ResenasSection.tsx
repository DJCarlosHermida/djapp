import React from 'react'
import { TESTIMONIOS } from '../data'

const ResenasSection: React.FC = () => {
  return (
    <section id="resenas" className="resenas-section py-4">
      <div className="container">
        <h2 className="h2 text-center mb-2 resenas-title">Reseñas</h2>
        <div className="row g-3 mt-1">
          {TESTIMONIOS.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <article className="resenas-card h-100 p-3 rounded-3">
                <p className="resenas-card__stars mb-2" aria-label={`${item.rating} de 5 estrellas`}>
                  {'★'.repeat(item.rating)}
                </p>
                <p className="mb-3 small">{item.texto}</p>
                <p className="mb-0 small text-muted">
                  <strong>{item.nombre}</strong> · {item.tipoEvento}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResenasSection

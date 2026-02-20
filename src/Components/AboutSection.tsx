/** @jsxImportSource react */
export default function AboutSection() {
  return (
    <section id="about" className="about-section py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <img
              src="/img/mbr-1620x1080.jpg"
              alt="DJ Carlos Hermida en evento"
              className="img-fluid rounded shadow about-section__img"
            />
          </div>
          <div className="col-lg-6">
            <h2 className="about-section__title h2 mb-4">Sobre DJ Carlos Hermida</h2>
            <div className="about-section__text">
              <p className="about-section__lead">
                Apasionado por la música y la programación. Con más de dos décadas de trayectoria,
                ha construido una marca sólida que combina pasión, experiencia y versatilidad. <br />
                Su carrera comenzó desde muy joven, experimentando con mezclas y formatos
                que iban desde el cassette hasta el vinilo, su sello distintivo.<br />
                A lo largo de los años, se ha presentado en reconocidas discotecas como{' '}
                <i title="Montevideo">El Deseo</i>, <i title="Sant´Ana Do Livramento">D-Mode</i>,{' '}
                <i title="Young">Cocodrilo</i>, <i title="Young">Azul</i>, <i title="Young">Akiabara</i>,{' '}
                <i title="Montevideo">El Viejo Oeste</i>, <i title="Young">Life</i> entre otros. <br />
                Ha participado en importantes emisoras de radio como: <br />
                <i title="Imagen FM">Imagen FM</i>, <i title="Luna FM">Luna FM</i>,{' '}
                <i title="Visión Young FM">Visión Young FM</i>, <i title="Radio Young">Radio Young</i>,{' '}
                <i title="Alternativa FM">Alternativa FM</i>, <i title="Unión FM">Unión FM</i>.
              </p>
              <blockquote className="about-section__quote">
                Actualmente, continúa activo en la producción de fiestas y eventos de todo tipo, ofreciendo un repertorio que abarca todos los géneros musicales y transmitiendo siempre su filosofía:{' '}
                <cite>Sin música no hay vida.</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

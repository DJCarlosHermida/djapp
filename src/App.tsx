import React, { useState, useEffect, useRef } from 'react'

type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
}

type Evento = {
  id: string
  nombre: string
  fecha?: string
  lugar?: string
  portada: string
  items: MediaItem[]
  /** Si está definido, el detalle muestra un enlace a este highlight de Instagram en lugar del grid. */
  instagramHighlightUrl?: string
}

const EVENTOS_GALERIA: Evento[] = [
  {
    id: 'boda-martinez-2024',
    nombre: 'BODAS & CASAMIENTOS',
    fecha: 'Diciembre 2024',
    lugar: 'Punta del Este',
    portada: '/img/mbr-1620x1080.jpg',
    items: [
      { id: '1', type: 'image', url: '/img/mbr-1620x1080.jpg', title: 'DJ en acción' }
    ],
  },
  {
    id: 'fiesta-15-2024',
    nombre: '15 AÑOS',
    fecha: 'Noviembre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/evento15/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/f15-1/800/600' }

    ],
  },
  {
    id: 'corporativo-2024',
    nombre: 'EVENTOS EMPRESARIALES',
    fecha: 'Octubre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/corp/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/corp1/800/600' },
      { id: '2', type: 'image', url: 'https://picsum.photos/seed/corp2/800/600' },
    ],
  },
  {
    id: 'corporativo-2024',
    nombre: 'DESPEDIDAS',
    fecha: 'Octubre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/corp/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/corp1/800/600' }

    ],
  },
  {
    id: 'corporativo-2024',
    nombre: 'DESFILES',
    fecha: 'Octubre 2024',
    lugar: 'Montevideo',
    portada: 'https://picsum.photos/seed/corp/800/600',
    items: [
      { id: '1', type: 'image', url: 'https://picsum.photos/seed/corp1/800/600' }

    ],
  },
  {
    id: 'destacada-instagram',
    nombre: 'HIGHLIGHT DE INSTAGRAM',
    fecha: 'Instagram',
    portada: '/img/mbr-1620x1080.jpg',
    items: [],
    instagramHighlightUrl: 'https://www.instagram.com/stories/highlights/18103991278703363/',
  },
]

const EQUALIZER_BARS = 48
const IDLE_TIMEOUT_MS = 4000

const SCROLL_THRESHOLD = 40

type ServicioId = 'dj' | 'musica' | 'web'

type PortfolioLink = { nombre: string; url: string; descripcion?: string }

/** Portfolio: texto y estilo por proyecto
 *  - Cantor Criollo: folclore, identidad, relatos, músicas y libros (tono cultural).
 *  - Estudio GP: soluciones contables, empresas, crecimiento (tono profesional / meta description del sitio).
 *  - DJ TEAM Ecommerce: e-commerce, productos para fiestas y eventos (tono dinámico / venta). */
const PORTFOLIO_LINKS: PortfolioLink[] = [
  { nombre: 'Cantor Criollo', url: 'https://cantorcriollo.com.uy/', descripcion: 'Tiene como intención divulgar materiales de diferentes formatos que forman parte del archivo Marcos Velásquez. Por citar algunos ejemplos: fotografías, afiches, grabaciones, textos, conciertos y letras de canciones . ' },
  { nombre: 'Estudio GP', url: 'https://estudiogp.uy/', descripcion: 'Brindamos soluciones contables personalizadas para pequeñas, medianas y grandes empresas, asegurando su éxito y crecimiento con un equipo de expertos.' },
  { nombre: 'DJ TEAM | Ecommerce', url: 'https://djcarloshermida.vercel.app/', descripcion: 'Simulador de e-commerce de productos para fiestas y eventos: catálogo, carrito y flujo de compra.' },
]

const App: React.FC = () => {
  const [equalizerActive, setEqualizerActive] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioId | null>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTriggerRef = useRef(0)
  const THROTTLE_MS = 200

  const THEME_KEY = 'djcarloshermida-theme'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null
      if (saved === 'dark' || saved === 'light') return saved
    } catch (_) {}
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (_) {}
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const startIdleOffTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setEqualizerActive(false), IDLE_TIMEOUT_MS)
  }

  const onActivity = (skipThrottle = false) => {
    const now = Date.now()
    if (!skipThrottle && now - lastTriggerRef.current < THROTTLE_MS) return
    lastTriggerRef.current = now
    setEqualizerActive(true)
    startIdleOffTimer()
  }

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMouseMove = () => onActivity(false)
    const onClick = () => onActivity(true)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const name = formData.get('name')?.toString() ?? ''
    const phone = formData.get('phone')?.toString() ?? ''
    const email = formData.get('Email')?.toString() ?? ''
    const message = formData.get('message')?.toString() ?? ''

    const subject = `-Nombre ${name} -Teléfono ${phone} -Email ${email}`
    const mailto = `mailto:djcarloshermida@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      message,
    )}`

    formElement.reset()
    window.location.href = mailto
  }

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark bg-transparent fixed-top blur-navbar navbar-with-equalizer ${equalizerActive ? 'navbar--equalizer-active' : ''} ${navScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar-equalizer-bg" aria-hidden="true">
          {Array.from({ length: EQUALIZER_BARS }, (_, i) => (
            <span
              key={i}
              className="navbar-equalizer-bar"
              style={{ animationDelay: `${(i * 0.03) % 1}s` }}
            />
          ))}
        </div>
        <div className="container navbar-equalizer-content">
          <a className="navbar-brand fw-bold" href="#home">
            DJ Carlos Hermida | <i style={{ color: 'orange' }}> Music &amp; Web </i>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <a className="nav-link" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#remix">
                  Remix
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Servicios
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  Sobre mí
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#galeria">
                  Galería
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#social">
                  Redes
                </a>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link theme-toggle btn btn-link border-0 p-2"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
                  title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                >
                  {theme === 'dark' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>
              </li>
              <li className="nav-item">
                <a className="btn btn-sm btn-light ms-lg-3" href="#form">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header id="home" className="hero d-flex align-items-center text-white">
        <div className="hero-overlay"></div>
        <div className="container position-relative text-center text-md-start">
          <div className="row align-items-center g-4">
            <div className="col-md-7">
              <p className="text-uppercase small mb-2 text-accent">
                DJ y Discoteca para todo tipo de eventos...
              </p>
              <h1 className="display-3 fw-bold mb-3 hero-title">CARLOS HERMIDA</h1>
              <p className="lead mb-4 hero-subtitle">
                | Bodas | 15 Años | Despedidas | Desfiles | Amplificaciones | Infantiles | Eventos Empresariales |
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#form" className="btn btn-primary btn-lg rounded-pill px-4">
                  Reserva tu fecha
                </a>
                <a href="#remix" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Escuchar playlist
                </a>
              </div>
            </div>
            <div className="col-md-5 d-none d-md-block">
              <div className="hero-card shadow-lg rounded-4 p-4 bg-dark bg-opacity-75">
                <p className="mb-2 text-uppercase small text-accent">Experiencia</p>
                <h2 className="h3 mb-3">Más de 20 años de trayectoria</h2>
                <p className="mb-3 small">
                  DJ y Productor Uruguayo. Especializado en eventos sociales y corporativos. <br />
                  - Bodas - 15 Años - Despedidas - Graduaciones - Infantiles - Empresariales - Desfiles - Amplificaciones . . . <br />
                </p>
                <ul className="list-unstyled small mb-0">
                  <li>* Servicio Integral Para Fiestas: DJ, sonido e iluminación . . .</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        

        <section id="services" className="services-section py-5">
          <div className="container">
            {!servicioSeleccionado ? (
              <>
                <p className="services-label text-uppercase small mb-2">Servicios</p>
                <h2 className="services-title h2 text-center mb-2">
                  DJ, Music & Web
                </h2>
                <p className="services-subtitle text-center text-muted mb-5">
                  Experiencia, equipamiento y versatilidad para tu proyecto.
                </p>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div
                      className="card h-100 pro-card"
                      onClick={() => setServicioSeleccionado('dj')}
                      onKeyDown={(e) => e.key === 'Enter' && setServicioSeleccionado('dj')}
                      role="button"
                      tabIndex={0}
                      aria-label="Ver más sobre DJ para fiestas y eventos"
                    >
                      <div className="pro-card-accent" aria-hidden />
                      <div className="card-body">
                        <div className="pro-card-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <h3 className="h5 pro-card-title">DJ y Discoteca</h3>
                        <p className="pro-card-desc mb-0">
                          Para todo tipo de fiestas y eventosMusicalización profesional para fiestas de 15, casamientos, discotecas y eventos empresariales.
                          Sonido PA de alta calidad iluminación y Pista LED.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="card h-100 pro-card"
                      onClick={() => setServicioSeleccionado('musica')}
                      onKeyDown={(e) => e.key === 'Enter' && setServicioSeleccionado('musica')}
                      role="button"
                      tabIndex={0}
                      aria-label="Ver más sobre Producción Musical y Remixes"
                    >
                      <div className="pro-card-accent" aria-hidden />
                      <div className="card-body">
                        <div className="pro-card-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="18" cy="16" r="3" />
                          </svg>
                        </div>
                        <h3 className="h5 pro-card-title">Producción Musical y Remixes</h3>
                        <p className="pro-card-desc mb-0">
                          Pistas originales (Cumbia, Electrónica, Rap, Trap, Reggaetón, Rock). <br />
                          Remix, spots y jingles. Grabación acapella y banda. <br />
                          Mezcla y mastering.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="card h-100 pro-card"
                      onClick={() => setServicioSeleccionado('web')}
                      onKeyDown={(e) => e.key === 'Enter' && setServicioSeleccionado('web')}
                      role="button"
                      tabIndex={0}
                      aria-label="Ver más sobre Programación Web y portfolio"
                    >
                      <div className="pro-card-accent" aria-hidden />
                      <div className="card-body">
                        <div className="pro-card-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                          </svg>
                        </div>
                        <h3 className="h5 pro-card-title">Programación Web</h3>
                        <p className="pro-card-desc mb-0">
                          Creación de aplicaciones web, SPA y tienda online (e-commerce). <br />
                          <strong><b>Frontend:</b></strong> React, TypeScript, Astro, Tailwind, Vite. <br />
                          <strong><b>Backend:</b></strong> Node.js, Express, Nest, Firebase, MongoDB, SQL, Testing.
                        </p>
                        <p className="galeria-label text-uppercase small mb-0 mt-2 text-center">Portfolio</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="galeria-back btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
                  onClick={() => setServicioSeleccionado(null)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Volver a servicios
                </button>
                <p className="services-label text-uppercase small mb-1">Servicio</p>
                {servicioSeleccionado === 'dj' && (
                  <>
                    <h2 className="services-title h2 mb-3">DJ y Discoteca</h2>
                    <p className="text-muted mb-3">
                      Musicalización profesional para fiestas de 15, casamientos, discotecas y eventos empresariales.
                      Sonido PA de alta calidad, iluminación y Pista LED.
                    </p>
                    <ul className="list-unstyled text-muted mb-0">
                      <li className="mb-2">· Bodas, 15 años, despedidas, desfiles, infantiles</li>
                      <li className="mb-2">· Eventos empresariales y corporativos</li>
                      <li className="mb-2">· Amplificación e iluminación profesional</li>
                    </ul>
                  </>
                )}
                {servicioSeleccionado === 'musica' && (
                  <>
                    <h2 className="services-title h2 mb-3">Producción Musical y Remixes</h2>
                    <p className="text-muted mb-3">
                      Pistas originales en múltiples géneros. Remix, spots y jingles. Grabación acapella y banda. Mezcla y mastering.
                    </p>
                    <ul className="list-unstyled text-muted mb-4">
                      <li className="mb-2">· Cumbia, Electrónica, Rap, Trap, Reggaetón, Rock</li>
                      <li className="mb-2">· Remix y jingles para marcas y eventos</li>
                      <li className="mb-2">· Grabación, mezcla y mastering</li>
                    <p className="services-label text-uppercase small mb-2">Remix</p>
                    </ul>
                    <div className="services-soundcloud-wrap ratio ratio-16x9 rounded-3 overflow-hidden">
                      <iframe
                        title="SoundCloud DJ Carlos Hermida - Producción y Remixes"
                        width="100%"
                        height="450"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1186284883&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
                      />
                    </div>
                  </>
                )}
                {servicioSeleccionado === 'web' && (
                  <>
                    <h2 className="services-title h2 mb-2">Programación Web</h2>
                    <p className="galeria-label text-uppercase small mb-4">Portfolio</p>
                    <p className="text-muted mb-4">
                      Creación de aplicaciones web, SPA y tienda online. Frontend: React, TypeScript, Astro, Tailwind, Vite. Backend: Node.js, Express, Nest, Firebase, MongoDB, SQL.
                    </p>
                    <div className="row g-3">
                      {PORTFOLIO_LINKS.map((item) => (
                        <div key={item.nombre} className="col-12 col-md-6 col-lg-4">
                          {item.url !== '#' ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="services-portfolio-link card h-100 text-decoration-none border rounded-3 p-3"
                            >
                              <span className="d-flex align-items-center justify-content-between">
                                <strong className="services-portfolio-link__title">{item.nombre}</strong>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </span>
                              {item.descripcion && <p className="small services-portfolio-link__desc mb-0 mt-2">{item.descripcion}</p>}
                            </a>
                          ) : (
                            <div className="services-portfolio-link card h-100 border rounded-3 p-3 opacity-75">
                              <span className="d-flex align-items-center justify-content-between">
                                <strong className="services-portfolio-link__title">{item.nombre}</strong>
                                <span className="badge bg-secondary">Próximamente</span>
                              </span>
                              {item.descripcion && <p className="small services-portfolio-link__desc mb-0 mt-2">{item.descripcion}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

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
                  Apacionado por la música y la programación. Con más de dos décadas de trayectoria,
                  ha construido una marca sólida que combina pasión, experiencia y versatilidad. <br />
                  Su carrera comenzó desde muy joven, experimentando con mezclas y formatos
                  que iban desde el cassette hasta el vinilo, su sello distintivo.<br />
                  A lo largo de los años, se ha presentado en reconocidas discotecas como <i>El Deseo, D-Mode, Cocodrilo, Azul, Akiabara, El Viejo Oeste y Life</i>, ha participado en importantes emisoras de radio como <i>Imagen FM, Luna FM, Visión Young FM, Radio Young, Alternativa FM y Unión FM</i>.
                </p>
                <blockquote className="about-section__quote">
                    Actualmente, continúa activo en la producción de fiestas y eventos de todo tipo, ofreciendo un repertorio que abarca todos los géneros musicales y transmitiendo siempre su filosofía:
                    <cite>"Sin música no hay vida."</cite>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="galeria" className="galeria-section py-5">
          <div className="container">
            {!eventoSeleccionado ? (
              <>
                <h2 className="galeria-title h2 text-center mb-2">Galería de eventos</h2>
                <p className="text-center text-muted mb-5 galeria-subtitle">
                  Entrá a cada evento para ver fotos y videos de los shows.
                </p>
                <div className="row g-4 galeria-grid">
                  {EVENTOS_GALERIA.map((ev) => (
                    <div key={ev.id} className="col-md-6 col-lg-4">
                      {ev.instagramHighlightUrl ? (
                        <a
                          href={ev.instagramHighlightUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="galeria-card card h-100 text-decoration-none"
                          aria-label={`Ver ${ev.nombre} en Instagram`}
                        >
                          <div className="galeria-card-img-wrap ratio ratio-16x9 overflow-hidden">
                            <img
                              src={ev.portada}
                              alt=""
                              className="object-fit-cover galeria-card-img"
                              loading="lazy"
                            />
                            <div className="galeria-card-overlay">
                              <span className="galeria-card-cta">Ver en Instagram</span>
                              <span className="galeria-card-count">Destacada</span>
                            </div>
                          </div>
                          <div className="card-body galeria-card-body">
                            <h3 className="h5 card-title mb-1">{ev.nombre}</h3>
                            {(ev.fecha || ev.lugar) && (
                              <p className="small text-muted mb-0">
                                {[ev.fecha, ev.lugar].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                        </a>
                      ) : (
                        <div
                          className="galeria-card card h-100"
                          onClick={() => setEventoSeleccionado(ev)}
                          onKeyDown={(e) => e.key === 'Enter' && setEventoSeleccionado(ev)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Ver galería de ${ev.nombre}`}
                        >
                          <div className="galeria-card-img-wrap ratio ratio-16x9 overflow-hidden">
                            <img
                              src={ev.portada}
                              alt=""
                              className="object-fit-cover galeria-card-img"
                              loading="lazy"
                            />
                            <div className="galeria-card-overlay">
                              <span className="galeria-card-cta">Ver galería</span>
                              <span className="galeria-card-count">{ev.items.length} fotos</span>
                            </div>
                          </div>
                          <div className="card-body galeria-card-body">
                            <h3 className="h5 card-title mb-1">{ev.nombre}</h3>
                            {(ev.fecha || ev.lugar) && (
                              <p className="small text-muted mb-0">
                                {[ev.fecha, ev.lugar].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="galeria-back btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
                  onClick={() => setEventoSeleccionado(null)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Volver a galería
                </button>
                <p className="galeria-label text-uppercase small mb-1">{eventoSeleccionado.fecha ?? 'Evento'}</p>
                <h2 className="galeria-title h2 mb-2">{eventoSeleccionado.nombre}</h2>
                {eventoSeleccionado.lugar && (
                  <p className="text-muted mb-4">{eventoSeleccionado.lugar}</p>
                )}
                <div className="row g-3 galeria-media-grid">
                  {eventoSeleccionado.items.map((item) => (
                    <div key={item.id} className="col-6 col-md-4 col-lg-3">
                      <div className="galeria-media-item rounded overflow-hidden shadow-sm">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.title ?? ''}
                            className="galeria-media-img img-fluid"
                            loading="lazy"
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="galeria-media-video w-100"
                            poster={item.thumbnail}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section id="social" className="social-section py-5 text-white">
          <div className="container text-center">
            <h2 className="h2 mb-3">Redes Sociales</h2>
            <p className="mb-4 text-muted">
              Sígueme para estar al tanto de los últimos <strong>eventos, noticias y remixes</strong>
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3 social-logos">
              <a href="https://www.facebook.com/djcarloshermida" title='Facebook' target="_blank" rel="noreferrer" className="btn btn-light social-logo-btn social-logo-btn--facebook" aria-label="Facebook">
                <svg className="social-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://instagram.com/djcarloshermida" title='Instagram' target="_blank" rel="noreferrer" className="btn btn-light social-logo-btn social-logo-btn--instagram" aria-label="Instagram">
                <svg className="social-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://soundcloud.com/djcarloshermida" title='SoundCloud' target="_blank" rel="noreferrer" className="btn btn-light social-logo-btn social-logo-btn--soundcloud" aria-label="SoundCloud">
                <svg className="social-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 14h1.5v-4H4v4zm2.2 0h1.5V7h-1.5v7zm2.2 0h1.5V8h-1.5v6zm2.2 0h1.5V6h-1.5v8zm2.2 0h1.5V7h-1.5v7zm2.2 0h1.5V8h-1.5v6zm2.2 0h1.5V9h-1.5v5zm2.2 0H19V10h-1.5v4z" />
                </svg>
              </a>
              <a href="https://twitter.com/djcarloshermida" title='X (Twitter)' target="_blank" rel="noreferrer" className="btn btn-light social-logo-btn social-logo-btn--x" aria-label="X (Twitter)">
                <svg className="social-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/djcarloshermida" title='YouTube' target="_blank" rel="noreferrer" className="btn btn-light social-logo-btn social-logo-btn--youtube" aria-label="YouTube">
                <svg className="social-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://wa.me/59891332854" title='WhatsApp' target="_blank" rel="noreferrer" className="btn btn-light social-logo-btn social-logo-btn--whatsapp" aria-label="WhatsApp">
                <svg className="social-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="form" className="py-5 bg-light">
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
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Nombre*
                    </label>
                    <input id="name" name="name" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastname" className="form-label">
                      Apellido
                    </label>
                    <input id="lastname" name="lastname" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email*
                    </label>
                    <input id="email" name="Email" type="email" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Teléfono*
                    </label>
                    <input id="phone" name="phone" className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="message" className="form-label">
                      Mensaje*
                    </label>
                    <textarea id="message" name="message" rows={4} className="form-control" required />
                  </div>
                  <div className="col-12">
                    <small className="text-muted">* campos obligatorios</small> <br />
                    <small className="text-muted">* para mayor seguridad, el formulario se enviará desde tu correo electrónico</small>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-dark">
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="ratio ratio-4x3">
                  <iframe
                    title="Ubicación DJ Carlos Hermida"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.8221505575693!2d-56.122603870672926!3d-34.86069588006259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f80b74d204053%3A0x9ea5ba12099a8632!2sVeracierto%20%26%20Do%C3%B1a%20Soledad%2C%2012100%20Montevideo%2C%20Departamento%20de%20Montevideo!5e0!3m2!1ses-419!2suy!4v1651100818310!5m2!1ses-419!2suy"
                    style={{ border: 0, borderRadius: "10px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-4 bg-black text-white text-center">
        <div className="container">
          <p className="mb-0">
            © {new Date().getFullYear()} | <i><a href="#home">djcarloshermida</a> </i> | Todos los derechos reservados®.
          </p>
        </div>
      </footer>
    </>
  )
}
export default App


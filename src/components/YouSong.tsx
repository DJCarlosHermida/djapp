import React, { useMemo, useState } from 'react'

type Song = {
  id: number
  title: string
  artist: string
  requestedBy: string
  hostPick: boolean
  votes: number
}

type EventItem = {
  id: number
  name: string
  host: string
  description: string
  isLive: boolean
  songs: Song[]
}

type View = 'landing' | 'dashboard' | 'event' | 'guest'

type EventForm = {
  name: string
  host: string
  description: string
}

type SongForm = {
  title: string
  artist: string
  requestedBy: string
}

const initialEventForm: EventForm = {
  name: '',
  host: '',
  description: '',
}

const initialSongForm: SongForm = {
  title: '',
  artist: '',
  requestedBy: '',
}

const YouSong: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [view, setView] = useState<View>('landing')
  const [events, setEvents] = useState<EventItem[]>([])
  const [activeEventId, setActiveEventId] = useState<number | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [showSongModal, setShowSongModal] = useState(false)
  const [eventForm, setEventForm] = useState<EventForm>(initialEventForm)
  const [songForm, setSongForm] = useState<SongForm>(initialSongForm)

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0] ?? null,
    [activeEventId, events],
  )

  const eventUrl = activeEvent
    ? `https://djcarloshermida.com/event/${activeEvent.id}-${slugify(activeEvent.name)}`
    : ''

  const handleSignIn = () => {
    setIsSignedIn(true)
    setView('dashboard')
  }

  const handleSignOut = () => {
    setIsSignedIn(false)
    setView('landing')
    setActiveEventId(null)
    setShowEventModal(false)
    setShowQrModal(false)
    setShowSongModal(false)
  }

  const handleCreateEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newEvent: EventItem = {
      id: Date.now(),
      name: eventForm.name.trim(),
      host: eventForm.host.trim(),
      description: eventForm.description.trim(),
      isLive: true,
      songs: [],
    }

    setEvents((currentEvents) => [newEvent, ...currentEvents])
    setActiveEventId(newEvent.id)
    setEventForm(initialEventForm)
    setShowEventModal(false)
    setView('event')
  }

  const handleCreateSong = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeEvent) return

    const newSong: Song = {
      id: Date.now(),
      title: songForm.title.trim(),
      artist: songForm.artist.trim(),
      requestedBy: songForm.requestedBy.trim() || 'Invitado',
      hostPick: view === 'event',
      votes: view === 'event' ? 1 : 0,
    }

    setEvents((currentEvents) =>
      currentEvents.map((eventItem) =>
        eventItem.id === activeEvent.id
          ? { ...eventItem, songs: [newSong, ...eventItem.songs] }
          : eventItem,
      ),
    )
    setSongForm(initialSongForm)
    setShowSongModal(false)
  }

  const handleVote = (songId: number) => {
    if (!activeEvent) return

    setEvents((currentEvents) =>
      currentEvents.map((eventItem) =>
        eventItem.id === activeEvent.id
          ? {
              ...eventItem,
              songs: eventItem.songs.map((song) =>
                song.id === songId ? { ...song, votes: song.votes + 1 } : song,
              ),
            }
          : eventItem,
      ),
    )
  }

  const openEvent = (eventId: number) => {
    setActiveEventId(eventId)
    setView('event')
  }

  const openGuestView = () => {
    if (!activeEvent) return
    setView('guest')
    setShowQrModal(false)
  }

  const totalSongs = activeEvent?.songs.length ?? 0
  const hostSongs = activeEvent?.songs.filter((song) => song.hostPick).length ?? 0
  const requestedSongs = activeEvent?.songs.filter((song) => !song.hostPick).length ?? 0
  const sortedSongs = [...(activeEvent?.songs ?? [])].sort((a, b) => b.votes - a.votes)

  return (
    <div className="yousong-app">
      <style>{youSongStyles}</style>

      {view === 'landing' && (
        <section className="yousong-landing">
          <div className="yousong-glow yousong-glow--one" />
          <div className="yousong-glow yousong-glow--two" />

          <div className="yousong-hero-card">
            <div className="yousong-logo-orb" aria-hidden="true">
              <DiscIcon />
            </div>

            <h1>
              DJ <span>Request</span>
            </h1>
            <p>
              La plataforma de peticiones musicales para tus fiestas. Los invitados votan, el DJ decide.
            </p>

            <div className="yousong-feature-grid">
              <FeatureCard icon={<MusicIcon />} label="Peticiones en vivo" />
              <FeatureCard icon={<UsersIcon />} label="Votos en tiempo real" />
              <FeatureCard icon={<DiscIcon />} label="Cola del DJ" />
            </div>

            <div className="yousong-login-box">
              <span>{isSignedIn ? 'Sesión activa' : '¿Eres DJ o anfitrión?'}</span>
              <button className="yousong-btn yousong-btn--primary" type="button" onClick={handleSignIn}>
                <LoginIcon />
                {isSignedIn ? 'Ir a mi panel de DJ' : 'Sign In'}
              </button>
            </div>
          </div>
        </section>
      )}

      {view === 'dashboard' && (
        <section className="yousong-screen">
          <Header
            isSignedIn={isSignedIn}
            userName="Carlos Hermida"
            onSignOut={handleSignOut}
            onGoHome={() => setView('landing')}
          />

          <main className="yousong-main">
            <div className="yousong-toolbar">
              <div>
                <h2>Mis Eventos</h2>
                <p>Gestiona tus fiestas y colas de canciones</p>
              </div>
              <button className="yousong-btn yousong-btn--primary" type="button" onClick={() => setShowEventModal(true)}>
                <PlusIcon />
                Nuevo Evento
              </button>
            </div>

            {events.length === 0 ? (
              <EmptyState icon={<CalendarIcon />} title="Sin eventos todavía" text="Crea tu primer evento para compartir solicitudes con tus invitados." />
            ) : (
              <div className="yousong-event-grid">
                {events.map((eventItem) => (
                  <button
                    className="yousong-event-card"
                    key={eventItem.id}
                    type="button"
                    onClick={() => openEvent(eventItem.id)}
                  >
                    <span className="yousong-status-dot" />
                    <h3>{eventItem.name}</h3>
                    <p>Anfitrión: {eventItem.host}</p>
                    <small>{eventItem.songs.length} canciones en cola</small>
                  </button>
                ))}
              </div>
            )}
          </main>
        </section>
      )}

      {view === 'event' && activeEvent && (
        <section className="yousong-screen">
          <EventTopBar
            title={activeEvent.name}
            subtitle="Anfitrión: Yo"
            onBack={() => setView('dashboard')}
            actions={
              <>
                <button className="yousong-btn yousong-btn--dark" type="button" onClick={() => setShowQrModal(true)}>
                  <QrIcon />
                  QR
                </button>
                <button className="yousong-btn yousong-btn--primary" type="button" onClick={() => setShowSongModal(true)}>
                  <StarIcon />
                  Añadir
                </button>
              </>
            }
          />

          <main className="yousong-main">
            <Stats totalSongs={totalSongs} hostSongs={hostSongs} requestedSongs={requestedSongs} />

            {sortedSongs.length === 0 ? (
              <EmptyState
                icon={<MusicIcon />}
                title="La cola está vacía"
                text="Añade canciones del anfitrión o comparte el QR con los invitados."
              />
            ) : (
              <SongQueue songs={sortedSongs} isGuest={false} onVote={handleVote} />
            )}
          </main>
        </section>
      )}

      {view === 'guest' && activeEvent && (
        <section className="yousong-guest">
          <div className="yousong-guest-header">
            <div className="yousong-logo-orb yousong-logo-orb--small" aria-hidden="true">
              <DiscIcon />
            </div>
            <h2>{activeEvent.name}</h2>
            <p>{activeEvent.description || 'Tu fiesta'}</p>
            <span className="yousong-live">
              <span />
              En vivo
            </span>
          </div>

          <main className="yousong-main yousong-main--guest">
            <div className="yousong-guest-tabs">
              <span>Favoritos del anfitrión</span>
              <span>Vota para subir en la cola</span>
            </div>

            {sortedSongs.length === 0 ? (
              <EmptyState icon={<MusicIcon />} title="Todavía no hay canciones" text="Sé el primero en pedir un tema para la fiesta." />
            ) : (
              <SongQueue songs={sortedSongs} isGuest onVote={handleVote} />
            )}
          </main>

          <button className="yousong-floating-btn" type="button" onClick={() => setShowSongModal(true)}>
            <PlusIcon />
            Pedir una canción
          </button>
        </section>
      )}

      {showEventModal && (
        <Modal title="Crear nuevo evento" onClose={() => setShowEventModal(false)}>
          <form className="yousong-form" onSubmit={handleCreateEvent}>
            <label>
              Nombre del evento *
              <input
                autoFocus
                required
                type="text"
                placeholder="Quinceañera de Ana"
                value={eventForm.name}
                onChange={(event) => setEventForm((form) => ({ ...form, name: event.target.value }))}
              />
            </label>
            <label>
              Nombre del anfitrión *
              <input
                required
                type="text"
                placeholder="Ana García"
                value={eventForm.host}
                onChange={(event) => setEventForm((form) => ({ ...form, host: event.target.value }))}
              />
            </label>
            <label>
              Descripción (opcional)
              <input
                type="text"
                placeholder="15 años de Ana - Salón Cristal"
                value={eventForm.description}
                onChange={(event) => setEventForm((form) => ({ ...form, description: event.target.value }))}
              />
            </label>
            <button className="yousong-btn yousong-btn--primary yousong-btn--full" type="submit">
              Crear evento
            </button>
          </form>
        </Modal>
      )}

      {showQrModal && activeEvent && (
        <Modal title="Código QR del evento" onClose={() => setShowQrModal(false)}>
          <div className="yousong-qr-wrap">
            <FakeQrCode value={eventUrl} />
            <p>{eventUrl}</p>
            <button className="yousong-btn yousong-btn--dark yousong-btn--full" type="button" onClick={openGuestView}>
              <LinkIcon />
              Abrir vista de invitados
            </button>
          </div>
        </Modal>
      )}

      {showSongModal && activeEvent && (
        <Modal title="Pedir canción al DJ" onClose={() => setShowSongModal(false)} compact={view === 'guest'}>
          <form className="yousong-form" onSubmit={handleCreateSong}>
            <label>
              Canción *
              <input
                autoFocus
                required
                type="text"
                placeholder="Ej: Despacito"
                value={songForm.title}
                onChange={(event) => setSongForm((form) => ({ ...form, title: event.target.value }))}
              />
            </label>
            <label>
              Artista
              <input
                type="text"
                placeholder="Ej: Luis Fonsi"
                value={songForm.artist}
                onChange={(event) => setSongForm((form) => ({ ...form, artist: event.target.value }))}
              />
            </label>
            <label>
              Tu nombre (opcional)
              <input
                type="text"
                placeholder="Fabril"
                value={songForm.requestedBy}
                onChange={(event) => setSongForm((form) => ({ ...form, requestedBy: event.target.value }))}
              />
            </label>
            <button className="yousong-btn yousong-btn--primary yousong-btn--full" type="submit">
              Enviar petición
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

const Header: React.FC<{
  isSignedIn: boolean
  userName: string
  onSignOut: () => void
  onGoHome: () => void
}> = ({ isSignedIn, userName, onSignOut, onGoHome }) => (
  <header className="yousong-header">
    <button className="yousong-brand" type="button" onClick={onGoHome}>
      <DiscIcon />
      <strong>DJ Request</strong>
    </button>
    <div className="yousong-user">
      {isSignedIn && <span>{userName}</span>}
      <button className="yousong-btn yousong-btn--primary" type="button" onClick={onSignOut}>
        <LoginIcon />
        Sign Out
      </button>
    </div>
  </header>
)

const EventTopBar: React.FC<{
  title: string
  subtitle: string
  actions: React.ReactNode
  onBack: () => void
}> = ({ title, subtitle, actions, onBack }) => (
  <header className="yousong-event-topbar">
    <div className="yousong-event-title">
      <button className="yousong-icon-btn" type="button" onClick={onBack} aria-label="Volver">
        <BackIcon />
      </button>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
    <div className="yousong-actions">{actions}</div>
  </header>
)

const FeatureCard: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="yousong-feature-card">
    {icon}
    <span>{label}</span>
  </div>
)

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="yousong-empty">
    <div>{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
)

const Stats: React.FC<{ totalSongs: number; hostSongs: number; requestedSongs: number }> = ({
  totalSongs,
  hostSongs,
  requestedSongs,
}) => (
  <div className="yousong-stats">
    <StatCard value={totalSongs} label="Total canciones" />
    <StatCard value={hostSongs} label="Del anfitrión" icon={<StarIcon />} />
    <StatCard value={requestedSongs} label="Solicitadas" />
  </div>
)

const StatCard: React.FC<{ value: number; label: string; icon?: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="yousong-stat-card">
    <strong>{value}</strong>
    <span>
      {icon}
      {label}
    </span>
  </div>
)

const SongQueue: React.FC<{
  songs: Song[]
  isGuest: boolean
  onVote: (songId: number) => void
}> = ({ songs, isGuest, onVote }) => (
  <div className="yousong-song-list">
    {songs.map((song) => (
      <article className="yousong-song-card" key={song.id}>
        <div>
          {song.hostPick && <small>Favorito del anfitrión</small>}
          <h3>{song.title}</h3>
          <p>
            {song.artist || 'Artista sin especificar'} · Pedido por {song.requestedBy}
          </p>
        </div>
        <div className="yousong-vote-box">
          <strong>{song.votes}</strong>
          {isGuest && (
            <button type="button" onClick={() => onVote(song.id)}>
              <ThumbIcon />
              Votar
            </button>
          )}
        </div>
      </article>
    ))}
  </div>
)

const Modal: React.FC<{
  title: string
  children: React.ReactNode
  compact?: boolean
  onClose: () => void
}> = ({ title, children, compact = false, onClose }) => (
  <div className="yousong-modal-backdrop" role="presentation">
    <div className={`yousong-modal ${compact ? 'yousong-modal--compact' : ''}`} role="dialog" aria-modal="true">
      <button className="yousong-close" type="button" onClick={onClose} aria-label="Cerrar">
        ×
      </button>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
)

const FakeQrCode: React.FC<{ value: string }> = ({ value }) => {
  const cells = useMemo(() => buildQrCells(value), [value])

  return (
    <div className="yousong-qr" aria-label="Código QR visual del evento">
      {cells.map((isFilled, index) => (
        <span className={isFilled ? 'is-filled' : ''} key={index} />
      ))}
    </div>
  )
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const buildQrCells = (value: string) => {
  const size = 21
  const cells = Array.from({ length: size * size }, (_, index) => {
    const code = value.charCodeAt(index % Math.max(value.length, 1)) || 0
    return (index * 7 + code * 13 + index % 5) % 4 === 0
  })

  const drawFinder = (row: number, col: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const border = x === 0 || y === 0 || x === 6 || y === 6
        const center = x >= 2 && x <= 4 && y >= 2 && y <= 4
        cells[(row + y) * size + col + x] = border || center
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(0, size - 7)
  drawFinder(size - 7, 0)

  return cells
}

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const DiscIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M7 12a5 5 0 0 1 5-5" />
    <path d="M17 12a5 5 0 0 1-5 5" />
  </Icon>
)

const MusicIcon = () => (
  <Icon>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Icon>
)

const UsersIcon = () => (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
)

const LoginIcon = () => (
  <Icon>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </Icon>
)

const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
)

const CalendarIcon = () => (
  <Icon>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </Icon>
)

const BackIcon = () => (
  <Icon>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </Icon>
)

const QrIcon = () => (
  <Icon>
    <rect width="5" height="5" x="3" y="3" />
    <rect width="5" height="5" x="16" y="3" />
    <rect width="5" height="5" x="3" y="16" />
    <path d="M14 14h1v1h-1z" />
    <path d="M18 14h3v3" />
    <path d="M14 18v3h3" />
    <path d="M21 21h-1" />
  </Icon>
)

const StarIcon = () => (
  <Icon>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 21 12 17.77 5.82 21 7 14.15l-5-4.88 6.91-1.01L12 2z" />
  </Icon>
)

const LinkIcon = () => (
  <Icon>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Icon>
)

const ThumbIcon = () => (
  <Icon>
    <path d="M7 10v11" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </Icon>
)

const youSongStyles = `
.yousong-app {
  --ys-bg: #02020a;
  --ys-panel: rgba(8, 8, 18, 0.92);
  --ys-panel-soft: rgba(18, 16, 32, 0.88);
  --ys-border: rgba(255, 255, 255, 0.1);
  --ys-text: #f8f7ff;
  --ys-muted: #8f8ba3;
  --ys-pink: #f048df;
  --ys-pink-2: #ff5bf4;
  --ys-purple: #7b2cff;
  --ys-green: #2ce68f;
  min-height: 100vh;
  background: var(--ys-bg);
  color: var(--ys-text);
  font-family: Inter, Candara, 'Segoe UI', sans-serif;
}

.yousong-app *,
.yousong-app *::before,
.yousong-app *::after {
  box-sizing: border-box;
}

.yousong-app button,
.yousong-app input {
  font: inherit;
}

.yousong-landing,
.yousong-screen,
.yousong-guest {
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% -10%, rgba(240, 72, 223, 0.24), transparent 34%),
    radial-gradient(circle at 20% 30%, rgba(123, 44, 255, 0.11), transparent 32%),
    linear-gradient(180deg, #05050d 0%, #05000b 48%, #020208 100%);
  overflow: hidden;
  position: relative;
}

.yousong-landing {
  display: grid;
  place-items: center;
  padding: 3rem 1.25rem;
}

.yousong-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(80px);
  opacity: 0.5;
  pointer-events: none;
}

.yousong-glow--one {
  width: 18rem;
  height: 18rem;
  top: -7rem;
  background: var(--ys-pink);
}

.yousong-glow--two {
  width: 22rem;
  height: 22rem;
  right: -9rem;
  bottom: 10%;
  background: rgba(123, 44, 255, 0.45);
}

.yousong-hero-card {
  width: min(100%, 760px);
  text-align: center;
  position: relative;
  z-index: 1;
}

.yousong-logo-orb {
  width: 6.2rem;
  height: 6.2rem;
  margin: 0 auto 2rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--ys-pink-2);
  background: radial-gradient(circle, rgba(240, 72, 223, 0.24), rgba(240, 72, 223, 0.1));
  border: 1px solid rgba(240, 72, 223, 0.45);
  box-shadow: 0 0 48px rgba(240, 72, 223, 0.28);
}

.yousong-logo-orb svg {
  width: 3.1rem;
  height: 3.1rem;
}

.yousong-logo-orb--small {
  width: 4.6rem;
  height: 4.6rem;
  margin-bottom: 1rem;
}

.yousong-logo-orb--small svg {
  width: 2.35rem;
  height: 2.35rem;
}

.yousong-hero-card h1 {
  color: var(--ys-text);
  font-size: clamp(3rem, 9vw, 4.9rem);
  line-height: 0.95;
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.06em;
}

.yousong-hero-card h1 span {
  color: var(--ys-pink-2);
}

.yousong-hero-card > p {
  max-width: 34rem;
  margin: 1.35rem auto 2.4rem;
  color: var(--ys-muted);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 1.55;
}

.yousong-feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.yousong-feature-card {
  min-height: 5.2rem;
  padding: 1rem;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  gap: 0.45rem;
  background: rgba(3, 4, 14, 0.82);
  border: 1px solid var(--ys-border);
  color: var(--ys-muted);
}

.yousong-feature-card svg {
  width: 1.45rem;
  height: 1.45rem;
  color: var(--ys-pink-2);
}

.yousong-login-box {
  display: inline-grid;
  gap: 0.85rem;
  justify-items: center;
}

.yousong-login-box span {
  color: var(--ys-muted);
  font-weight: 700;
}

.yousong-btn {
  border: 0;
  border-radius: 0.8rem;
  min-height: 2.75rem;
  padding: 0.75rem 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  color: var(--ys-text);
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.yousong-btn:hover {
  transform: translateY(-1px);
}

.yousong-btn svg {
  width: 1.1rem;
  height: 1.1rem;
}

.yousong-btn--primary {
  color: #1a1020;
  background: linear-gradient(135deg, var(--ys-pink), var(--ys-pink-2));
  box-shadow: 0 12px 28px rgba(240, 72, 223, 0.22);
}

.yousong-btn--dark {
  background: rgba(18, 18, 32, 0.96);
  border: 1px solid var(--ys-border);
}

.yousong-btn--full {
  width: 100%;
}

.yousong-header,
.yousong-event-topbar {
  min-height: 4.6rem;
  padding: 0.85rem clamp(1rem, 4vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--ys-border);
  background: rgba(3, 3, 10, 0.72);
  backdrop-filter: blur(18px);
}

.yousong-brand,
.yousong-icon-btn {
  border: 0;
  background: transparent;
  color: var(--ys-text);
  cursor: pointer;
}

.yousong-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.2rem;
}

.yousong-brand svg {
  width: 1.6rem;
  height: 1.6rem;
  color: var(--ys-pink-2);
}

.yousong-user,
.yousong-actions,
.yousong-event-title {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.yousong-user span,
.yousong-event-title p,
.yousong-toolbar p {
  color: var(--ys-muted);
}

.yousong-main {
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(1.6rem, 5vw, 3rem) 1rem;
}

.yousong-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.yousong-toolbar h2,
.yousong-event-title h2,
.yousong-guest-header h2 {
  color: var(--ys-text);
  margin: 0;
  font-size: clamp(1.8rem, 5vw, 2.35rem);
  font-weight: 900;
}

.yousong-toolbar p,
.yousong-event-title p {
  margin: 0.3rem 0 0;
}

.yousong-icon-btn {
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
}

.yousong-icon-btn svg {
  width: 1.35rem;
  height: 1.35rem;
}

.yousong-empty {
  min-height: 42vh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.7rem;
  text-align: center;
}

.yousong-empty > div {
  width: 5.4rem;
  height: 5.4rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--ys-pink-2);
  background: rgba(240, 72, 223, 0.13);
}

.yousong-empty svg {
  width: 2.8rem;
  height: 2.8rem;
}

.yousong-empty h3 {
  color: var(--ys-text);
  margin: 0;
  font-size: 1.45rem;
}

.yousong-empty p {
  color: var(--ys-muted);
  margin: 0;
}

.yousong-event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.yousong-event-card,
.yousong-song-card,
.yousong-stat-card {
  background: var(--ys-panel-soft);
  border: 1px solid var(--ys-border);
  border-radius: 1rem;
  color: var(--ys-text);
}

.yousong-event-card {
  text-align: left;
  padding: 1.1rem;
  cursor: pointer;
}

.yousong-event-card h3,
.yousong-song-card h3 {
  margin: 0.25rem 0;
  color: var(--ys-text);
}

.yousong-event-card p,
.yousong-song-card p {
  margin: 0;
  color: var(--ys-muted);
}

.yousong-event-card small {
  display: inline-block;
  margin-top: 1rem;
  color: var(--ys-pink-2);
}

.yousong-status-dot {
  width: 0.6rem;
  height: 0.6rem;
  display: inline-block;
  border-radius: 999px;
  background: var(--ys-green);
  box-shadow: 0 0 18px rgba(44, 230, 143, 0.55);
}

.yousong-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.2rem;
}

.yousong-stat-card {
  min-height: 5.4rem;
  padding: 1rem;
  display: grid;
  place-items: center;
  gap: 0.3rem;
}

.yousong-stat-card strong {
  color: var(--ys-pink-2);
  font-size: 2rem;
  line-height: 1;
  text-shadow: 0 0 18px rgba(240, 72, 223, 0.4);
}

.yousong-stat-card span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--ys-muted);
}

.yousong-stat-card svg {
  width: 1rem;
  height: 1rem;
  color: #ffd54f;
}

.yousong-song-list {
  display: grid;
  gap: 0.85rem;
}

.yousong-song-card {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.yousong-song-card small {
  color: #ffd54f;
}

.yousong-vote-box {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  color: var(--ys-pink-2);
}

.yousong-vote-box button {
  border: 0;
  background: transparent;
  color: var(--ys-text);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.yousong-vote-box svg {
  width: 1rem;
  height: 1rem;
}

.yousong-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: start center;
  padding: 2rem 1rem;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(7px);
  overflow: auto;
}

.yousong-modal {
  position: relative;
  width: min(100%, 640px);
  padding: 1.45rem;
  border-radius: 1rem;
  background: rgba(2, 2, 8, 0.98);
  border: 1px solid var(--ys-border);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
}

.yousong-modal--compact {
  width: min(100%, 340px);
}

.yousong-modal h2 {
  color: var(--ys-text);
  margin: 0 2rem 1rem 0;
  font-size: 1.3rem;
}

.yousong-close {
  position: absolute;
  top: 0.8rem;
  right: 0.9rem;
  border: 0;
  background: transparent;
  color: var(--ys-muted);
  font-size: 1.5rem;
  cursor: pointer;
}

.yousong-form {
  display: grid;
  gap: 0.95rem;
}

.yousong-form label {
  display: grid;
  gap: 0.4rem;
  color: var(--ys-text);
  font-weight: 800;
}

.yousong-form input {
  width: 100%;
  min-height: 2.8rem;
  border-radius: 0.7rem;
  padding: 0 0.85rem;
  color: var(--ys-text);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  outline: none;
}

.yousong-form input:focus {
  border-color: var(--ys-pink-2);
  box-shadow: 0 0 0 3px rgba(240, 72, 223, 0.25);
}

.yousong-qr-wrap {
  display: grid;
  justify-items: center;
  gap: 1.1rem;
}

.yousong-qr-wrap p {
  max-width: 100%;
  margin: 0;
  color: var(--ys-muted);
  overflow-wrap: anywhere;
  text-align: center;
}

.yousong-qr {
  width: min(62vw, 256px);
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  gap: 2px;
  padding: 0.75rem;
  border-radius: 0.9rem;
  background: #fff;
}

.yousong-qr span {
  background: #fff;
}

.yousong-qr span.is-filled {
  background: #050505;
}

.yousong-guest {
  padding-bottom: 5rem;
}

.yousong-guest-header {
  text-align: center;
  padding: 2.2rem 1rem 1.2rem;
  background: linear-gradient(180deg, rgba(240, 72, 223, 0.23), transparent);
}

.yousong-guest-header p {
  margin: 0.35rem 0 0.7rem;
  color: var(--ys-muted);
}

.yousong-live,
.yousong-guest-tabs {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--ys-muted);
}

.yousong-live span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--ys-green);
}

.yousong-main--guest {
  max-width: 480px;
}

.yousong-guest-tabs {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 0.8rem;
}

.yousong-floating-btn {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  z-index: 20;
  transform: translateX(-50%);
  width: min(calc(100% - 2rem), 460px);
  min-height: 3.2rem;
  border: 0;
  border-radius: 0.55rem;
  color: #17091b;
  background: linear-gradient(135deg, var(--ys-pink), var(--ys-pink-2));
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  cursor: pointer;
}

.yousong-floating-btn svg {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 720px) {
  .yousong-feature-grid,
  .yousong-stats {
    grid-template-columns: 1fr;
  }

  .yousong-header,
  .yousong-event-topbar,
  .yousong-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .yousong-user,
  .yousong-actions {
    justify-content: space-between;
  }

  .yousong-song-card {
    align-items: flex-start;
  }
}
`

export default YouSong

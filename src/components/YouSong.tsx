import Footer from './Footer'
import SocialSection from './SocialSection'

const YouSong = () => {
  return (
    <>
      <main className="container py-5" style={{ minHeight: '70vh' }}>
        <section className="text-center">
          <h1>YouSong</h1>
          <p className="lead">Pagina de YouSong en construccion.</p>
          <a className="btn btn-light mt-3" href="/" title="Volver a DJ Carlos Hermida">
            Volver a DJ Carlos Hermida
          </a>
        </section>
      </main>
      <SocialSection />
      <Footer />
    </>
  )
}

export default YouSong

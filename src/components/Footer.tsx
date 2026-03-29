import React from 'react'

const Footer: React.FC = () => (
  <footer className="py-4 bg-black text-white text-center">
    <div className="container">
      <p className="mb-0">
        © {new Date().getFullYear()} | <i><a href="#home">djcarloshermida</a></i> | Todos los derechos reservados®.
      </p>
    </div>
  </footer>
)

export default Footer

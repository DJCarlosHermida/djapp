import React from 'react'

type GaleriaFilterBarProps = {
  categorias: string[]
  filtroCategoria: string
  onSelectCategoria: (categoria: string) => void
}

const GaleriaFilterBar: React.FC<GaleriaFilterBarProps> = ({
  categorias,
  filtroCategoria,
  onSelectCategoria,
}) => (
  <div
    className="galeria-filter-bar mx-auto d-flex flex-wrap justify-content-center"
    role="toolbar"
    aria-label="Filtrar galería por categoría"
  >
    <div className="galeria-filters d-flex flex-wrap justify-content-center gap-2">
      <button
        type="button"
        className={`galeria-filter-chip btn btn-sm ${filtroCategoria === 'todos' ? 'galeria-filter-chip--active' : ''}`}
        onClick={() => onSelectCategoria('todos')}
        aria-pressed={filtroCategoria === 'todos'}
      >
        Todos
      </button>
      {categorias.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`galeria-filter-chip btn btn-sm ${filtroCategoria === cat ? 'galeria-filter-chip--active' : ''}`}
          onClick={() => onSelectCategoria(cat)}
          aria-pressed={filtroCategoria === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
)

export default GaleriaFilterBar

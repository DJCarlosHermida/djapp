import React from 'react'

/** Bandera de Uruguay animada (SVG: 9 franjas + Sol de Mayo en el cantón) */
const UruguayFlag: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => {
  const blue = '#0038a8'
  const white = '#ffffff'
  const sunYellow = '#FCD116'
  const ratio = 2 / 3
  const w = size * ratio
  const h = size

  return (
    <span className={`uruguay-flag-wrap ${className}`} title="Uruguay" aria-hidden>
      <svg
        className="uruguay-flag"
        viewBox="0 0 18 27"
        width={w}
        height={h}
        role="img"
        aria-label="Bandera de Uruguay"
      >
        {/* 9 franjas horizontales (blanco, azul, ...) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <rect
            key={i}
            x={0}
            y={i * 3}
            width={18}
            height={42}
            fill={i % 2 === 0 ? white : blue}
          />
        ))}
        {/* Cantón blanco (cuadrado 5 franjas) */}
        <rect x={0} y={0} width={15} height={15} fill={white} />
        {/* Sol de Mayo */}
        <g transform="translate(7.5, 7.5)">
          <circle r={2.8} fill={sunYellow} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i * 45 * Math.PI) / 180
            const r1 = 3
            const r2 = 6.5
            return (
              <line
                key={i}
                x1={r1 * Math.cos(a)}
                y1={r1 * Math.sin(a)}
                x2={r2 * Math.cos(a)}
                y2={r2 * Math.sin(a)}
                stroke={sunYellow}
                strokeWidth={0.5}
                strokeLinecap="round"
              />
            )
          })}
        </g>
      </svg>
    </span>
  )
}

export default UruguayFlag

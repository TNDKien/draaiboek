import { ImageOff } from 'lucide-react'

// Distinct placeholder palettes per category
const palettes = {
  blauw:   { bg: '#dbeafe', accent: '#1d4ed8', muted: '#93c5fd' },
  groen:   { bg: '#dcfce7', accent: '#15803d', muted: '#86efac' },
  paars:   { bg: '#ede9fe', accent: '#6d28d9', muted: '#c4b5fd' },
  goud:    { bg: '#fef9c3', accent: '#a16207', muted: '#fde047' },
  rood:    { bg: '#fee2e2', accent: '#b91c1c', muted: '#fca5a5' },
  bruin:   { bg: '#fdf4e7', accent: '#78350f', muted: '#d4a96a' },
}

// Simple deterministic shape scene for a category
function IllustratieSvg({ categorie, kleur }) {
  const p = palettes[kleur] || palettes.bruin

  const scenes = {
    geluid: (
      <g>
        {/* Sound waves */}
        {[32, 48, 64, 80].map((r, i) => (
          <circle key={r} cx="120" cy="100" r={r} fill="none" stroke={p.accent} strokeWidth="3" opacity={1 - i * 0.2} />
        ))}
        <circle cx="120" cy="100" r="14" fill={p.accent} />
        {/* Bell */}
        <ellipse cx="120" cy="100" rx="10" ry="10" fill="white" opacity="0.6" />
      </g>
    ),
    bouwen: (
      <g>
        {/* Stack of blocks */}
        <rect x="60" y="130" width="50" height="30" rx="4" fill={p.accent} />
        <rect x="70" y="100" width="50" height="30" rx="4" fill={p.muted} />
        <rect x="80" y="70" width="50" height="30" rx="4" fill={p.accent} opacity="0.7" />
        <rect x="90" y="45" width="40" height="25" rx="4" fill={p.muted} opacity="0.6" />
        {/* Sphere */}
        <circle cx="170" cy="140" r="22" fill={p.muted} />
        <circle cx="163" cy="133" r="6" fill="white" opacity="0.4" />
      </g>
    ),
    muziek: (
      <g>
        {/* Staff lines */}
        {[60, 76, 92, 108, 124].map(y => (
          <line key={y} x1="30" y1={y} x2="210" y2={y} stroke={p.muted} strokeWidth="2" />
        ))}
        {/* Notes */}
        <ellipse cx="80" cy="124" rx="10" ry="7" fill={p.accent} transform="rotate(-15,80,124)" />
        <line x1="89" y1="120" x2="89" y2="70" stroke={p.accent} strokeWidth="2.5" />
        <ellipse cx="130" cy="92" rx="10" ry="7" fill={p.accent} transform="rotate(-15,130,92)" />
        <line x1="139" y1="88" x2="139" y2="55" stroke={p.accent} strokeWidth="2.5" />
        <ellipse cx="170" cy="108" rx="10" ry="7" fill={p.accent} transform="rotate(-15,170,108)" />
        <line x1="179" y1="104" x2="179" y2="64" stroke={p.accent} strokeWidth="2.5" />
      </g>
    ),
    geur: (
      <g>
        {/* Jar */}
        <rect x="80" y="90" width="80" height="75" rx="8" fill={p.accent} opacity="0.85" />
        <rect x="88" y="80" width="64" height="18" rx="4" fill={p.accent} />
        {/* Steam */}
        {[105, 120, 135].map((x, i) => (
          <path key={x} d={`M${x} 75 Q${x + (i % 2 === 0 ? 10 : -10)} 55 ${x} 35`}
            fill="none" stroke={p.muted} strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {/* Label */}
        <rect x="90" y="110" width="60" height="35" rx="4" fill="white" opacity="0.4" />
      </g>
    ),
    kaart: (
      <g>
        {/* Map outline */}
        <rect x="30" y="50" width="180" height="130" rx="6" fill={p.bg} stroke={p.muted} strokeWidth="2" />
        {/* Roads */}
        <polyline points="30,120 90,100 130,130 210,110" fill="none" stroke={p.accent} strokeWidth="3" strokeLinejoin="round" />
        <polyline points="120,50 115,100 130,130 125,180" fill="none" stroke={p.muted} strokeWidth="2" strokeDasharray="6,4" />
        {/* Checkpoints */}
        {[[90,100],[130,130],[115,100]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="6" fill={p.accent} stroke="white" strokeWidth="2" />
        ))}
        {/* Start marker */}
        <polygon points="55,90 65,90 60,78" fill={p.accent} />
      </g>
    ),
    samenwerking: (
      <g>
        {/* Two figures holding hands */}
        <circle cx="90" cy="68" r="18" fill={p.muted} />
        <rect x="76" y="88" width="28" height="45" rx="10" fill={p.accent} />
        <circle cx="150" cy="68" r="18" fill={p.accent} opacity="0.7" />
        <rect x="136" y="88" width="28" height="45" rx="10" fill={p.muted} />
        {/* Hands */}
        <line x1="104" y1="112" x2="136" y2="112" stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
        {/* Heart above */}
        <path d="M120 55 C120 55 108 44 108 37 C108 31 114 28 120 34 C126 28 132 31 132 37 C132 44 120 55 120 55Z"
          fill={p.accent} opacity="0.6" />
      </g>
    ),
  }

  const scene = scenes[categorie] || (
    <g>
      <circle cx="120" cy="100" r="60" fill={p.muted} opacity="0.4" />
      <ImageOff x="96" y="76" size={48} color={p.accent} />
    </g>
  )

  return (
    <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ width: '100%', height: '100%' }}>
      <rect width="240" height="200" fill={p.bg} />
      {scene}
    </svg>
  )
}

export default function MockupImage({ afbeelding, kleur = 'bruin', src: srcProp = null }) {
  const {
    categorie = 'default',
    alt = '',
    onderschrift = '',
    bron = null,
  } = afbeelding

  // srcProp (top-level "src" on the page) wins over afbeelding.bron
  const resolvedSrc = srcProp || bron
  const p = palettes[kleur] || palettes.bruin

  return (
    <figure className="flex flex-col h-full">
      {/* Image area */}
      <div className="relative flex-1 overflow-hidden rounded-lg mx-6 mt-6 shadow-inner"
        style={{
          border: resolvedSrc ? 'none' : `2px dashed ${p.muted}`,
          background: resolvedSrc ? 'transparent' : p.bg,
        }}>

        {resolvedSrc ? (
          <img
            src={resolvedSrc}
            alt={alt}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <>
            <IllustratieSvg categorie={categorie} kleur={kleur} />
            {/* Placeholder badge */}
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-sans font-medium"
              style={{ background: p.accent, color: 'white', opacity: 0.85 }}>
              afbeelding
            </div>
          </>
        )}
      </div>

      {/* Caption */}
      {onderschrift && (
        <figcaption className="px-8 pt-3 pb-6 text-center font-sans text-xs text-ink-light italic leading-snug">
          {onderschrift}
        </figcaption>
      )}
      {!onderschrift && <div className="pb-6" />}
    </figure>
  )
}

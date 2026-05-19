import AudioPlayer from './AudioPlayer'
import MockupImage from './MockupImage'

function Badge({ label, kleur }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-sans font-semibold text-white mb-3"
      style={{ backgroundColor: kleur }}
      aria-label={`Categorie: ${label}`}
    >
      {label}
    </span>
  )
}

function FormattedText({ text }) {
  return (
    <div className="space-y-3">
      {text.split('\n\n').map((para, i) => (
        <p key={i} className="text-sm leading-relaxed whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  )
}

export default function Page({ data, side }) {
  if (!data) return null

  const isLeft = side === 'left'
  const gradientClass = isLeft ? 'page-left' : 'page-right'
  const isImageOnly = data.type === 'image'

  return (
    <article
      className={`relative h-full paper-texture ${gradientClass} overflow-hidden`}
      aria-label={`${isLeft ? 'Linker' : 'Rechter'} pagina: ${data.titel || data.afbeelding?.alt || ''}`}
    >
      {isImageOnly ? (
        /* Image page — 16:9 image + optional text below */
        <div className="h-full overflow-y-auto page-content flex flex-col">
          {/* 16:9 image container — always shows full image */}
          <div className="w-full flex-shrink-0 bg-black/5" style={{ aspectRatio: '16/9' }}>
            {data.src ? (
              <img
                src={data.src}
                alt={data.afbeelding?.alt || ''}
                className="w-full h-full object-contain"
              />
            ) : (
              <MockupImage afbeelding={data.afbeelding || {}} kleur={data.paletKleur || 'bruin'} />
            )}
          </div>

          {/* Caption */}
          {data.afbeelding?.onderschrift && (
            <p className="px-6 pt-3 font-sans text-xs text-ink-light italic text-center leading-snug flex-shrink-0">
              {data.afbeelding.onderschrift}
            </p>
          )}

          {/* Optional extra text below the image */}
          {data.inhoud && (
            <div className="px-8 pt-4 pb-6 font-serif text-sm text-ink leading-relaxed">
              <FormattedText text={data.inhoud} />
            </div>
          )}

          {/* Audio player below image */}
          {data.audio && (
            <div className="px-6 pb-6">
              <AudioPlayer audio={data.audio} />
            </div>
          )}
        </div>
      ) : (
        /* Text / combination page */
        <div className="h-full overflow-y-auto page-content px-10 py-9">

          {data.badge && <Badge label={data.badge} kleur={data.badgeKleur || '#4a3728'} />}

          {data.titel && (
            <h2 className="font-serif text-2xl font-bold text-ink mb-1 leading-tight">
              {data.titel}
            </h2>
          )}

          {data.subtitel && (
            <p className="font-sans text-xs text-ink-light uppercase tracking-widest mb-4">
              {data.subtitel}
            </p>
          )}

          {(data.titel || data.badge) && (
            <div className="flex items-center gap-2 mb-5" aria-hidden="true">
              <div className="h-px flex-1 bg-spine/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-spine/60" />
              <div className="h-px w-6 bg-spine/40" />
            </div>
          )}

          {data.inhoud && (
            <div className="text-ink font-serif">
              <FormattedText text={data.inhoud} />
            </div>
          )}

          {/* Inline image (for combination pages with an image block) */}
          {data.afbeelding && (
            <div className="mt-5 rounded-lg overflow-hidden" style={{ height: '220px' }}>
              <MockupImage afbeelding={data.afbeelding} kleur={data.paletKleur || 'bruin'} src={data.src} />
            </div>
          )}

          {data.audio && <AudioPlayer audio={data.audio} />}
        </div>
      )}

      {/* Page edge shadow */}
      <div
        className={`absolute inset-y-0 w-6 pointer-events-none ${
          isLeft
            ? 'right-0 bg-gradient-to-r from-transparent to-black/5'
            : 'left-0 bg-gradient-to-l from-transparent to-black/5'
        }`}
        aria-hidden="true"
      />
    </article>
  )
}

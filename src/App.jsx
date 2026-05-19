import { useState, useEffect, useCallback } from 'react'
import { Menu } from 'lucide-react'
import BookFrame from './components/BookFrame'
import TableOfContents from './components/TableOfContents'

function buildFlatSpreads(hoofdstukken) {
  const flat = []
  for (const h of hoofdstukken) {
    for (let i = 0; i < h.paginaPairs.length; i++) {
      flat.push({
        spread: h.paginaPairs[i],
        chapterTitle: h.titel,
        chapterKleur: h.kleur,
        chapterIndex: hoofdstukken.indexOf(h),
        pairIndex: i,
      })
    }
  }
  return flat
}

// Load draaiboek.json (base) + merge all concept files listed in manifest.json
async function loadBoek() {
  const opts = { cache: 'no-store' }

  const [base, manifest] = await Promise.all([
    fetch('/draaiboek.json', opts).then(r => { if (!r.ok) throw new Error(`draaiboek.json: HTTP ${r.status}`); return r.json() }),
    fetch('/concepts/manifest.json', opts).then(r => r.ok ? r.json() : { concepten: [] }),
  ])

  const extraHoofdstukken = await Promise.all(
    (manifest.concepten || []).map(filename =>
      fetch(`/concepts/${filename}`, opts)
        .then(r => { if (!r.ok) throw new Error(`${filename}: HTTP ${r.status}`); return r.json() })
        .catch(err => { console.warn('Concept overgeslagen:', err.message); return null })
    )
  )

  return {
    ...base,
    hoofdstukken: [
      ...base.hoofdstukken,
      ...extraHoofdstukken.filter(Boolean),
    ],
  }
}

export default function App() {
  const [boek, setBoek] = useState(null)
  const [flatSpreads, setFlatSpreads] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [tocOpen, setTocOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBoek()
      .then((data) => {
        setBoek(data)
        setFlatSpreads(buildFlatSpreads(data.hoofdstukken))
      })
      .catch((e) => setError(e.message))
  }, [])

  const goTo = useCallback((index) => {
    if (index < 0 || index >= flatSpreads.length) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex, flatSpreads.length])

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  const navigateTo = useCallback((chapterIndex, pairIndex) => {
    const idx = flatSpreads.findIndex(
      (s) => s.chapterIndex === chapterIndex && s.pairIndex === pairIndex
    )
    if (idx !== -1) goTo(idx)
  }, [flatSpreads, goTo])

  useEffect(() => {
    const handler = (e) => {
      if (tocOpen) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev() }
      else if (e.key === 't' || e.key === 'T') { setTocOpen((v) => !v) }
      else if (e.key === 'Escape') { setTocOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, tocOpen])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-paper font-sans">
        <p>Fout bij laden: {error}</p>
      </div>
    )
  }

  if (!boek || flatSpreads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-paper font-sans">
        <p aria-live="polite">Draaiboek laden…</p>
      </div>
    )
  }

  const current = flatSpreads[currentIndex]

  return (
    <>
      <a
        href="#book-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50
                   focus:px-4 focus:py-2 focus:bg-paper focus:text-ink focus:rounded-lg focus:font-sans"
      >
        Ga naar boekinhoud
      </a>

      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3">
        <button
          onClick={() => setTocOpen(true)}
          aria-label="Open inhoudsopgave (T)"
          aria-expanded={tocOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-paper/10 border border-paper/20
                     text-paper font-sans text-xs hover:bg-paper/20 transition-all backdrop-blur-sm"
        >
          <Menu size={14} />
          Inhoudsopgave
        </button>

        <h1 className="font-serif text-sm text-paper/70 hidden sm:block">
          {boek.titel}
        </h1>

        <div className="text-xs font-sans text-paper/40" aria-hidden="true">
          {currentIndex + 1} / {flatSpreads.length}
        </div>
      </header>

      <TableOfContents
        hoofdstukken={boek.hoofdstukken}
        currentSpreadId={current.spread.id}
        onNavigate={navigateTo}
        onClose={() => setTocOpen(false)}
        isOpen={tocOpen}
      />

      <div id="book-content">
        <BookFrame
          spread={current.spread}
          spreadIndex={currentIndex}
          totalSpreads={flatSpreads.length}
          chapterTitle={current.chapterTitle}
          chapterKleur={current.chapterKleur}
          direction={direction}
          onPrev={goPrev}
          onNext={goNext}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex < flatSpreads.length - 1}
        />
      </div>

      <p className="fixed bottom-4 right-6 text-xs font-sans text-paper/30 hidden md:block" aria-hidden="true">
        ← → bladeren &nbsp;·&nbsp; T inhoudsopgave
      </p>
    </>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Page from './Page'

const pageVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 90 : -90,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -90 : 90,
  }),
}

const pageTransition = { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }

export default function BookFrame({
  spread,
  spreadIndex,
  totalSpreads,
  chapterTitle,
  chapterKleur,
  direction,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 select-none">

      {/* Fixed side navigation — outside the book so pages remain fully interactive */}
      {canGoPrev && (
        <button
          onClick={onPrev}
          aria-label="Vorige pagina"
          className="group fixed left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center
                     h-32 w-10 rounded-r-xl
                     bg-paper/5 hover:bg-paper/15 border-r border-t border-b border-paper/10
                     hover:border-paper/25 transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronLeft
            size={20}
            className="text-paper/40 group-hover:text-paper/80 transition-colors duration-200
                       -translate-x-0.5 group-hover:translate-x-0 transition-transform"
          />
        </button>
      )}

      {canGoNext && (
        <button
          onClick={onNext}
          aria-label="Volgende pagina"
          className="group fixed right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center
                     h-32 w-10 rounded-l-xl
                     bg-paper/5 hover:bg-paper/15 border-l border-t border-b border-paper/10
                     hover:border-paper/25 transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronRight
            size={20}
            className="text-paper/40 group-hover:text-paper/80 transition-colors duration-200
                       translate-x-0.5 group-hover:translate-x-0 transition-transform"
          />
        </button>
      )}

      {/* Chapter header */}
      <div className="mb-3 text-center" aria-live="polite" aria-atomic="true">
        <p className="font-sans text-xs uppercase tracking-widest text-paper/60">
          {chapterTitle}
        </p>
        <div
          className="h-px w-20 mx-auto mt-1.5 rounded-full opacity-50"
          style={{ backgroundColor: chapterKleur }}
          aria-hidden="true"
        />
      </div>

      {/* The Book */}
      <div
        className="relative"
        role="main"
        aria-label="Digitaal boek"
        style={{
          filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.55))',
          width: 'min(96vw, 1340px)',
        }}
      >
        {/* Cover boards */}
        <div
          className="absolute -left-3.5 inset-y-0 w-3.5 rounded-l-sm"
          style={{ background: 'linear-gradient(to right, #1e0f09, #4a3728)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -right-3.5 inset-y-0 w-3.5 rounded-r-sm"
          style={{ background: 'linear-gradient(to left, #1e0f09, #4a3728)' }}
          aria-hidden="true"
        />

        {/* Book block */}
        <div
          className="flex overflow-hidden rounded-sm"
          style={{
            width: 'min(96vw, 1340px)',
            height: 'min(86vh, 820px)',
          }}
        >
          {/* Left page */}
          <div className="relative flex-1 overflow-hidden h-full" aria-label="Linker pagina">
            {/* Inner gutter shadow */}
            <div
              className="absolute inset-y-0 right-0 w-6 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.06))' }}
              aria-hidden="true"
            />

            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={`${spreadIndex}-left`}
                className="absolute inset-0"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
              >
                <Page data={spread?.linker} side="left" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Spine */}
          <div
            className="book-spine flex-shrink-0 relative z-10"
            style={{ width: '16px' }}
            aria-hidden="true"
          >
            {[18, 32, 50, 68, 82].map((pct) => (
              <div
                key={pct}
                className="absolute left-1 right-1 h-px bg-cover/30"
                style={{ top: `${pct}%` }}
              />
            ))}
          </div>

          {/* Right page */}
          <div className="relative flex-1 overflow-hidden h-full" aria-label="Rechter pagina">
            {/* Inner gutter shadow */}
            <div
              className="absolute inset-y-0 left-0 w-6 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.06))' }}
              aria-hidden="true"
            />

            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={`${spreadIndex}-right`}
                className="absolute inset-0"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ ...pageTransition, delay: 0.04 }}
              >
                <Page data={spread?.rechter} side="right" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Minimal bottom navigation */}
      <div
        className="mt-5 flex items-center gap-5"
        role="navigation"
        aria-label="Boek navigatie"
      >
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Vorige pagina"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-xs font-medium
                     bg-paper/8 text-paper/70 border border-paper/15 backdrop-blur-sm
                     hover:bg-paper/18 hover:text-paper/90 disabled:opacity-25 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          <ChevronLeft size={13} />
          Vorige
        </button>

        {/* Spread dots */}
        <div
          className="flex items-center gap-1.5"
          aria-label={`Spread ${spreadIndex + 1} van ${totalSpreads}`}
          aria-hidden="true"
        >
          {Array.from({ length: totalSpreads }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === spreadIndex
                  ? 'w-4 h-1.5 bg-paper/75'
                  : 'w-1.5 h-1.5 bg-paper/22'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Volgende pagina"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-xs font-medium
                     bg-paper/8 text-paper/70 border border-paper/15 backdrop-blur-sm
                     hover:bg-paper/18 hover:text-paper/90 disabled:opacity-25 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Volgende
          <ChevronRight size={13} />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Spread {spreadIndex + 1} van {totalSpreads}: {chapterTitle}
      </p>
    </div>
  )
}

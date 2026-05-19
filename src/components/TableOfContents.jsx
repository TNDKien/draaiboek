import { X, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TableOfContents({ hoofdstukken, currentSpreadId, onNavigate, onClose, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Inhoudsopgave"
            className="fixed left-0 inset-y-0 w-80 bg-paper shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-spine/30 bg-paper-dark">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-cover" />
                <h2 className="font-serif text-lg font-bold text-ink">Inhoudsopgave</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Sluit inhoudsopgave"
                className="p-1 rounded hover:bg-spine/20 transition-colors"
              >
                <X size={18} className="text-ink-light" />
              </button>
            </div>

            {/* Chapter list */}
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Hoofdstukken">
              {hoofdstukken.map((h, hi) => (
                <div key={h.id} className="mb-1">
                  <div
                    className="px-6 py-2"
                    style={{ borderLeft: `3px solid ${h.kleur}` }}
                  >
                    <p className="font-serif text-sm font-semibold text-ink">{h.titel}</p>
                  </div>

                  {h.paginaPairs.map((pair, pi) => {
                    const isActive = pair.id === currentSpreadId
                    return (
                      <button
                        key={pair.id}
                        onClick={() => { onNavigate(hi, pi); onClose() }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full text-left px-8 py-1.5 font-sans text-xs transition-colors
                          ${isActive
                            ? 'bg-cover/10 text-cover font-semibold'
                            : 'text-ink-light hover:bg-spine/10 hover:text-ink'
                          }`}
                      >
                        Spread {pi + 1}
                        {isActive && <span className="ml-2 text-cover" aria-hidden="true">◀</span>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

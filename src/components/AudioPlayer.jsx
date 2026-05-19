import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ audio }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)       // 0–100
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)       // used for demo-mode only

  const hasSrc = Boolean(audio.src)

  // Stop everything when the component unmounts or audio.src changes
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }
  }, [audio.src])

  /* ── Real audio handlers ── */
  const handleTimeUpdate = () => {
    const el = audioRef.current
    if (!el || !el.duration) return
    setCurrentTime(el.currentTime)
    setProgress((el.currentTime / el.duration) * 100)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const handleEnded = () => {
    setPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }

  /* ── Seek on progress bar click ── */
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    if (hasSrc && audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = pct * audioRef.current.duration
    } else {
      setProgress(pct * 100)
    }
  }

  /* ── Play / Pause toggle ── */
  const togglePlay = () => {
    if (!hasSrc) {
      // Demo mode — simulate progress
      if (playing) {
        clearInterval(intervalRef.current)
        setPlaying(false)
      } else {
        setPlaying(true)
        let p = progress
        intervalRef.current = setInterval(() => {
          p += 1
          setProgress(p)
          if (p >= 100) {
            clearInterval(intervalRef.current)
            setPlaying(false)
            setProgress(0)
          }
        }, 80)
      }
      return
    }

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-spine/30" role="region" aria-label="Audiospeler">
      {hasSrc && (
        <audio
          ref={audioRef}
          src={audio.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          aria-hidden="true"
          preload="metadata"
        />
      )}

      {/* Player bar */}
      <div className="flex items-center gap-3 bg-ink/8 px-4 py-3">
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pauzeer audio' : 'Speel audio af'}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-cover flex items-center justify-center text-paper
                     hover:bg-cover-light transition-colors focus-visible:outline-orange-500 shadow-md"
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
        </button>

        {/* Waveform / progress bar */}
        <div className="flex-1 flex flex-col gap-1.5" aria-hidden="true">
          {playing ? (
            <div className="flex items-center gap-0.5 h-6 w-full">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cover rounded-full wave-bar"
                  style={{
                    height: `${30 + Math.sin(i * 0.8) * 40}%`,
                    animationDelay: `${(i % 7) * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="relative h-1.5 bg-spine/30 rounded-full overflow-hidden cursor-pointer"
              onClick={handleSeek}
              role="slider"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Afspeelpositie"
            >
              <div
                className="absolute inset-y-0 left-0 bg-cover rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Time display — only when real audio */}
          {hasSrc && duration > 0 && (
            <div className="flex justify-between text-xs font-sans text-ink-light/60" style={{ fontSize: '10px' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        <Volume2 size={16} className="flex-shrink-0 text-ink-light" aria-hidden="true" />
      </div>

      {/* Label + transcript toggle */}
      <div className="px-4 py-2 bg-ink/4 flex items-center justify-between">
        <span className="text-xs font-sans text-ink-light italic">{audio.label}</span>
        {audio.transcript && (
          <button
            onClick={() => setShowTranscript((v) => !v)}
            aria-expanded={showTranscript}
            aria-controls="audio-transcript"
            className="text-xs font-sans text-cover underline hover:text-cover-light transition-colors"
          >
            {showTranscript ? 'Verberg transcript' : 'Toon transcript'}
          </button>
        )}
      </div>

      {/* Transcript */}
      {showTranscript && audio.transcript && (
        <div
          id="audio-transcript"
          className="px-4 py-3 bg-ink/4 border-t border-spine/20 text-sm font-sans text-ink-light leading-relaxed italic"
        >
          <p>{audio.transcript}</p>
        </div>
      )}
    </div>
  )
}

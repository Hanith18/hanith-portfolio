import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaPause, FaPlay } from 'react-icons/fa'

const PHOTOS = [
  { src: '/gallery_IMG_2854.jpg',  caption: 'Marshall Student Center',         label: 'USF Campus',        tag: '📍 USF Tampa' },
  { src: '/gallery_IMG_1907.jpg',  caption: 'Graduation · Indian Heritage',     label: 'Commencement 2025', tag: '🇮🇳 Proud Moment' },
  { src: '/gallery_IMG_1934.jpg',  caption: 'USF Gold & Green Stole',           label: 'Commencement 2025', tag: '🎓 USF Grad' },
  { src: '/gallery_IMG_1943.jpg',  caption: 'Home of the Bulls · Yuengling',    label: 'Graduation Day',    tag: '🐂 Go Bulls!' },
  { src: '/gallery_IMG_1948.jpg',  caption: 'USF Commencement Ceremony',        label: 'Graduation 2025',   tag: '🏟️ Yuengling Center' },
  { src: '/gallery_IMG_1963.jpg',  caption: 'Crossing the Stage · USF Seal',    label: 'B.E. Ceremony',     tag: '✨ Milestone' },
  { src: '/gallery_IMG_2290.jpg',  caption: 'With Rocky the Bull Statue',       label: 'Marshall Center',   tag: '🐂 Rocky' },
  { src: '/gallery_IMG_2292.jpg',  caption: 'Rocky the Bull · Marshall Center', label: 'Professional',      tag: '🐂 USF Spirit' },
]

function LightboxModal({ photo, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <img
          src={photo.src}
          alt={photo.caption}
          style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }}
        />
        <div style={{
          position: 'absolute', bottom: -40, left: 0, right: 0,
          textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 14,
        }}>
          {photo.caption} · {photo.tag}
        </div>
      </motion.div>

      {/* Close */}
      <button onClick={onClose} style={{
        position: 'fixed', top: 20, right: 20, background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
        width: 42, height: 42, color: 'white', cursor: 'pointer', fontSize: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FaTimes />
      </button>

      {/* Prev/Next */}
      {[
        { onClick: onPrev, icon: <FaChevronLeft />, side: { left: 20 } },
        { onClick: onNext, icon: <FaChevronRight />, side: { right: 20 } },
      ].map(({ onClick, icon, side }, i) => (
        <button
          key={i}
          onClick={e => { e.stopPropagation(); onClick() }}
          style={{
            position: 'fixed', top: '50%', transform: 'translateY(-50%)',
            ...side, background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
            width: 48, height: 48, color: 'white', cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icon}
        </button>
      ))}
    </motion.div>
  )
}

export default function Gallery() {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [playing, setPlaying] = useState(true)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  const go = useCallback((idx, dir = 1) => {
    setDirection(dir)
    setCurrent((idx + PHOTOS.length) % PHOTOS.length)
  }, [])

  const next = useCallback(() => go(current + 1, 1), [current, go])
  const prev = useCallback(() => go(current - 1, -1), [current, go])

  useEffect(() => {
    if (!playing) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(next, 4000)
    return () => clearInterval(intervalRef.current)
  }, [playing, next])

  const variants = {
    enter: dir => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: dir => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <section id="gallery" className="section-wrapper" style={{ background: 'var(--bg-2)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Moments</div>
          <h2 className="section-title">
            Life at <span className="gradient-text">USF</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Graduation, campus life &amp; memorable moments at the University of South Florida 🐂
          </p>
        </motion.div>

        {/* Main slideshow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          onMouseEnter={() => setPlaying(false)}
          onMouseLeave={() => setPlaying(true)}
          style={{ position: 'relative' }}
        >
          {/* Main frame */}
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 20,
            border: '1px solid var(--border)',
            aspectRatio: '16/9',
            background: '#000',
            boxShadow: '0 0 60px rgba(67,56,202,0.2)',
          }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={current}
                src={PHOTOS[current].src}
                alt={PHOTOS[current].caption}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                }}
              />
            </AnimatePresence>

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />

            {/* Caption */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '20px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
              <div>
                <div style={{
                  display: 'inline-block', fontSize: 11, fontFamily: 'JetBrains Mono',
                  background: 'rgba(67,56,202,0.8)', color: 'white',
                  padding: '3px 10px', borderRadius: 999, marginBottom: 6,
                }}>
                  {PHOTOS[current].tag}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  {PHOTOS[current].caption}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
                  {PHOTOS[current].label} · {current + 1} / {PHOTOS.length}
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => setPlaying(p => !p)}
                  style={{
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '50%', width: 36, height: 36, color: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {playing ? <FaPause size={12} /> : <FaPlay size={12} />}
                </button>
                <button
                  onClick={() => setLightbox(current)}
                  style={{
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '50%', width: 36, height: 36, color: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FaExpand size={13} />
                </button>
              </div>
            </div>

            {/* Prev/Next arrows */}
            {[
              { fn: prev, icon: <FaChevronLeft />, pos: { left: 16 } },
              { fn: next, icon: <FaChevronRight />, pos: { right: 16 } },
            ].map(({ fn, icon, pos }, i) => (
              <button
                key={i}
                onClick={fn}
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  ...pos, background: 'rgba(0,0,0,0.45)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
                  width: 44, height: 44, color: 'white', cursor: 'pointer', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(6px)', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(67,56,202,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
              >
                {icon}
              </button>
            ))}

            {/* Progress bar */}
            {playing && (
              <motion.div
                key={current}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, height: 3,
                  background: 'linear-gradient(to right, var(--purple), var(--cyan))',
                }}
              />
            )}
          </div>

          {/* Thumbnail strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PHOTOS.length}, 1fr)`,
            gap: 8,
            marginTop: 12,
          }}>
            {PHOTOS.map((photo, i) => (
              <motion.div
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                whileHover={{ scale: 1.05 }}
                style={{
                  aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden',
                  cursor: 'pointer',
                  border: i === current
                    ? '2px solid var(--cyan)'
                    : '2px solid transparent',
                  opacity: i === current ? 1 : 0.5,
                  transition: 'opacity 0.3s, border-color 0.3s',
                  boxShadow: i === current ? 'var(--glow-cyan)' : 'none',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                />
              </motion.div>
            ))}
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                style={{
                  width: i === current ? 24 : 8, height: 8, borderRadius: 999,
                  background: i === current
                    ? 'linear-gradient(to right, var(--purple), var(--cyan))'
                    : 'rgba(255,255,255,0.2)',
                  border: 'none', cursor: 'pointer',
                  transition: 'width 0.3s, background 0.3s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <LightboxModal
            photo={PHOTOS[lightbox]}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(l => (l - 1 + PHOTOS.length) % PHOTOS.length)}
            onNext={() => setLightbox(l => (l + 1) % PHOTOS.length)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

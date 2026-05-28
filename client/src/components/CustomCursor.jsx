import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

/* ─── Trail particle pool ────────────────────────────────── */
function useTrail(mx, my) {
  const canvasRef = useRef(null)
  const trailRef  = useRef([])
  const animRef   = useRef(null)
  const posRef    = useRef({ x: -999, y: -999 })

  useEffect(() => {
    // sync raw mouse pos to ref so canvas loop can read it
    const unsub1 = mx.on('change', v => { posRef.current.x = v })
    const unsub2 = my.on('change', v => { posRef.current.y = v })
    return () => { unsub1(); unsub2() }
  }, [mx, my])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // spawn new particle at current mouse
      const { x, y } = posRef.current
      if (x > 0 && y > 0) {
        trailRef.current.push({
          x, y,
          life: 1,
          r: Math.random() * 3 + 1.5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          color: Math.random() > 0.55 ? '#00c882' : '#f0c040',
        })
      }

      // cap trail length
      if (trailRef.current.length > 40) trailRef.current.shift()

      // draw & age
      trailRef.current = trailRef.current.filter(p => {
        p.life -= 0.055
        p.x += p.vx
        p.y += p.vy
        if (p.life <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life * 0.6
        ctx.fill()
        ctx.globalAlpha = 1
        return true
      })

      animId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return canvasRef
}

/* ─── Click burst ─────────────────────────────────────────── */
function Burst({ x, y, onDone }) {
  const count = 10
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const dist  = 28 + Math.random() * 18
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      color: Math.random() > 0.5 ? '#00c882' : '#f0c040',
      r: Math.random() * 3 + 2,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      onAnimationComplete={onDone}
      style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 99997 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.dx, y: p.dy, scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.012 }}
          style={{
            position: 'absolute',
            width: p.r * 2, height: p.r * 2,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            transform: 'translate(-50%,-50%)',
          }}
        />
      ))}
    </motion.div>
  )
}

/* ─── Main cursor ─────────────────────────────────────────── */
export default function CustomCursor() {
  const [state, setState]     = useState('idle')  // idle | hover | click
  const [visible, setVisible] = useState(false)
  const [isTouch, setTouch]   = useState(false)
  const [bursts, setBursts]   = useState([])       // [{id,x,y}]
  const rotateRef = useRef(0)
  const rafRef    = useRef(null)

  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)

  // Dot: near-instant
  const dotX = useSpring(mx, { stiffness: 2200, damping: 60 })
  const dotY = useSpring(my, { stiffness: 2200, damping: 60 })

  // Ring: medium lag
  const ringX = useSpring(mx, { stiffness: 280, damping: 26 })
  const ringY = useSpring(my, { stiffness: 280, damping: 26 })

  // Halo: heavy lag = trailing glow blob
  const haloX = useSpring(mx, { stiffness: 80, damping: 18 })
  const haloY = useSpring(my, { stiffness: 80, damping: 18 })

  const trailCanvas = useTrail(mx, my)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) { setTouch(true); return }

    // hide system cursor
    const style = document.createElement('style')
    style.id = 'cursor-none'
    style.textContent = '* { cursor: none !important; }'
    document.head.appendChild(style)

    const onMove = e => { mx.set(e.clientX); my.set(e.clientY); setVisible(true) }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown  = e => {
      setState('click')
      setBursts(b => [...b, { id: Date.now(), x: e.clientX, y: e.clientY }])
    }
    const onUp = () => setState(s => s === 'click' ? 'idle' : s)
    const onOver = e => {
      if (e.target?.closest('a,button,[role="button"],input,textarea,select,label,.glass-card')) {
        setState(s => s !== 'click' ? 'hover' : s)
      } else {
        setState(s => s !== 'click' ? 'idle' : s)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      document.getElementById('cursor-none')?.remove()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  if (isTouch) return null

  const isHover = state === 'hover'
  const isClick = state === 'click'

  const accentColor  = isHover ? '#f0c040' : '#00c882'
  const accentGlow   = isHover ? 'rgba(240,192,64,0.8)'  : 'rgba(0,200,130,0.8)'
  const ringSize     = isClick ? 18 : isHover ? 54 : 32
  const dotSize      = isClick ? 2  : isHover ? 4  : 5
  const haloSize     = isHover ? 120 : 80
  const ringOpacity  = visible ? (isHover ? 1 : 0.55) : 0
  const dotOpacity   = visible ? 1 : 0
  const haloOpacity  = visible ? (isHover ? 0.14 : 0.07) : 0
  const ringBorder   = isHover ? `2px solid ${accentColor}` : `1.5px dashed ${accentColor}`
  const ringRotation = isHover ? 0 : undefined  // spin when idle/click

  return (
    <>
      {/* ── Canvas trail ── */}
      <canvas
        ref={trailCanvas}
        className="no-theme-transition"
        style={{
          position: 'fixed', inset: 0, zIndex: 99994,
          pointerEvents: 'none', userSelect: 'none',
          opacity: visible ? 1 : 0, transition: 'opacity 0.2s',
        }}
      />

      {/* ── Outer halo blob ── */}
      <motion.div
        className="no-theme-transition"
        style={{
          position: 'fixed', zIndex: 99995,
          left: haloX, top: haloY,
          x: '-50%', y: '-50%',
          width: haloSize, height: haloSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          filter: 'blur(22px)',
          opacity: haloOpacity,
          pointerEvents: 'none',
          transition: 'width 0.4s ease, height 0.4s ease, opacity 0.25s ease, background 0.25s ease',
        }}
      />

      {/* ── Spinning / solid ring ── */}
      <motion.div
        className="no-theme-transition"
        animate={{
          rotate: isHover ? 0 : 360,
          scale: isClick ? 0.6 : 1,
        }}
        transition={
          isHover
            ? { duration: 0.25, ease: 'easeOut' }
            : isClick
              ? { duration: 0.12, ease: 'easeOut' }
              : { rotate: { duration: 2.8, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.15 } }
        }
        style={{
          position: 'fixed', zIndex: 99996,
          left: ringX, top: ringY,
          x: '-50%', y: '-50%',
          width: ringSize, height: ringSize,
          borderRadius: '50%',
          border: ringBorder,
          boxShadow: isHover ? `0 0 16px ${accentColor}60` : 'none',
          opacity: ringOpacity,
          pointerEvents: 'none',
          transition: 'width 0.22s cubic-bezier(.22,1,.36,1), height 0.22s cubic-bezier(.22,1,.36,1), border 0.2s ease, opacity 0.15s ease, box-shadow 0.2s ease',
        }}
      />

      {/* ── Crosshair arms (hover only) ── */}
      <AnimatePresence>
        {isHover && visible && (
          <motion.div
            className="no-theme-transition"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', zIndex: 99996,
              left: ringX, top: ringY,
              x: '-50%', y: '-50%',
              width: 54, height: 54,
              pointerEvents: 'none',
            }}
          >
            {/* horizontal arm */}
            <div style={{ position: 'absolute', top: '50%', left: -10, right: -10, height: 1, background: `${accentColor}60`, transform: 'translateY(-50%)' }} />
            {/* vertical arm */}
            <div style={{ position: 'absolute', left: '50%', top: -10, bottom: -10, width: 1, background: `${accentColor}60`, transform: 'translateX(-50%)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Center dot ── */}
      <motion.div
        className="no-theme-transition"
        animate={{ scale: isClick ? 0.3 : 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        style={{
          position: 'fixed', zIndex: 99999,
          left: dotX, top: dotY,
          x: '-50%', y: '-50%',
          width: dotSize, height: dotSize,
          borderRadius: '50%',
          background: accentColor,
          boxShadow: `0 0 ${isHover ? 14 : 8}px ${accentGlow}, 0 0 ${isHover ? 28 : 16}px ${accentGlow.replace('0.8', '0.3')}`,
          opacity: dotOpacity,
          pointerEvents: 'none',
          transition: 'width 0.12s ease, height 0.12s ease, background 0.18s ease, box-shadow 0.18s ease, opacity 0.1s ease',
        }}
      />

      {/* ── Click burst particles ── */}
      <AnimatePresence>
        {bursts.map(b => (
          <Burst
            key={b.id}
            x={b.x}
            y={b.y}
            onDone={() => setBursts(bs => bs.filter(p => p.id !== b.id))}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [hovering, setHovering]   = useState(false)
  const [clicking, setClicking]   = useState(false)
  const [visible,  setVisible]    = useState(false)
  const [isTouchDevice, setTouch] = useState(false)

  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // dot follows instantly
  const dotX = useSpring(mx, { stiffness: 1400, damping: 50 })
  const dotY = useSpring(my, { stiffness: 1400, damping: 50 })

  // ring trails with lag
  const ringX = useSpring(mx, { stiffness: 140, damping: 18 })
  const ringY = useSpring(my, { stiffness: 140, damping: 18 })

  useEffect(() => {
    // skip on touch devices
    if (window.matchMedia('(hover: none)').matches) { setTouch(true); return }

    // hide native cursor
    const style = document.createElement('style')
    style.id = 'cursor-none'
    style.textContent = `* { cursor: none !important; }`
    document.head.appendChild(style)

    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      setVisible(true)
    }

    const onOver = (e) => {
      const el = e.target?.closest('a, button, [role="button"], input, textarea, select, label, .glass-card, canvas')
      setHovering(!!el)
    }

    const onDown = () => setClicking(true)
    const onUp   = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

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

  if (isTouchDevice) return null

  const ringSize = clicking ? 20 : hovering ? 52 : 36
  const dotSize  = clicking ? 3 : hovering ? 4 : 6
  const dotColor = hovering ? '#B8922A' : '#22c55e'
  const dotGlow  = hovering ? 'rgba(184,146,42,0.9)' : 'rgba(34,197,94,0.85)'
  const ringOpacity = visible ? (hovering ? 0.85 : 0.45) : 0
  const dotOpacity  = visible ? 1 : 0

  return (
    <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
      {/* Trailing glow ring */}
      <motion.div
        style={{
          position: 'fixed', zIndex: 99998,
          left: ringX, top: ringY,
          x: '-50%', y: '-50%',
          width: ringSize, height: ringSize,
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#B8922A' : 'rgba(34,197,94,0.85)'}`,
          background: `radial-gradient(circle, ${hovering ? 'rgba(184,146,42,0.1)' : 'rgba(34,197,94,0.06)'} 0%, transparent 70%)`,
          opacity: ringOpacity,
          pointerEvents: 'none',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, opacity 0.15s ease',
        }}
      />

      {/* Precise center dot */}
      <motion.div
        style={{
          position: 'fixed', zIndex: 99999,
          left: dotX, top: dotY,
          x: '-50%', y: '-50%',
          width: dotSize, height: dotSize,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: `0 0 ${hovering ? 12 : 7}px ${dotGlow}`,
          opacity: dotOpacity,
          pointerEvents: 'none',
          transition: 'width 0.12s ease, height 0.12s ease, background 0.15s ease, box-shadow 0.15s ease, opacity 0.1s ease',
        }}
      />
    </div>
  )
}

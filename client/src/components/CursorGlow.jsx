import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springX = useSpring(cursorX, { stiffness: 180, damping: 22 })
  const springY = useSpring(cursorY, { stiffness: 180, damping: 22 })

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    setMounted(true)

    const onMove = e => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const onOver = e => {
      setHovering(!!e.target.closest('a, button, [role="button"], input, textarea, select, label'))
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [cursorX, cursorY])

  if (!mounted) return null

  const outerSize = clicking ? 20 : hovering ? 44 : 32
  const offset = outerSize / 2

  return (
    <>
      {/* Outer spring ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: -offset,
          left: -offset,
          width: outerSize,
          height: outerSize,
          borderRadius: '50%',
          border: hovering ? '2px solid var(--cyan)' : '1.5px solid rgba(167,139,250,0.55)',
          pointerEvents: 'none',
          zIndex: 99998,
          x: springX,
          y: springY,
          boxShadow: hovering ? '0 0 14px rgba(217,119,6,0.45)' : 'none',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, top 0.2s, left 0.2s, box-shadow 0.2s',
        }}
      />
      {/* Inner dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: hovering ? 'var(--cyan)' : 'var(--purple-light)',
          pointerEvents: 'none',
          zIndex: 99999,
          x: cursorX,
          y: cursorY,
          scale: clicking ? 0.5 : 1,
          boxShadow: hovering ? '0 0 10px var(--cyan)' : '0 0 8px var(--purple)',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      />
    </>
  )
}

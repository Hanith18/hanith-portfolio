import { useEffect, useRef } from 'react'

const COLORS = ['#006747', '#008a5e', '#B8922A', '#CFC493', '#00a86b']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function createParticle(canvasW, canvasH, fromTop = false) {
  return {
    x: randomBetween(0, canvasW),
    y: fromTop ? randomBetween(-120, 0) : randomBetween(0, canvasH),
    char: Math.random() > 0.5 ? '1' : '0',
    size: randomBetween(10, 22),
    speed: randomBetween(0.18, 0.72),
    opacity: randomBetween(0.04, 0.18),
    drift: randomBetween(-0.12, 0.12),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    flickerRate: randomBetween(0.004, 0.018),
    flickerDir: 1,
    // occasionally flip the digit
    flipCountdown: Math.floor(randomBetween(80, 400)),
  }
}

export default function BinaryBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const PARTICLE_COUNT = 110

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(dpr, dpr)
      // Rebuild particles to fit new canvas
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(window.innerWidth, window.innerHeight)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let p of particles) {
        // Flicker opacity
        p.opacity += p.flickerRate * p.flickerDir
        if (p.opacity >= 0.18 || p.opacity <= 0.03) p.flickerDir *= -1

        // Draw digit
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.font = `${p.size}px 'JetBrains Mono', 'Courier New', monospace`
        ctx.fillText(p.char, p.x, p.y)
        ctx.restore()

        // Move
        p.y -= p.speed
        p.x += p.drift

        // Occasionally flip 0 ↔ 1
        p.flipCountdown--
        if (p.flipCountdown <= 0) {
          p.char = p.char === '0' ? '1' : '0'
          p.flipCountdown = Math.floor(randomBetween(80, 400))
        }

        // Reset when out of view
        if (p.y < -30 || p.x < -30 || p.x > window.innerWidth + 30) {
          const reset = createParticle(window.innerWidth, window.innerHeight, true)
          Object.assign(p, reset)
          p.y = window.innerHeight + 20
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

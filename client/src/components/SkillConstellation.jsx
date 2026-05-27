import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

/* ─── Data ──────────────────────────────────────────────── */
const CLUSTER_META = {
  sre:       { label: 'SRE Core',      color: '#22c55e' },
  container: { label: 'Containers',    color: '#38bdf8' },
  cloud:     { label: 'Cloud / AWS',   color: '#B8922A' },
  cicd:      { label: 'CI / CD',       color: '#e879f9' },
  ml:        { label: 'ML / AI',       color: '#a78bfa' },
  lang:      { label: 'Languages',     color: '#fb923c' },
}

// bx/by = base position as fraction of canvas (0–1)
// speed = float drift speed, phase = starting phase offset, r = radius
const SKILLS = [
  // SRE Core
  { id: 'prometheus',    label: 'Prometheus',     cluster: 'sre',       bx:0.17, by:0.36, speed:0.40, phase:0.0,  r:10 },
  { id: 'grafana',       label: 'Grafana',        cluster: 'sre',       bx:0.09, by:0.52, speed:0.35, phase:1.2,  r:9  },
  { id: 'slo',           label: 'SLO / SLI',      cluster: 'sre',       bx:0.06, by:0.30, speed:0.45, phase:2.4,  r:9  },
  { id: 'errbudget',     label: 'Error Budget',   cluster: 'sre',       bx:0.04, by:0.62, speed:0.38, phase:3.6,  r:8  },
  { id: 'pagerduty',     label: 'PagerDuty',      cluster: 'sre',       bx:0.14, by:0.74, speed:0.42, phase:4.8,  r:8  },
  { id: 'incident',      label: 'Incident Mgmt',  cluster: 'sre',       bx:0.24, by:0.62, speed:0.36, phase:0.8,  r:8  },
  // Containers
  { id: 'kubernetes',    label: 'Kubernetes',     cluster: 'container', bx:0.42, by:0.24, speed:0.50, phase:1.5,  r:13 },
  { id: 'docker',        label: 'Docker',         cluster: 'container', bx:0.38, by:0.52, speed:0.44, phase:2.7,  r:10 },
  { id: 'helm',          label: 'Helm',           cluster: 'container', bx:0.50, by:0.44, speed:0.40, phase:0.3,  r:8  },
  { id: 'argocd',        label: 'ArgoCD',         cluster: 'container', bx:0.47, by:0.66, speed:0.37, phase:3.1,  r:8  },
  // Cloud
  { id: 'aws',           label: 'AWS',            cluster: 'cloud',     bx:0.86, by:0.22, speed:0.45, phase:0.9,  r:13 },
  { id: 'eks',           label: 'AWS EKS',        cluster: 'cloud',     bx:0.72, by:0.30, speed:0.40, phase:2.1,  r:10 },
  { id: 'terraform',     label: 'Terraform',      cluster: 'cloud',     bx:0.80, by:0.48, speed:0.42, phase:1.8,  r:10 },
  { id: 'cloudwatch',    label: 'CloudWatch',     cluster: 'cloud',     bx:0.76, by:0.66, speed:0.38, phase:4.2,  r:8  },
  // CI/CD
  { id: 'gha',           label: 'GitHub Actions', cluster: 'cicd',      bx:0.60, by:0.11, speed:0.46, phase:3.5,  r:10 },
  { id: 'linux',         label: 'Linux',          cluster: 'cicd',      bx:0.42, by:0.09, speed:0.41, phase:1.1,  r:10 },
  { id: 'bash',          label: 'Bash / Shell',   cluster: 'cicd',      bx:0.28, by:0.15, speed:0.38, phase:2.9,  r:8  },
  // ML / AI
  { id: 'python',        label: 'Python',         cluster: 'ml',        bx:0.22, by:0.82, speed:0.43, phase:0.5,  r:11 },
  { id: 'tensorflow',    label: 'TensorFlow',     cluster: 'ml',        bx:0.37, by:0.88, speed:0.38, phase:1.7,  r:9  },
  { id: 'sklearn',       label: 'Scikit-learn',   cluster: 'ml',        bx:0.11, by:0.88, speed:0.40, phase:3.3,  r:8  },
  // Languages
  { id: 'react',         label: 'React',          cluster: 'lang',      bx:0.66, by:0.80, speed:0.37, phase:4.1,  r:9  },
  { id: 'typescript',    label: 'TypeScript',     cluster: 'lang',      bx:0.78, by:0.82, speed:0.42, phase:0.7,  r:8  },
  { id: 'go',            label: 'Go',             cluster: 'lang',      bx:0.88, by:0.70, speed:0.45, phase:2.3,  r:9  },
]

const CONNECTIONS = [
  ['prometheus','grafana'],   ['prometheus','slo'],    ['slo','errbudget'],
  ['errbudget','pagerduty'],  ['pagerduty','incident'],['incident','prometheus'],
  ['kubernetes','helm'],      ['kubernetes','argocd'], ['kubernetes','docker'],
  ['kubernetes','eks'],       ['eks','terraform'],     ['eks','aws'],
  ['eks','cloudwatch'],       ['cloudwatch','grafana'],['terraform','gha'],
  ['gha','argocd'],           ['prometheus','kubernetes'],
  ['linux','kubernetes'],     ['linux','bash'],        ['linux','docker'],
  ['python','tensorflow'],    ['python','sklearn'],    ['python','prometheus'],
  ['react','typescript'],     ['go','kubernetes'],
  ['gha','eks'],              ['argocd','eks'],        ['docker','python'],
]

/* ─── Canvas renderer ───────────────────────────────────── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

export default function SkillConstellation() {
  const wrapRef   = useRef(null)
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const hovRef    = useRef(null)
  const startRef  = useRef(null)

  const { ref: sectionRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [hoveredCluster, setHoveredCluster] = useState(null)
  const [started, setStarted] = useState(false)

  // Build index maps once
  const skillIndex = Object.fromEntries(SKILLS.map((s, i) => [s.id, i]))
  // adjacency list per node
  const adjList = Object.fromEntries(SKILLS.map(s => [s.id, []]))
  CONNECTIONS.forEach(([a, b]) => { adjList[a].push(b); adjList[b].push(a) })

  useEffect(() => {
    if (!inView) return
    setStarted(true)
  }, [inView])

  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    const dpr = window.devicePixelRatio || 1

    function resize() {
      const W = wrap.offsetWidth
      const H = wrap.offsetHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    function draw(ts) {
      if (!startRef.current) startRef.current = ts
      const t = (ts - startRef.current) / 1000

      const ctx = canvas.getContext('2d')
      const W = canvas.width  / dpr
      const H = canvas.height / dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // ── compute floating positions ──
      const pos = SKILLS.map(s => ({
        x: s.bx * W + Math.sin(t * s.speed + s.phase) * 9,
        y: s.by * H + Math.cos(t * s.speed + s.phase * 1.3) * 7,
      }))

      const hov = hovRef.current
      const connectedToHov = hov ? new Set([hov, ...adjList[hov]]) : null

      // ── connections ──
      CONNECTIONS.forEach(([aId, bId]) => {
        const ai = skillIndex[aId], bi = skillIndex[bId]
        const pa = pos[ai], pb = pos[bi]
        const aColor = CLUSTER_META[SKILLS[ai].cluster].color
        const bColor = CLUSTER_META[SKILLS[bi].cluster].color

        let alpha = 0.18
        if (hov) {
          alpha = (connectedToHov.has(aId) && connectedToHov.has(bId)) ? 0.75 : 0.04
        }

        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y)
        grad.addColorStop(0, `rgba(${hexToRgb(aColor)},${alpha})`)
        grad.addColorStop(1, `rgba(${hexToRgb(bColor)},${alpha})`)

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = hov && connectedToHov.has(aId) && connectedToHov.has(bId) ? 1.5 : 0.8
        ctx.stroke()
      })

      // ── nodes ──
      SKILLS.forEach((s, i) => {
        const { x, y } = pos[i]
        const color  = CLUSTER_META[s.cluster].color
        const rgb    = hexToRgb(color)
        const isHov  = hov === s.id
        const isFade = hov && !connectedToHov.has(s.id)
        const nodeR  = isHov ? s.r + 4 : s.r

        // outer glow
        const glowSize = isHov ? nodeR * 3.5 : nodeR * 2
        const glowAlpha = isFade ? 0.03 : isHov ? 0.55 : 0.2
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
        glow.addColorStop(0, `rgba(${rgb},${glowAlpha})`)
        glow.addColorStop(1, `rgba(${rgb},0)`)
        ctx.beginPath()
        ctx.arc(x, y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // circle
        ctx.beginPath()
        ctx.arc(x, y, nodeR, 0, Math.PI * 2)
        const nodeAlpha = isFade ? 0.15 : 1
        ctx.fillStyle = `rgba(${rgb},${isHov ? 0.25 : 0.12})`
        ctx.strokeStyle = `rgba(${rgb},${nodeAlpha})`
        ctx.lineWidth = isHov ? 2 : 1.2
        ctx.fill()
        ctx.stroke()

        // label
        const labelAlpha = isFade ? 0.2 : isHov ? 1 : 0.75
        ctx.font = `${isHov ? 700 : 500} ${isHov ? 11 : 10}px "JetBrains Mono", monospace`
        ctx.fillStyle = `rgba(${rgb},${labelAlpha})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText(s.label, x, y + nodeR + 5)
      })

      // ── hover hit test ──
      const mx = mouseRef.current.x, my = mouseRef.current.y
      let found = null
      for (let i = 0; i < SKILLS.length; i++) {
        const { x, y } = pos[i]
        const dist = Math.hypot(mx - x, my - y)
        if (dist < SKILLS[i].r + 10) { found = SKILLS[i].id; break }
      }
      if (found !== hovRef.current) {
        hovRef.current = found
        setHoveredCluster(found ? SKILLS[skillIndex[found]].cluster : null)
        canvas.style.cursor = found ? 'pointer' : 'default'
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [started])

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  function onMouseLeave() {
    mouseRef.current = { x: -9999, y: -9999 }
  }

  return (
    <section id="skills-constellation" className="section-wrapper"
      style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* subtle dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.045,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Skill Map</div>
          <h2 className="section-title">
            Tech <span className="gradient-text">Constellation</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            Hover any node to explore connections. Every line is a real-world skill relationship.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 }}
        >
          {Object.entries(CLUSTER_META).map(([key, { label, color }]) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20,
              background: hoveredCluster === key ? `${color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${hoveredCluster === key ? color : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.25s',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: hoveredCluster === key ? `0 0 8px ${color}` : 'none', transition: 'all 0.25s' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: hoveredCluster === key ? color : 'var(--text-muted)', transition: 'color 0.25s' }}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Canvas */}
        <motion.div
          ref={wrapRef}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            width: '100%', height: 480,
            borderRadius: 16,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.02)',
            overflow: 'hidden',
            position: 'relative',
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

          {/* Corner label */}
          <div style={{
            position: 'absolute', bottom: 12, right: 16,
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
            pointerEvents: 'none',
          }}>
            {SKILLS.length} SKILLS · {CONNECTIONS.length} CONNECTIONS
          </div>
        </motion.div>

      </div>
    </section>
  )
}

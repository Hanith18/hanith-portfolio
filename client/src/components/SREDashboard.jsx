import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

/* ─── Sparkline SVG ─────────────────────────────────────── */
function Sparkline({ data, color, width = 110, height = 36 }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - 4 - ((v - min) / range) * (height - 8)
    return [x, y]
  })
  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const [lx, ly] = pts[pts.length - 1]

  // area fill path
  const area = `M${pts[0][0]},${height} ` +
    pts.map(([x, y]) => `L${x},${y}`).join(' ') +
    ` L${pts[pts.length - 1][0]},${height} Z`

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={3} fill={color} />
      <circle cx={lx} cy={ly} r={6} fill={color} opacity="0.25">
        <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/* ─── Animated counter ──────────────────────────────────── */
function AnimCount({ target, decimals = 0, duration = 1400 }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })
  useEffect(() => {
    if (!inView) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(+(target * eased).toFixed(decimals))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, decimals, duration])
  return <span ref={ref}>{val.toFixed(decimals)}</span>
}

/* ─── Config ─────────────────────────────────────────────── */
const BASE_METRICS = [
  {
    id: 'uptime',
    label: 'Uptime',
    base: 99.97, unit: '%', decimals: 2,
    slo: 99.9, variance: 0.02,
    delta: '+0.07% above SLO',
    color: '#22c55e',
    sparkBase: [99.94, 99.98, 99.96, 99.99, 99.95, 99.98, 99.97],
    status: 'nominal',
    icon: '▲',
  },
  {
    id: 'latency',
    label: 'P99 Latency',
    base: 187, unit: 'ms', decimals: 0,
    slo: 200, variance: 6,
    delta: '−13ms vs SLO',
    color: '#B8922A',
    sparkBase: [195, 182, 190, 178, 192, 185, 187],
    status: 'nominal',
    icon: '▼',
  },
  {
    id: 'errors',
    label: 'Error Rate',
    base: 0.03, unit: '%', decimals: 2,
    slo: 0.10, variance: 0.01,
    delta: '70% of budget left',
    color: '#22c55e',
    sparkBase: [0.05, 0.02, 0.04, 0.01, 0.03, 0.02, 0.03],
    status: 'nominal',
    icon: '▼',
  },
  {
    id: 'rps',
    label: 'Requests/s',
    base: 2400, unit: 'rps', decimals: 0,
    slo: null, variance: 120,
    delta: 'Peak: 3.1k/s today',
    color: '#B8922A',
    sparkBase: [2100, 2300, 2500, 2200, 2400, 2600, 2400],
    status: 'nominal',
    icon: '~',
  },
]

const SLOS = [
  { name: 'Availability', target: '99.9% / 30d', budget: 87, color: '#22c55e' },
  { name: 'Latency P99', target: '< 200 ms',    budget: 72, color: '#B8922A' },
  { name: 'Error Rate',   target: '< 0.10%',    budget: 94, color: '#22c55e' },
]

const INCIDENTS = [
  { id: 'INC-042', sev: 'P2', title: 'DB connection pool exhaustion',  mttr: '18 min', date: 'Nov 12' },
  { id: 'INC-039', sev: 'P3', title: 'Memory pressure on pod replica', mttr: '7 min',  date: 'Oct 28' },
  { id: 'INC-031', sev: 'P2', title: 'Elevated p99 latency spike',     mttr: '24 min', date: 'Sep 15' },
]

const SEV_COLOR = { P1: '#ef4444', P2: '#f97316', P3: '#B8922A', P4: '#22c55e' }

/* ─── Main component ─────────────────────────────────────── */
export default function SREDashboard() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 })
  const [live, setLive] = useState(BASE_METRICS.map(m => ({ ...m, current: m.base, spark: [...m.sparkBase] })))
  const [tick, setTick] = useState(0)
  const [alertFlash, setAlertFlash] = useState(false)

  // Simulate live jitter
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => {
      setLive(prev => prev.map(m => {
        const jitter = (Math.random() - 0.5) * m.variance
        const next = +(m.base + jitter).toFixed(m.decimals)
        const newSpark = [...m.spark.slice(1), next]
        return { ...m, current: next, spark: newSpark }
      }))
      setTick(t => t + 1)
    }, 2200)
    return () => clearInterval(id)
  }, [inView])

  return (
    <section id="sre-dashboard" className="section-wrapper"
      style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* subtle grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block',
              boxShadow: '0 0 8px #22c55e',
              animation: 'pulseGlow 1.8s ease-in-out infinite',
            }} />
            Live Observability
          </div>
          <h2 className="section-title">
            SRE <span className="gradient-text">Metrics Dashboard</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
            Real-world SRE monitoring — SLOs, error budgets, and incident tracking the way production teams operate.
          </p>
        </motion.div>

        {/* ── Status bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 10,
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 10, padding: '10px 20px', marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#22c55e', fontWeight: 700 }}>
              ALL SYSTEMS NOMINAL
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['AWS EKS', 'Prometheus', 'Grafana', 'PagerDuty'].map(svc => (
              <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{svc}</span>
              </div>
            ))}
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
            Updated {tick}s ago
          </span>
        </motion.div>

        {/* ── 4 Metric Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
          {live.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="glass-card"
              style={{
                padding: '20px 22px',
                borderTop: `2px solid ${m.color}`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* bg glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                background: `radial-gradient(circle, ${m.color}18, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, fontFamily: 'JetBrains Mono', color: m.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {inView
                      ? (m.id === 'rps'
                          ? (m.current / 1000).toFixed(1) + 'k'
                          : m.current.toFixed(m.decimals))
                      : '—'
                    }
                    <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>{m.id === 'rps' ? '/s' : m.unit}</span>
                  </div>
                </div>
                <Sparkline data={m.spark} color={m.color} />
              </div>

              {/* SLO indicator */}
              {m.slo && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SLO Target</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: m.color }}>{m.id === 'uptime' ? `${m.slo}%` : m.id === 'latency' ? `${m.slo}ms` : `${m.slo}%`}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: 'var(--bg-2)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: m.id === 'errors' ? '70%' : m.id === 'uptime' ? '87%' : '72%' } : {}}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      style={{ height: '100%', background: m.color, borderRadius: 2 }}
                    />
                  </div>
                </div>
              )}

              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)' }}>
                <span style={{ color: m.color, marginRight: 4 }}>✓</span>{m.delta}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Row 2: SLO Panel + Incident Log ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>

          {/* SLO Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card"
            style={{ padding: '22px 24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 15 }}>📊</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Error Budget Status</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 4, padding: '2px 7px' }}>
                30-DAY WINDOW
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {SLOS.map((slo, i) => (
                <div key={slo.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{slo.name}</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', marginLeft: 8 }}>{slo.target}</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: slo.color }}>
                      {slo.budget}% left
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-2)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${slo.budget}%` } : {}}
                      transition={{ duration: 1.1, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: '100%', borderRadius: 3,
                        background: slo.budget > 50
                          ? `linear-gradient(to right, ${slo.color}80, ${slo.color})`
                          : `linear-gradient(to right, #ef4444, #f97316)`,
                        boxShadow: `0 0 6px ${slo.color}50`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Burn rate note */}
            <div style={{
              marginTop: 20, padding: '10px 14px',
              background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
            }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>Burn rate: 0.31×</span>
              &nbsp;— at this rate, &gt;95% budget survives the window. Zero PagerDuty escalations this month.
            </div>
          </motion.div>

          {/* Incident Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="glass-card"
            style={{ padding: '22px 24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 15 }}>🔔</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Incident Log</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#B8922A', background: 'rgba(184,146,42,0.1)', border: '1px solid rgba(184,146,42,0.25)', borderRadius: 4, padding: '2px 7px' }}>
                BLAMELESS
              </span>
            </div>

            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 58px 46px',
              gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)',
              fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              <span>ID</span><span>Description</span><span>MTTR</span><span>Date</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {INCIDENTS.map((inc, i) => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '60px 1fr 58px 46px',
                    gap: 8, padding: '11px 0',
                    borderBottom: i < INCIDENTS.length - 1 ? '1px solid var(--border)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)' }}>{inc.id}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700,
                      color: SEV_COLOR[inc.sev],
                      background: `${SEV_COLOR[inc.sev]}18`,
                      border: `1px solid ${SEV_COLOR[inc.sev]}40`,
                      borderRadius: 3, padding: '1px 5px', width: 'fit-content',
                    }}>{inc.sev}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{inc.title}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#22c55e', fontWeight: 600 }}>{inc.mttr}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)' }}>{inc.date}</span>
                </motion.div>
              ))}
            </div>

            {/* MTTR summary */}
            <div style={{
              marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap',
              padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 8,
            }}>
              {[
                { label: 'Avg MTTR', value: '16 min' },
                { label: 'Open', value: '0' },
                { label: 'This Month', value: '0' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 800, color: '#22c55e' }}>{s.value}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Latency Histogram bar chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="glass-card"
          style={{ padding: '22px 28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>📈</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Latency Distribution (last 24h)</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: 'p50', value: '94ms', color: '#22c55e' },
                { label: 'p95', value: '162ms', color: '#B8922A' },
                { label: 'p99', value: '187ms', color: '#B8922A' },
                { label: 'SLO', value: '200ms', color: 'rgba(255,255,255,0.3)' },
              ].map(p => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 2, borderRadius: 1, background: p.color, display: 'inline-block' }} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: p.color }}>{p.label}: {p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
            {[
              [0, '<50ms',  4],   [1, '50-75',  11],  [2, '75-100', 28],
              [3, '100-125', 22], [4, '125-150', 14], [5, '150-175', 9],
              [6, '175-200', 6],  [7, '>200ms', 2],   // SLO breach bucket
            ].map(([i, label, pct]) => {
              const isBreach = i === 7
              const color = isBreach ? '#ef4444' : i <= 2 ? '#22c55e' : '#B8922A'
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${pct * 2.5}px` } : {}}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: '100%', borderRadius: '3px 3px 0 0',
                      background: `${color}${isBreach ? 'cc' : '99'}`,
                      border: `1px solid ${color}60`,
                      boxShadow: inView ? `0 0 6px ${color}30` : 'none',
                      minHeight: 2,
                      position: 'relative',
                    }}
                  >
                    {pct >= 6 && (
                      <div style={{
                        position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                        fontFamily: 'JetBrains Mono', fontSize: 9, color, whiteSpace: 'nowrap',
                      }}>{pct}%</div>
                    )}
                  </motion.div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* SLO line marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)', borderTop: '1px dashed rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
              98% of requests under SLO threshold · 2% exceed 200ms
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)', borderTop: '1px dashed rgba(255,255,255,0.2)' }} />
          </div>
        </motion.div>

      </div>
    </section>
  )
}

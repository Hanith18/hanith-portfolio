import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const CURVE = 'M 90,250 C 220,250 330,165 480,165 C 630,165 740,80 870,80'

const JOBS = [
  {
    id: 0,
    role: 'Software Developer',
    company: 'Internbug Technologies',
    period: 'Jan 2023 – Jul 2023',
    icon: '💻',
    color: '#B8922A',
    cx: 90, cy: 250,
    labelSide: 'below',
    brief: 'Built and deployed full-stack web applications and REST APIs, improving performance by 25% and serving 500+ active users across cloud-native platforms.',
    tech: ['React', 'Node.js', 'Firebase', 'GitHub Actions', 'REST APIs'],
    metrics: [
      { value: '25%', label: 'Perf Boost' },
      { value: '500+', label: 'Users Served' },
      { value: '3', label: 'Prod Deploys' },
    ],
    level: 'Entry Level',
  },
  {
    id: 1,
    role: 'AI Developer',
    company: 'YoungMinds Technology Solutions',
    period: 'Aug 2023 – Dec 2023',
    icon: '🧠',
    color: '#00855a',
    cx: 480, cy: 165,
    labelSide: 'above',
    brief: 'Engineered GPT-4o diagnostic pipelines for clinical decision support, achieving 91% ML accuracy and reducing manual reporting overhead by 60%.',
    tech: ['Python', 'GPT-4o', 'LLMs', 'AWS', 'Docker', 'ML Pipelines'],
    metrics: [
      { value: '91%', label: 'ML Accuracy' },
      { value: '60%', label: 'Less Overhead' },
      { value: '1', label: 'Publication' },
    ],
    level: 'Mid Level',
  },
  {
    id: 2,
    role: 'SRE Intern',
    company: 'Cognizant Technology Solutions',
    period: 'Jan 2024 – May 2024',
    icon: '⚡',
    color: '#006747',
    cx: 870, cy: 80,
    labelSide: 'below',
    brief: 'Managed AWS EKS clusters across 3 production environments, built observability pipelines with Prometheus & Grafana, and automated CI/CD workflows achieving 99.9% uptime.',
    tech: ['AWS EKS', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'ITIL v4'],
    metrics: [
      { value: '99.9%', label: 'Uptime SLO' },
      { value: '40%', label: 'MTTR Cut' },
      { value: '3', label: 'EKS Clusters' },
    ],
    level: 'Senior Intern',
    latest: true,
  },
]

/* ── Animated counter ── */
function MetricCount({ value }) {
  const numMatch = value.match(/[\d.]+/)
  const suffix   = value.replace(/[\d.]+/, '')
  const num      = numMatch ? parseFloat(numMatch[0]) : null
  const [display, setDisplay] = useState('0')
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView || num === null) return
    let start = null
    const dur = 900
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const cur = num * eased
      setDisplay(Number.isInteger(num) ? Math.round(cur).toString() : cur.toFixed(1))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView])

  return <span ref={ref}>{num !== null ? display + suffix : value}</span>
}

export default function Experience() {
  const [active, setActive] = useState(1)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  // unique id for SVG defs
  const uid = useRef(`exp${Math.random().toString(36).slice(2,6)}`).current

  return (
    <section id="experience" className="section-wrapper" ref={sectionRef}
      style={{ position: 'relative', overflow: 'hidden' }}>

      {/* subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Career Path</div>
          <h2 className="section-title">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Tap any milestone to read about the role
          </p>
        </motion.div>

        {/* ── SVG Path ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox="0 0 960 330"
              style={{ width: '100%', minWidth: 580, display: 'block', overflow: 'visible' }}
              aria-label="Career journey"
            >
              <defs>
                {/* Path gradient */}
                <linearGradient id={`pg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#B8922A" />
                  <stop offset="50%"  stopColor="#00855a" />
                  <stop offset="100%" stopColor="#006747" />
                </linearGradient>

                {/* Glow filters per node */}
                {JOBS.map(j => (
                  <filter key={j.id} id={`glow-${j.id}-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                ))}

                {/* Path glow filter */}
                <filter id={`pglow-${uid}`}>
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ── Track: dashed underlay ── */}
              <path d={CURVE} fill="none" stroke="var(--border)" strokeWidth={2} strokeDasharray="6 5" opacity={0.5} />

              {/* ── Track: glow layer ── */}
              <motion.path
                d={CURVE} fill="none"
                stroke={`url(#pg-${uid})`}
                strokeWidth={6} strokeLinecap="round" opacity={0.18}
                filter={`url(#pglow-${uid})`}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              />

              {/* ── Track: main line ── */}
              <motion.path
                d={CURVE} fill="none"
                stroke={`url(#pg-${uid})`}
                strokeWidth={3} strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              />

              {/* ── Flowing particles ── */}
              {inView && [0, 1.4, 2.8, 4.2].map((delay, i) => (
                <circle key={i} r={i % 2 === 0 ? 3.5 : 2.5}
                  fill={i % 2 === 0 ? '#006747' : '#B8922A'}
                  opacity={i % 2 === 0 ? 0.85 : 0.55}
                >
                  <animateMotion dur="5.5s" begin={`${delay}s`} repeatCount="indefinite" path={CURVE} />
                </circle>
              ))}

              {/* ── Level labels on path ── */}
              {[
                { x: 90,  y: 295, label: 'Entry' },
                { x: 480, y: 210, label: 'Mid' },
                { x: 870, y: 125, label: 'Senior' },
              ].map(({ x, y, label }) => (
                <motion.text
                  key={label} x={x} y={y}
                  textAnchor="middle" fontSize={9}
                  fontFamily="JetBrains Mono, monospace"
                  fill="rgba(255,255,255,0.25)"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.8 }}
                  style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  {label}
                </motion.text>
              ))}

              {/* ── Milestone nodes ── */}
              {JOBS.map((job, i) => {
                const isActive = active === job.id
                const labelY = job.labelSide === 'above' ? job.cy - 48 : job.cy + 52

                return (
                  <motion.g
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.22, type: 'spring', stiffness: 240, damping: 18 }}
                    onClick={() => setActive(job.id)}
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                    aria-label={job.role}
                    onKeyDown={e => e.key === 'Enter' && setActive(job.id)}
                  >
                    {/* Outermost soft glow */}
                    <circle
                      cx={job.cx} cy={job.cy} r={isActive ? 52 : 36}
                      fill={`${job.color}${isActive ? '14' : '08'}`}
                      style={{ transition: 'r 0.3s, fill 0.3s' }}
                    />

                    {/* Pulsing ring (active only) */}
                    {isActive && (
                      <motion.circle
                        cx={job.cx} cy={job.cy} r={44}
                        fill="none" stroke={job.color} strokeWidth={1}
                        animate={{ r: [44, 56, 44], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}

                    {/* Dashed orbit ring (active) */}
                    {isActive && (
                      <motion.circle
                        cx={job.cx} cy={job.cy} r={40}
                        fill={`${job.color}10`}
                        stroke={job.color} strokeWidth={1.5}
                        strokeDasharray="4 3"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, rotate: 360 }}
                        transition={{ scale: { duration: 0.3 }, opacity: { duration: 0.3 }, rotate: { duration: 18, repeat: Infinity, ease: 'linear' } }}
                        style={{ transformOrigin: `${job.cx}px ${job.cy}px` }}
                      />
                    )}

                    {/* Node circle */}
                    <motion.circle
                      cx={job.cx} cy={job.cy} r={28}
                      fill={isActive ? `${job.color}22` : 'var(--bg-2)'}
                      stroke={isActive ? job.color : 'var(--border-strong)'}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      filter={isActive ? `url(#glow-${job.id}-${uid})` : undefined}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.93 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />

                    {/* Emoji icon */}
                    <text x={job.cx} y={job.cy} textAnchor="middle" dominantBaseline="central"
                      fontSize={20} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {job.icon}
                    </text>

                    {/* "LATEST" badge on most recent node */}
                    {job.latest && (
                      <g>
                        <rect x={job.cx - 22} y={job.cy - 48} width={44} height={14} rx={7}
                          fill="#006747" />
                        <text x={job.cx} y={job.cy - 41} textAnchor="middle" dominantBaseline="central"
                          fontSize={7} fontFamily="JetBrains Mono, monospace" fill="#fff"
                          style={{ letterSpacing: '0.1em', pointerEvents: 'none' }}>
                          LATEST
                        </text>
                      </g>
                    )}

                    {/* Role name */}
                    <text x={job.cx} y={labelY} textAnchor="middle" fontSize={11}
                      fontWeight={isActive ? 700 : 500}
                      fill={isActive ? job.color : 'var(--text-secondary)'}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {job.role}
                    </text>

                    {/* Company name */}
                    <text x={job.cx} y={labelY + 14} textAnchor="middle" fontSize={9}
                      fontFamily="JetBrains Mono, monospace"
                      fill={isActive ? `${job.color}bb` : 'var(--text-muted)'}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {job.company.split(' ')[0]}
                    </text>

                    {/* Period chip */}
                    <text x={job.cx} y={labelY + 28} textAnchor="middle" fontSize={8}
                      fontFamily="JetBrains Mono, monospace"
                      fill="rgba(255,255,255,0.3)"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {job.period.split('–')[0].trim()}
                    </text>
                  </motion.g>
                )
              })}
            </svg>
          </div>

          {/* ── Rich Detail Card ── */}
          <AnimatePresence mode="wait">
            {JOBS.map(job => active === job.id && (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 24,
                  background: 'var(--bg-card)',
                  border: `1px solid ${job.color}28`,
                  borderLeft: `4px solid ${job.color}`,
                  borderRadius: 14,
                  padding: '28px 32px',
                  boxShadow: `0 4px 32px ${job.color}12`,
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 20, flexWrap: 'wrap' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, fontSize: 26, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${job.color}12`, border: `1px solid ${job.color}30`,
                  }}>
                    {job.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{job.role}</span>
                      <span style={{
                        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
                        color: job.color, background: `${job.color}14`,
                        border: `1px solid ${job.color}35`, borderRadius: 5, padding: '2px 8px',
                      }}>{job.level}</span>
                      {job.latest && (
                        <span style={{
                          fontFamily: 'JetBrains Mono', fontSize: 9,
                          color: '#22c55e', background: 'rgba(34,197,94,0.1)',
                          border: '1px solid rgba(34,197,94,0.3)', borderRadius: 5, padding: '2px 8px',
                        }}>● Latest Role</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: job.color, fontWeight: 600 }}>
                        {job.company}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>
                        📅 {job.period}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  {job.metrics.map(m => (
                    <div key={m.label} style={{
                      textAlign: 'center', padding: '14px 8px',
                      background: `${job.color}08`, border: `1px solid ${job.color}20`,
                      borderRadius: 10,
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'JetBrains Mono', color: job.color, lineHeight: 1 }}>
                        <MetricCount value={m.value} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, fontFamily: 'JetBrains Mono' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 18 }}>
                  {job.brief}
                </p>

                {/* Tech chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {job.tech.map(t => (
                    <span key={t} style={{
                      padding: '4px 11px', borderRadius: 6, fontSize: 11,
                      fontFamily: 'JetBrains Mono', fontWeight: 600,
                      background: `${job.color}10`, color: job.color,
                      border: `1px solid ${job.color}28`,
                    }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ── Step indicator ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}
          >
            {JOBS.map(job => (
              <button
                key={job.id}
                onClick={() => setActive(job.id)}
                style={{
                  width: active === job.id ? 28 : 8, height: 8, borderRadius: 4,
                  background: active === job.id ? job.color : 'var(--border)',
                  border: 'none', padding: 0,
                  transition: 'all 0.3s ease',
                  boxShadow: active === job.id ? `0 0 8px ${job.color}60` : 'none',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

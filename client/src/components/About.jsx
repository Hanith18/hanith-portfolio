import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaMapMarkerAlt, FaUniversity, FaBriefcase, FaCode } from 'react-icons/fa'

function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const INFO_ITEMS = [
  { icon: FaMapMarkerAlt, label: 'Location', value: 'Tampa, FL 33613', color: '#B8922A' },
  { icon: FaUniversity, label: 'Education', value: 'M.S. CS · USF (2024–2026)', color: 'var(--cyan)' },
  { icon: FaBriefcase, label: 'Focus', value: 'SRE / DevOps / Cloud', color: 'var(--purple-light)' },
  { icon: FaCode, label: 'Availability', value: 'Open to SRE Roles · May 2026', color: '#006747' },
]

const STATS = [
  { label: 'Industry Roles', value: 3, suffix: '' },
  { label: 'Cloud Technologies', value: 15, suffix: '+' },
  { label: 'GPA (B.E.)', value: 8, suffix: '.6' },
  { label: 'Publications', value: 4, suffix: '' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [imgError, setImgError] = useState(false)

  return (
    <section id="about" className="section-wrapper">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>About Me</div>
            <h2 className="section-title">
              Building <span className="gradient-text">Resilient Systems</span> at Scale
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: 17 }}>
              Detail-oriented engineer bridging the gap between development velocity and production reliability.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
            {/* Bio */}
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 36 }}>
              {/* Photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%',
                  border: '3px solid var(--purple)',
                  overflow: 'hidden', flexShrink: 0,
                  boxShadow: '0 0 0 4px rgba(0,103,71,0.1)',
                  background: 'var(--bg-2)',
                }}>
                  {!imgError ? (
                    <img
                      src="/hanith-about.jpg"
                      alt="Hanith Pulimi"
                      onError={() => setImgError(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--purple-dim)', fontSize: 28, fontWeight: 900, color: 'var(--purple)',
                    }}>HP</div>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Who I Am</h3>
                  <div style={{ fontSize: 13, color: 'var(--purple)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                    SRE · DevOps · Cloud Engineer
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 20 }}>
                I'm a <strong style={{ color: 'var(--purple-light)' }}>Site Reliability / DevOps Engineer</strong> pursuing
                my M.S. in Computer Science at USF. Joining the Masters program ignited my deep interest in
                <strong style={{ color: 'var(--purple-light)' }}> AWS, SRE, and Cloud Infrastructure</strong> — pushing me
                to specialise in building reliable, scalable systems at production scale.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 20 }}>
                I'm skilled across the full SRE/DevOps stack —
                <strong style={{ color: 'var(--cyan-light)' }}> Linux, Docker, Kubernetes, Terraform, Prometheus, Grafana, AWS, CI/CD </strong>
                — handling everything from IaC provisioning and Kubernetes orchestration to SLO/SLI definition,
                error budget tracking, incident triage, and full-stack observability.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                Outside engineering, I've published research in <strong style={{ color: 'var(--purple-light)' }}>ML inference systems</strong>, agricultural AI,
                and novel sorting algorithms — applying the same rigour to production reliability challenges.
              </p>

              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {INFO_ITEMS.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: `${color}18`, border: `1px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats + Coursework */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Stats grid */}
              <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {STATS.map(({ label, value, suffix }) => (
                  <div key={label} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1 }} className="gradient-text">
                      <Counter end={value} suffix={suffix} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'JetBrains Mono' }}>{label}</div>
                  </div>
                ))}
              </motion.div>

              {/* SRE principles */}
              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--cyan-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚙️</span> Core SRE Principles
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['SLO/SLI Definition', 'Error Budget Tracking', 'Blameless Postmortems', 'Incident Triage', 'Automation-First', 'Chaos Engineering', 'On-Call Response', 'ITIL v4', 'Zero-Downtime Deploys', 'MTTR Reduction'].map(p => (
                    <span key={p} className="skill-badge skill-badge-purple" style={{ fontSize: 11 }}>{p}</span>
                  ))}
                </div>
              </motion.div>

              {/* Coursework */}
              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 18, color: 'var(--purple-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📚</span> Graduate Coursework (USF)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['NLP', 'Artificial Intelligence', 'Operating Systems', 'Computer Architecture', 'Theory of Algorithms'].map(c => (
                    <span key={c} className="skill-badge skill-badge-cyan" style={{ fontSize: 11 }}>{c}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

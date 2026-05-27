import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const NODES = [
  {
    year: '2020',
    status: 'past',
    emoji: '🎓',
    title: 'Started B.E. CS',
    subtitle: 'R.M.D Engineering College, Anna University',
    description: 'Began Computer Science & Engineering degree. Studied Cloud Computing, OS, ML, AI, Data Structures.',
    color: '#006747',
    tags: ['Python', 'C++', 'ML Fundamentals'],
  },
  {
    year: 'Jan 2023',
    status: 'past',
    emoji: '💻',
    title: 'Software Developer',
    subtitle: 'Internbug Technologies',
    description: 'Built cloud-native apps on Firebase, OAuth 2.0/JWT auth, GitHub Actions CI/CD.',
    color: '#B8922A',
    tags: ['Firebase', 'GitHub Actions', 'REST APIs'],
  },
  {
    year: 'Aug 2023',
    status: 'past',
    emoji: '🤖',
    title: 'AI Developer',
    subtitle: 'YoungMinds Technology Solutions',
    description: 'Deployed ML pipelines on AWS. Published Sign Language Detection at ICAETC 2023. 30% toil reduction.',
    color: '#008a5e',
    tags: ['AWS', 'Docker', 'Python', 'Published Research'],
  },
  {
    year: 'Jan 2024',
    status: 'past',
    emoji: '⚡',
    title: 'SRE Intern',
    subtitle: 'Cognizant Technology Solutions',
    description: 'ITIL v4 incident management, Grafana/CloudWatch observability dashboards, Kubernetes orchestration, Terraform IaC.',
    color: '#006747',
    tags: ['Kubernetes', 'Terraform', 'Grafana', 'ITIL v4'],
  },
  {
    year: 'May 2024',
    status: 'past',
    emoji: '🏅',
    title: 'B.E. Graduated',
    subtitle: 'GPA: 8.60/10 · 4 Publications',
    description: 'Graduated with strong academic record, 4 published research papers, and 3 industry roles.',
    color: '#006747',
    tags: ['4 Publications', 'GPA 8.60', 'Honors'],
  },
  {
    year: 'Aug 2024',
    status: 'past',
    emoji: '🎓',
    title: 'Started M.S. CS',
    subtitle: 'University of South Florida',
    description: 'Graduate study in NLP, AI, OS, Computer Architecture, Theory of Algorithms. Deep SRE specialization.',
    color: '#B8922A',
    tags: ['NLP', 'AI', 'Algorithms'],
  },
  {
    year: '2025 NOW',
    status: 'current',
    emoji: '⚡',
    title: 'M.S. Ongoing · Growing',
    subtitle: 'USF · Cloud & DevOps Expertise',
    description: 'Advancing expertise in cloud reliability, distributed systems, and ML-Ops. Building portfolio projects aligned with production SRE standards.',
    color: '#B8922A',
    tags: ['AWS Advanced', 'K8s Production', 'SLO Engineering', 'Open Source'],
  },
  {
    year: 'May 2026',
    status: 'future',
    emoji: '🎯',
    title: 'MS Graduation',
    subtitle: 'Target: Full-Time SRE / DevOps Engineer',
    description: 'Graduate with M.S. CS. Target: Senior-level SRE or Platform Engineer role at a high-scale tech company or cloud provider.',
    color: '#008a5e',
    tags: ['MS Graduate', 'SRE L4+', 'Cloud-Native'],
  },
  {
    year: '2027',
    status: 'future',
    emoji: '🚀',
    title: 'Senior SRE / Platform Engineer',
    subtitle: 'High-Scale Distributed Systems',
    description: 'Lead reliability initiatives, own SLOs for critical services, mentor junior engineers, contribute to open-source reliability tooling.',
    color: '#006747',
    tags: ['Tech Lead', 'Platform Infra', 'Open Source'],
  },
  {
    year: '2028+',
    status: 'future',
    emoji: '🌐',
    title: 'Principal Engineer',
    subtitle: 'Reliability Architecture & Leadership',
    description: 'Architect large-scale reliability strategies, influence engineering culture, build systems that serve millions of users at 99.99% uptime.',
    color: '#B8922A',
    tags: ['Principal', 'Architecture', '99.99% SLA'],
  },
]

function RoadmapNode({ node, index, isHovered, onHover }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const isPast = node.status === 'past'
  const isCurrent = node.status === 'current'
  const isFuture = node.status === 'future'

  return (
    <motion.div
      ref={ref}
      className={`roadmap-node ${node.status}`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ minWidth: 140, maxWidth: 160, position: 'relative' }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Year label above */}
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700, marginBottom: 12,
        color: isCurrent ? '#B8922A' : isPast ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
        textAlign: 'center', letterSpacing: '0.05em',
      }}>
        {node.year}
      </div>

      {/* Circle node */}
      <motion.div
        className="roadmap-node-circle"
        style={{
          background: isCurrent
            ? 'rgba(184,146,42,0.25)'
            : isPast
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.06)',
          borderColor: isCurrent ? '#B8922A' : isPast ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
          borderStyle: isFuture ? 'dashed' : 'solid',
          fontSize: 24,
          opacity: isFuture ? 0.6 : 1,
        }}
        whileHover={{ scale: 1.15 }}
      >
        {node.emoji}
      </motion.div>

      {/* Title below */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: isFuture ? 'rgba(255,255,255,0.45)' : '#ffffff',
          marginBottom: 4, lineHeight: 1.3,
        }}>
          {node.title}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'JetBrains Mono', lineHeight: 1.4 }}>
          {node.subtitle}
        </div>
      </div>

      {/* Hover tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 16px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 220,
            background: 'rgba(8,8,18,0.97)',
            border: `1px solid ${node.color}50`,
            borderRadius: 12,
            padding: '14px 16px',
            zIndex: 10,
            boxShadow: `0 0 30px ${node.color}30`,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: node.color, marginBottom: 6 }}>{node.title}</div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
            {node.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {node.tags.map(t => (
              <span key={t} style={{
                fontSize: 9, padding: '2px 7px', borderRadius: 999,
                background: `${node.color}15`, color: node.color, border: `1px solid ${node.color}35`,
                fontFamily: 'JetBrains Mono',
              }}>
                {t}
              </span>
            ))}
          </div>
          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: -7, left: '50%',
            width: 12, height: 12, background: 'rgba(8,8,18,0.97)',
            border: `1px solid ${node.color}50`, borderTop: 'none', borderLeft: 'none',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />
        </motion.div>
      )}
    </motion.div>
  )
}

export default function Roadmap() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false })
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)

  const pastCount = NODES.filter(n => n.status === 'past').length
  const currentIdx = NODES.findIndex(n => n.status === 'current')

  function onMouseMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    })
  }

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="section-wrapper"
      style={{ background: '#006747', overflow: 'hidden', position: 'relative' }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setSpotlight(s => ({ ...s, active: false }))}
    >
      {/* Mouse-follow spotlight */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: spotlight.active
          ? `radial-gradient(circle 420px at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.07) 0%, transparent 70%)`
          : 'none',
        transition: 'background 0.1s',
      }} />
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}>Career Journey</div>
          <h2 className="section-title" style={{ color: '#ffffff' }}>
            My <span style={{ color: '#B8922A' }}>Roadmap</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto', fontSize: 16 }}>
            From student to engineer — a visual timeline of where I've been, where I am, and where I'm going.
          </p>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Completed', color: '#ffffff', style: 'solid' },
              { label: 'Current', color: '#B8922A', style: 'solid', pulse: true },
              { label: 'Goal', color: 'rgba(255,255,255,0.4)', style: 'dashed' },
            ].map(({ label, color, style, pulse }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'JetBrains Mono' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `2px ${style} ${color}`,
                  background: `${color}20`,
                  ...(pulse ? { animation: 'pulseGlow 2s ease-in-out infinite' } : {}),
                }} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div
          ref={scrollRef}
          style={{
            overflowX: 'auto',
            paddingBottom: 24,
            cursor: 'grab',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', paddingTop: 60, paddingBottom: 80 }}>
            {NODES.map((node, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <RoadmapNode
                  node={node}
                  index={i}
                  isHovered={hoveredIndex === i}
                  onHover={setHoveredIndex}
                />

                {/* Connector line */}
                {i < NODES.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.3 }}
                    style={{
                      width: 40,
                      height: 2,
                      transformOrigin: 'left',
                      marginBottom: 40,
                      background: i < currentIdx
                        ? `linear-gradient(to right, ${node.color}, ${NODES[i + 1].color})`
                        : i === currentIdx
                        ? 'linear-gradient(to right, #B8922A, rgba(255,255,255,0.3))'
                        : 'rgba(255,255,255,0.25)',
                      borderStyle: i >= currentIdx ? 'dashed' : 'solid',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginTop: 8,
          }}
        >
          {[
            { label: 'Milestones Completed', value: pastCount, color: 'var(--purple-light)' },
            { label: 'Years in Industry', value: '3+', color: 'var(--cyan-light)' },
            { label: 'Target Role', value: 'SRE L4+', color: '#006747' },
            { label: 'Available', value: 'May 2026', color: 'var(--amber)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                padding: '18px 22px', textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

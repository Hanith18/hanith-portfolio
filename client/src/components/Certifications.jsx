import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCertificate, FaCheckCircle } from 'react-icons/fa'

const CERTS = [
  {
    title: 'AI for Everyone',
    issuer: 'Coursera / DeepLearning.AI',
    emoji: '🤖',
    color: '#B8922A',
    year: '2023',
    category: 'AI/ML',
  },
  {
    title: 'Cloud Foundation',
    issuer: 'Great Learning',
    emoji: '☁️',
    color: '#B8922A',
    year: '2023',
    category: 'Cloud',
  },
  {
    title: 'Introduction to Java Programming',
    issuer: 'Coursera',
    emoji: '☕',
    color: '#B8922A',
    year: '2022',
    category: 'Programming',
  },
  {
    title: 'Agile Methodologies & Scrum Practices',
    issuer: 'Cognizant (Forage)',
    emoji: '🔄',
    color: '#006747',
    year: '2024',
    category: 'Methodology',
  },
]

export default function Certifications() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="certifications" className="section-wrapper">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Credentials</div>
          <h2 className="section-title">
            Certifications & <span className="gradient-text">Licenses</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
          {CERTS.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card"
              style={{ padding: '26px 22px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
              {/* Background gradient */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                background: `radial-gradient(circle at 50% 0%, ${cert.color}, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              <div style={{
                width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px',
                background: `${cert.color}18`, border: `1px solid ${cert.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                boxShadow: `0 0 20px ${cert.color}30`,
              }}>
                {cert.emoji}
              </div>

              <div style={{ marginBottom: 8 }}>
                <span className="skill-badge" style={{
                  background: `${cert.color}12`,
                  color: cert.color,
                  borderColor: `${cert.color}35`,
                  fontSize: 10,
                }}>
                  {cert.category}
                </span>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{cert.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'JetBrains Mono' }}>{cert.issuer}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#006747' }}>
                <FaCheckCircle size={12} />
                <span style={{ fontFamily: 'JetBrains Mono' }}>Earned {cert.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

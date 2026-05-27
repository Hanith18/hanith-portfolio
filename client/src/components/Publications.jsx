import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaExternalLinkAlt, FaBook } from 'react-icons/fa'

const PUBLICATIONS = [
  {
    title: 'Sign Language Detection System',
    venue: 'ICAETC 2023',
    type: 'Conference Paper',
    color: '#006747',
    emoji: '🤟',
    description: 'Real-time ASL inference pipeline achieving 94% accuracy at sub-100ms latency using MediaPipe and TensorFlow/Keras.',
    tags: ['Computer Vision', 'MediaPipe', 'TensorFlow', 'Real-time ML'],
  },
  {
    title: 'Deep Learning Models for Potato Leaf Disease Diagnosis',
    venue: 'Int. Journal of Research in Engineering, Science and Management — Jul 2023',
    type: 'Journal Article',
    color: '#B8922A',
    emoji: '🌱',
    description: 'CNN classifier achieving 92% accuracy for early agricultural disease detection, enabling proactive crop management.',
    tags: ['CNN', 'Deep Learning', 'Agricultural AI', 'Image Classification'],
  },
  {
    title: 'A Critical Study on the Dark Web and Dark Nets',
    venue: 'Scopus-Indexed Journal',
    type: 'Scopus Indexed',
    color: '#006747',
    emoji: '🔐',
    description: 'Analysis of darknet technologies, anonymization protocols, and enterprise cybersecurity threat vectors.',
    tags: ['Cybersecurity', 'Darknet', 'Anonymization', 'Threat Intelligence'],
  },
  {
    title: 'STACKSORT: A Novel Sorting Algorithm',
    venue: 'Peer-Reviewed Journal',
    type: 'Research Article',
    color: '#B8922A',
    emoji: '🔢',
    description: 'Hybrid stack-based sorting algorithm outperforming O(n log n) algorithms on large-scale datasets with theoretical analysis.',
    tags: ['Algorithms', 'Data Structures', 'Complexity Analysis', 'Computer Science'],
  },
]

const typeColors = {
  'Conference Paper': '#006747',
  'Journal Article': '#B8922A',
  'Scopus Indexed': '#006747',
  'Research Article': '#B8922A',
}

export default function Publications() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="publications" className="section-wrapper" style={{ background: 'rgba(10,10,20,0.3)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Research</div>
          <h2 className="section-title">
            Publications & <span className="gradient-text">Research</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {PUBLICATIONS.map((pub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card"
              style={{ padding: '24px 28px' }}
            >
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                  background: `${pub.color}18`, border: `1px solid ${pub.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>
                  {pub.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, flex: '1 1 300px' }}>{pub.title}</h3>
                    <span
                      className="skill-badge"
                      style={{
                        background: `${typeColors[pub.type]}15`,
                        color: typeColors[pub.type],
                        borderColor: `${typeColors[pub.type]}40`,
                        fontSize: 10, height: 'fit-content', flexShrink: 0,
                      }}
                    >
                      📄 {pub.type}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: pub.color, fontFamily: 'JetBrains Mono', marginBottom: 10 }}>
                    {pub.venue}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                    {pub.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {pub.tags.map(tag => (
                      <span key={tag} className="skill-badge skill-badge-purple" style={{ fontSize: 10 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

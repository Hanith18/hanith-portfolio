import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  SiDocker, SiKubernetes, SiTerraform, SiGrafana, SiPrometheus,
  SiSplunk, SiGithubactions, SiPython, SiPostgresql, SiMongodb,
  SiFirebase, SiLinux, SiNewrelic, SiJira,
} from 'react-icons/si'
import { FaAws, FaDatabase, FaServer, FaCode, FaShieldAlt } from 'react-icons/fa'

const CATEGORIES = ['All', 'Cloud & Infra', 'Observability', 'CI/CD', 'Languages', 'Databases', 'SRE']

const SKILLS = [
  // Cloud & Infra
  { name: 'AWS', icon: FaAws, color: '#B8922A', level: 90, cat: 'Cloud & Infra', sub: 'EC2, S3, RDS, IAM, Lambda, EKS, ECR' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#006747', level: 85, cat: 'Cloud & Infra', sub: 'EKS, Autoscaling, Probes, Namespaces' },
  { name: 'Docker', icon: SiDocker, color: '#006747', level: 90, cat: 'Cloud & Infra', sub: 'Containerization, ECR, Compose' },
  { name: 'Terraform', icon: SiTerraform, color: '#B8922A', level: 80, cat: 'Cloud & Infra', sub: 'IaC, Multi-cloud, Modules' },
  { name: 'Linux', icon: SiLinux, color: '#B8922A', level: 85, cat: 'Cloud & Infra', sub: 'Administration, Shell, Networking' },
  // Observability
  { name: 'Grafana', icon: SiGrafana, color: '#B8922A', level: 88, cat: 'Observability', sub: 'Dashboards, SLI/SLO tracking' },
  { name: 'Prometheus', icon: SiPrometheus, color: '#B8922A', level: 82, cat: 'Observability', sub: 'Alert Manager, Metrics' },
  { name: 'Splunk', icon: SiSplunk, color: '#006747', level: 80, cat: 'Observability', sub: 'Log analysis, SIEM' },
  { name: 'New Relic', icon: SiNewrelic, color: '#006747', level: 78, cat: 'Observability', sub: 'APM, Distributed tracing' },
  { name: 'CloudWatch', icon: FaAws, color: '#B8922A', level: 85, cat: 'Observability', sub: 'AWS native monitoring, Alarms' },
  // CI/CD
  { name: 'GitHub Actions', icon: SiGithubactions, color: '#006747', level: 88, cat: 'CI/CD', sub: 'Pipelines, Rollback gates' },
  { name: 'Harness CI/CD', icon: FaServer, color: '#006747', level: 75, cat: 'CI/CD', sub: 'Pipeline orchestration' },
  // Languages
  { name: 'Python', icon: SiPython, color: '#006747', level: 88, cat: 'Languages', sub: 'Automation, ML, Scripting' },
  { name: 'Bash/Shell', icon: FaCode, color: '#006747', level: 85, cat: 'Languages', sub: 'Scripting, Automation, CRON' },
  // Databases
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#006747', level: 80, cat: 'Databases', sub: 'SQL, Optimization' },
  { name: 'MongoDB', icon: SiMongodb, color: '#006747', level: 75, cat: 'Databases', sub: 'NoSQL, Aggregations' },
  { name: 'Firebase', icon: SiFirebase, color: '#B8922A', level: 82, cat: 'Databases', sub: 'Firestore, Real-time DB' },
  // SRE
  { name: 'Incident Mgmt', icon: FaShieldAlt, color: '#B8922A', level: 85, cat: 'SRE', sub: 'ITIL v4, Postmortems, JIRA' },
  { name: 'ServiceNow', icon: SiJira, color: '#006747', level: 78, cat: 'SRE', sub: 'ITSM, Change Management' },
]

const getLevelLabel = l => l >= 88 ? 'Expert' : l >= 80 ? 'Advanced' : l >= 70 ? 'Proficient' : 'Familiar'
const getLevelColor = l => l >= 88 ? 'var(--green)' : l >= 80 ? 'var(--cyan)' : l >= 70 ? 'var(--purple-light)' : 'var(--amber)'

function SkillCard({ skill, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { icon: Icon, name, color, level, sub } = skill

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="glass-card neon-border"
      style={{ padding: '20px', cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', color: getLevelColor(level) }}>
              {getLevelLabel(level)}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{sub}</div>
        </div>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [active, setActive] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  const filtered = active === 'All' ? SKILLS : SKILLS.filter(s => s.cat === active)

  return (
    <section id="skills" className="section-wrapper">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Technical Stack</div>
          <h2 className="section-title">
            Tools & <span className="gradient-text">Technologies</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 36px', fontSize: 16 }}>
            A battle-tested toolkit for building and operating production infrastructure.
          </p>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: '1px solid',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.25s',
                  background: active === cat ? 'var(--purple)' : 'transparent',
                  borderColor: active === cat ? 'var(--purple)' : 'var(--border)',
                  color: active === cat ? 'white' : 'var(--text-secondary)',
                  boxShadow: active === cat ? 'var(--glow-purple)' : 'none',
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}
          >
            {filtered.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} delay={i * 0.06} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

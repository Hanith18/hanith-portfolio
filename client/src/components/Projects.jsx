import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaGithub } from 'react-icons/fa'
import { SiReact, SiTypescript, SiFirebase, SiPython, SiDocker, SiGithubactions, SiTensorflow, SiOpencv, SiScikitlearn, SiKubernetes, SiTerraform, SiPrometheus, SiGrafana } from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

const PROJECTS = [
  {
    title: 'AWS SRE Observability Stack',
    subtitle: 'Production-Grade Cloud Reliability Platform',
    emoji: '📡',
    color: '#006747',
    gradient: 'linear-gradient(135deg, rgba(0,103,71,0.18), rgba(184,146,42,0.1))',
    github: 'https://github.com/hanithpulimi',
    tech: [
      { name: 'AWS EKS', icon: FaAws, color: '#B8922A' },
      { name: 'Kubernetes', icon: SiKubernetes, color: '#006747' },
      { name: 'Terraform', icon: SiTerraform, color: '#006747' },
      { name: 'Prometheus', icon: SiPrometheus, color: '#B8922A' },
      { name: 'Grafana', icon: SiGrafana, color: '#006747' },
    ],
    techExtra: ['Helm', 'ArgoCD', 'PagerDuty', 'Linux'],
    bullets: [
      'Provisioned multi-AZ AWS EKS cluster via Terraform IaC — enabling zero-downtime blue/green deployments with Helm & ArgoCD',
      'Defined SLOs (99.9% uptime, <200ms p99 latency) with Prometheus alerting rules and automated error budget burn-rate alerts to PagerDuty',
      'Built full observability pipeline: Prometheus metrics scraping, custom Grafana dashboards, and distributed tracing across microservices',
      'Implemented Kubernetes HPA, PodDisruptionBudgets, liveness/readiness probes, and resource quotas for fault-tolerant, self-healing workloads',
    ],
    highlights: ['99.9% SLO', 'IaC with Terraform', 'Error Budget Alerts', 'Zero-Downtime Deploy'],
    badge: 'SRE Flagship',
  },
  {
    title: 'Finderly',
    subtitle: 'Cloud-Native Serverless Platform',
    emoji: '🔍',
    color: '#B8922A',
    gradient: 'linear-gradient(135deg, rgba(184,146,42,0.15), rgba(0,103,71,0.08))',
    github: 'https://github.com/hanithpulimi',
    tech: [
      { name: 'React', icon: SiReact, color: '#006747' },
      { name: 'TypeScript', icon: SiTypescript, color: '#006747' },
      { name: 'Firebase', icon: SiFirebase, color: '#B8922A' },
      { name: 'Docker', icon: SiDocker, color: '#006747' },
    ],
    techExtra: ['Cloud Functions', 'IAM / OAuth 2.0', 'CI/CD', 'REST APIs'],
    bullets: [
      'Architected serverless event-driven platform on Firebase Cloud Functions with horizontal auto-scaling and fault-tolerant backend',
      'Enforced SLO-aligned uptime targets with multi-channel alerting, health-check probes, and zero-downtime CI/CD deployments via GitHub Actions',
      'Built sub-second real-time messaging across distributed system with end-to-end latency SLI monitoring',
      'Secured with Google OAuth 2.0 / IAM identity management and full-stack observability via Firebase Performance Monitoring',
    ],
    highlights: ['Serverless', 'SLO-Aligned', 'Zero-Downtime CI/CD', 'IAM Security'],
  },
  {
    title: 'LLM Evaluation Pipeline',
    subtitle: 'MLOps Reliability Validation System',
    emoji: '🧠',
    color: '#006747',
    gradient: 'linear-gradient(135deg, rgba(0,103,71,0.15), rgba(184,146,42,0.08))',
    github: 'https://github.com/hanithpulimi',
    tech: [
      { name: 'Python', icon: SiPython, color: '#006747' },
      { name: 'GitHub Actions', icon: SiGithubactions, color: '#006747' },
      { name: 'Docker', icon: SiDocker, color: '#006747' },
    ],
    techExtra: ['Hugging Face', 'Prometheus Metrics', 'MLOps', 'SLO Scoring'],
    bullets: [
      'Built containerised MLOps evaluation pipeline with SLO-style performance scoring, regression tracking, and error budget reporting',
      'Integrated CI/CD pipeline in GitHub Actions — model-triggered benchmark execution with automated rollback on SLO breach',
      'Instrumented with Prometheus-compatible metrics for model drift detection and reliability validation under distribution shifts',
      'Operationalised as reusable SRE-aligned continuous validation tool — reducing manual QA overhead by 60%',
    ],
    highlights: ['MLOps', 'SLO Scoring', 'CI/CD Rollback', 'Drift Detection'],
  },
  {
    title: 'Sign Language Detection',
    subtitle: 'Real-Time Containerised Inference Pipeline',
    emoji: '🤟',
    color: '#006747',
    gradient: 'linear-gradient(135deg, rgba(0,103,71,0.12), rgba(184,146,42,0.08))',
    github: 'https://github.com/hanithpulimi',
    demo: 'https://github.com/hanithpulimi',
    tech: [
      { name: 'Python', icon: SiPython, color: '#006747' },
      { name: 'TensorFlow', icon: SiTensorflow, color: '#B8922A' },
      { name: 'OpenCV', icon: SiOpencv, color: '#006747' },
      { name: 'Docker', icon: SiDocker, color: '#006747' },
    ],
    techExtra: ['MediaPipe', 'Kubernetes-Ready', 'ICAETC 2023 Published'],
    bullets: [
      'Engineered real-time ASL inference system achieving 94% accuracy / <100ms p99 latency — production SLO-grade performance',
      'Containerised with Docker and architected for Kubernetes horizontal pod auto-scaling under variable inference load',
      'Applied model quantisation and feature engineering to reduce CPU/memory footprint — optimised for resource-constrained production environments',
      'Published at ICAETC 2023 with full SLI/SLO benchmarking and latency profiling documentation',
    ],
    highlights: ['94% Accuracy', '<100ms p99', 'Published Research', 'K8s-Ready'],
    badge: 'ICAETC 2023',
  },
  {
    title: 'Churn & Spam ML Pipelines',
    subtitle: 'Production ML Decision Services',
    emoji: '📊',
    color: '#B8922A',
    gradient: 'linear-gradient(135deg, rgba(184,146,42,0.12), rgba(0,103,71,0.08))',
    github: 'https://github.com/hanithpulimi',
    tech: [
      { name: 'Python', icon: SiPython, color: '#006747' },
      { name: 'Scikit-learn', icon: SiScikitlearn, color: '#B8922A' },
      { name: 'Docker', icon: SiDocker, color: '#006747' },
    ],
    techExtra: ['NLP', 'TF-IDF', 'REST APIs', 'Versioned Artifacts'],
    bullets: [
      'Developed churn prediction and spam detection ML services containerised in Docker and exposed via production REST API endpoints with SLA guarantees',
      'Achieved 98% classification accuracy with precision-recall threshold alerting aligned to business SLOs',
      'Implemented versioned artifact storage, A/B model rollout, and cross-validation for zero-regression model deployments',
      'Instrumented API latency and model drift metrics for operational observability across both inference services',
    ],
    highlights: ['98% Accuracy', 'SLA-Backed API', 'A/B Rollout', 'Observability'],
  },
]

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 })

  // combine refs
  const setRef = (el) => { cardRef.current = el; inViewRef(el) }

  function onMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top)  / rect.height
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 10 })
    setSpotlight({ x: px * 100, y: py * 100, opacity: 0.12 })
  }
  function onMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setSpotlight(s => ({ ...s, opacity: 0 }))
  }

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        perspective: 900,
        transformStyle: 'preserve-3d',
      }}
    >
    <motion.div
      className="glass-card"
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{ overflow: 'hidden', position: 'relative', transformStyle: 'preserve-3d' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Spotlight overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, borderRadius: 'inherit',
        background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,${spotlight.opacity}) 0%, transparent 60%)`,
        transition: 'opacity 0.3s ease',
      }} />
      {/* Top gradient band */}
      <div style={{ height: 4, background: project.gradient }} />

      <div style={{ padding: 26 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 14, flexShrink: 0,
            background: project.gradient, border: `1px solid ${project.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          }}>
            {project.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 3 }}>{project.title}</h3>
                <p style={{ fontSize: 13, color: project.color, fontFamily: 'JetBrains Mono' }}>{project.subtitle}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                {project.badge && (
                  <span className="skill-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#006747', borderColor: 'rgba(16,185,129,0.3)', fontSize: 10 }}>
                    📄 {project.badge}
                  </span>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    title="View on GitHub"
                    style={{
                      width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-secondary)',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#CFC493'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  >
                    <FaGithub size={14} />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    title="Live Demo"
                    style={{
                      width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: `${project.color}15`,
                      border: `1px solid ${project.color}40`, color: project.color,
                    }}
                  >
                    <FaExternalLinkAlt size={12} />
                  </a>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  {expanded ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {project.tech.map(({ name, icon: Icon, color }) => (
            <div key={name} title={name} style={{
              width: 30, height: 30, borderRadius: 8,
              background: `${color}15`, border: `1px solid ${color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={16} style={{ color }} />
            </div>
          ))}
          {project.techExtra.map(t => (
            <span key={t} className="skill-badge skill-badge-purple" style={{ fontSize: 10 }}>{t}</span>
          ))}
        </div>

        {/* Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: expanded ? 16 : 0 }}>
          {project.highlights.map(h => (
            <span key={h} className="skill-badge" style={{ background: `${project.color}10`, color: project.color, borderColor: `${project.color}35`, fontSize: 10 }}>
              ✦ {h}
            </span>
          ))}
        </div>

        {/* Expandable bullets */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {project.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <span style={{ color: project.color, flexShrink: 0, marginTop: 3 }}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="projects" className="section-wrapper">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Key Projects</div>
          <h2 className="section-title">
            What I've <span className="gradient-text">Built</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Click any card to expand details</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}

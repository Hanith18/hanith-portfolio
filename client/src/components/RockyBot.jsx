import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaPaperPlane } from 'react-icons/fa'

function RockyIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="36" rx="18" ry="16" fill="#006747" />
      <ellipse cx="32" cy="46" rx="10" ry="7" fill="#CFC493" />
      <circle cx="28.5" cy="47" r="2" fill="#004d35" />
      <circle cx="35.5" cy="47" r="2" fill="#004d35" />
      <circle cx="24" cy="33" r="3.5" fill="white" />
      <circle cx="40" cy="33" r="3.5" fill="white" />
      <circle cx="25" cy="33.5" r="2" fill="#1a1a1a" />
      <circle cx="41" cy="33.5" r="2" fill="#1a1a1a" />
      <circle cx="25.8" cy="32.8" r="0.7" fill="white" />
      <circle cx="41.8" cy="32.8" r="0.7" fill="white" />
      <path d="M16 26 Q8 14 14 8 Q20 16 18 26Z" fill="#CFC493" />
      <path d="M16 26 Q10 16 14 8 Q12 16 16 26Z" fill="#b8a876" />
      <path d="M48 26 Q56 14 50 8 Q44 16 46 26Z" fill="#CFC493" />
      <path d="M48 26 Q54 16 50 8 Q52 16 48 26Z" fill="#b8a876" />
      <ellipse cx="14" cy="30" rx="5" ry="7" fill="#006747" />
      <ellipse cx="14" cy="30" rx="3" ry="4.5" fill="#004d35" />
      <ellipse cx="50" cy="30" rx="5" ry="7" fill="#006747" />
      <ellipse cx="50" cy="30" rx="3" ry="4.5" fill="#004d35" />
      <path d="M20 29 Q24 26 28 29" stroke="#004d35" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M36 29 Q40 26 44 29" stroke="#004d35" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="49" r="3.5" stroke="#CFC493" strokeWidth="2" fill="none" />
    </svg>
  )
}

// ── Full knowledge base ──────────────────────────────────────────────────────
const QA = [
  {
    keys: ['skill', 'tech', 'stack', 'know', 'expert', 'tools', 'language', 'devops', 'sre'],
    a: `🛠️ Hanith's SRE/DevOps Stack:\n\n• Cloud & Infra: AWS (EKS, EC2, S3, RDS, Lambda, IAM, ECR, CloudWatch), GCP\n• Containers & Orchestration: Docker, Kubernetes, Helm, ArgoCD\n• IaC: Terraform, Ansible\n• Observability: Prometheus, Grafana, Splunk, CloudWatch, PagerDuty\n• CI/CD: GitHub Actions, Jenkins, GitLab CI\n• OS & Scripting: Linux (RHEL/Ubuntu), Bash, Python\n• SRE Practices: SLO/SLI/SLA, Error Budget, Blameless Postmortems, Incident Triage, ITIL v4\n• Languages: Python, JavaScript, TypeScript, Java`,
  },
  {
    keys: ['linux', 'docker', 'kubernetes', 'k8s', 'container', 'helm', 'argocd'],
    a: `🐳 Container & Orchestration Skills:\n\n• Linux — RHEL/Ubuntu admin, shell scripting, cron, systemd\n• Docker — Dockerfile authoring, multi-stage builds, container security\n• Kubernetes — Deployments, HPA, PDB, liveness/readiness probes, RBAC, namespaces\n• Helm — Chart creation, values management, versioned rollouts\n• ArgoCD — GitOps continuous delivery, sync policies, automated rollbacks\n\nHanith has hands-on experience running these in production AWS EKS clusters! ☁️`,
  },
  {
    keys: ['aws', 'cloud', 'amazon', 'ec2', 's3', 'eks', 'lambda', 'terraform', 'iac'],
    a: `☁️ AWS & Cloud Infrastructure:\n\nHanith developed a deep interest in AWS and Cloud after joining his M.S. at USF.\n\n• AWS Services: EKS, EC2, S3, RDS, Lambda, IAM, ECR, CloudWatch, VPC, Route 53\n• Terraform IaC — provisions multi-AZ clusters, manages state, modules\n• Managed AWS EKS clusters across 3 production environments\n• Achieved 99.9% uptime and cut MTTR by 40% using AWS-native tooling\n• AWS-certified through Cloud Foundation certification ☁️`,
  },
  {
    keys: ['prometheus', 'grafana', 'monitor', 'observ', 'alert', 'dashboard', 'metric', 'splunk'],
    a: `📊 Observability & Monitoring:\n\n• Prometheus — metrics scraping, alerting rules, error budget burn-rate alerts\n• Grafana — custom dashboards, SLO tracking panels, incident visualisation\n• CloudWatch — AWS-native log aggregation, alarm policies\n• Splunk — log correlation, search queries, operational dashboards\n• PagerDuty — on-call rotation, escalation policies\n\nHanith designs full observability pipelines from metrics → dashboards → alerts → incident response. 📡`,
  },
  {
    keys: ['slo', 'sli', 'sla', 'error budget', 'uptime', 'reliability', 'incident', 'mttr', 'postmortem'],
    a: `⚡ SRE Principles Hanith Practices:\n\n• SLO/SLI definition — sets measurable reliability targets per service\n• Error Budget Tracking — automated burn-rate alerts via Prometheus\n• Blameless Postmortems — root cause analysis, action items, no blame culture\n• Incident Triage — ITIL v4 trained, on-call response, escalation management\n• MTTR Reduction — achieved 40% MTTR reduction at Cognizant\n• 99.9% uptime maintained across 3 production environments`,
  },
  {
    keys: ['experience', 'work', 'job', 'role', 'career', 'cognizant', 'youngmind', 'internbug'],
    a: `💼 Hanith's Professional Experience:\n\n🔵 DevOps & Cloud Engineer @ Cognizant (Jan 2024)\n   ITIL v4 incident management, Kubernetes orchestration, Terraform IaC, Grafana/CloudWatch dashboards — 99.9% uptime, MTTR ↓40%\n\n🟣 AI Engineer @ YoungMinds Technology Solutions (Jan 2023)\n   ML pipelines on AWS, Sign Language Detection published at ICAETC 2023, 30% toil reduction\n\n🟢 Software Developer @ Internbug Technologies (Jun 2022)\n   Cloud-native apps on Firebase, OAuth 2.0/JWT, GitHub Actions CI/CD`,
  },
  {
    keys: ['project', 'built', 'build', 'portfolio', 'finderly', 'llm', 'sign language', 'churn', 'spam', 'observ'],
    a: `🚀 Hanith's Key Projects:\n\n📡 AWS SRE Observability Stack (Flagship)\n   EKS + Terraform IaC, Prometheus/Grafana, 99.9% SLO, error budget alerts, zero-downtime deploys\n\n🔍 Finderly — Serverless Cloud-Native Platform\n   Firebase Cloud Functions, SLO-aligned CI/CD, OAuth 2.0 IAM, real-time distributed messaging\n\n🧠 LLM Evaluation Pipeline — MLOps Reliability\n   SLO scoring, Prometheus metrics, CI/CD rollback on SLO breach, drift detection\n\n🤟 Sign Language Detection (Published ICAETC 2023)\n   94% accuracy, <100ms p99 latency, Docker + Kubernetes-ready\n\n📊 Churn & Spam ML Pipelines\n   98% accuracy, SLA-backed REST API, A/B rollout, observability`,
  },
  {
    keys: ['education', 'degree', 'usf', 'university', 'college', 'master', 'ms', 'graduate', 'gpa', 'grade', 'study'],
    a: `🎓 Education:\n\n• M.S. Computer Science — University of South Florida, Tampa\n  2024–2026 | Courses: NLP, AI, Operating Systems, Computer Architecture, Theory of Algorithms\n  → Joining USF sparked Hanith's deep passion for AWS, SRE, and Cloud Infrastructure!\n\n• B.E. Computer Science — R.M.D Engineering College, Anna University\n  GPA: 8.60/10 | Cloud Computing, ML, AI, Data Structures, DBMS\n  4 Published Research Papers | Graduated May 2024`,
  },
  {
    keys: ['certif', 'cert', 'award', 'badge'],
    a: `🏅 Certifications:\n\n• AI for Everyone — Coursera / DeepLearning.AI\n• Cloud Foundation — Great Learning\n• Java Programming — Coursera\n• Agile & Scrum — Cognizant (Forage)\n\nHanith is actively working toward AWS Solutions Architect certification! ☁️`,
  },
  {
    keys: ['publication', 'research', 'paper', 'publish', 'journal', 'icaetc', 'scopus', 'stacksort'],
    a: `📄 4 Published Research Papers:\n\n1. 🤟 Sign Language Detection System\n   ICAETC 2023 Conference — 94% accuracy, <100ms real-time ASL detection\n\n2. 🌱 Deep Learning for Potato Leaf Disease Diagnosis\n   Int. Journal of Research in Engineering, Science & Management (Jul 2023) — 92% accuracy CNN\n\n3. 🌐 A Critical Study on the Dark Web & Dark Nets\n   Scopus-Indexed Journal — darknet analysis, cybersecurity threat vectors\n\n4. 🔢 STACKSORT Sorting Algorithm\n   Peer-reviewed Journal — novel sorting algorithm innovation`,
  },
  {
    keys: ['available', 'hire', 'open', 'seeking', 'looking', 'when', 'start', 'join'],
    a: `📅 Availability:\n\nHanith graduates with his M.S. CS from USF in May 2026 and is actively seeking full-time roles:\n\n✅ Target Roles: SRE · DevOps Engineer · Platform Engineer · Cloud Infrastructure Engineer\n📍 Location: Tampa, FL (open to relocation / remote)\n🗓️ Available: May 2026\n\nReach out at hanithpulimi6767@gmail.com — he'd love to connect!`,
  },
  {
    keys: ['contact', 'email', 'phone', 'reach', 'linkedin', 'connect', 'message'],
    a: `📬 Contact Hanith:\n\n📧 hanithpulimi6767@gmail.com\n📞 (813) 568-7329\n🔗 linkedin.com/in/hanith-reddy-pulimi-1a57b1299\n🐙 github.com/hanithpulimi\n📍 Tampa, FL 33613\n\nHe's actively looking for SRE/DevOps roles — don't hesitate to reach out!`,
  },
  {
    keys: ['roadmap', 'goal', 'plan', 'future', 'aspir', 'principal', 'senior'],
    a: `🗺️ Career Roadmap:\n\n✅ 2020–2024 — B.E. CS, 3 industry roles, 4 publications\n✅ 2024–now  — M.S. CS at USF, deepening AWS/SRE expertise\n🎯 May 2026  — Graduate, target SRE L4+ full-time role\n🚀 2027      — Senior SRE / Platform Engineer at a high-scale company\n🌐 2028+     — Principal Engineer, reliability architecture & leadership\n\nHanith's north star: building systems at 99.99% SLA for millions of users!`,
  },
  {
    keys: ['interest', 'passion', 'why sre', 'why cloud', 'why aws', 'motivation'],
    a: `💡 Why SRE & Cloud?\n\nHanith's interest in AWS, SRE, and Cloud Infrastructure was truly ignited when he joined his M.S. CS program at USF in 2024.\n\nSeeing how distributed systems fail — and how SRE principles like SLOs, error budgets, and chaos engineering keep them reliable — pushed him to specialise in production reliability.\n\nHe loves the challenge of building self-healing, fault-tolerant infrastructure that serves millions of users at scale! ☁️⚡`,
  },
]

const GREET = "Hey! I'm Hanith's Assistant 🐂 — ask me anything about his skills, experience, projects, education, or how to reach him. I know everything!"

const SUGGESTIONS = ['Skills', 'AWS & Cloud', 'Experience', 'Projects', 'Education', 'Contact', 'Available?', 'Publications']

export default function RockyBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: GREET }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [shake, setShake] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) return
    const timer = setInterval(() => {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }, 6000)
    return () => clearInterval(timer)
  }, [open])

  const findAnswer = query => {
    const q = query.toLowerCase()

    // Greetings
    if (/^(hi|hey|hello|sup|yo|howdy)/.test(q))
      return "Hey! 👋 I'm Hanith's Assistant. Ask me about his skills, projects, SRE experience, education, or anything else — I've got the full picture!"

    // Search QA
    for (const item of QA) {
      if (item.keys.some(k => q.includes(k))) return item.a
    }

    // Fallback
    return `Hmm, I'm not sure about that specific question 🤔\n\nTry asking about:\n• Skills & Tech Stack\n• AWS & Cloud experience\n• Projects\n• Education\n• Publications\n• Contact info\n\nOr email Hanith directly at hanithpulimi6767@gmail.com!`
  }

  const sendMessage = (text = input.trim()) => {
    if (!text) return
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { from: 'bot', text: findAnswer(text) }])
    }, 700 + Math.random() * 400)
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        animate={shake ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 500,
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #006747, #004d35)',
          border: '3px solid #CFC493',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 0 4px rgba(0,103,71,0.3), 0 8px 32px rgba(0,103,71,0.5)',
        }}
        title="Chat with Hanith's Assistant!"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FaTimes size={22} color="#CFC493" />
            </motion.span>
          ) : (
            <motion.span key="bull" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <RockyIcon size={40} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification badge */}
      {!open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'fixed', bottom: 100, right: 24, zIndex: 501,
            background: '#006747', border: '2px solid #CFC493',
            borderRadius: 12, padding: '6px 12px',
            fontSize: 12, fontWeight: 600, color: '#CFC493',
            whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,103,71,0.4)',
            fontFamily: 'JetBrains Mono',
          }}
        >
          💬 Hanith's Assistant
        </motion.div>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={{
              position: 'fixed', bottom: 104, right: 28, zIndex: 499,
              width: 'min(380px, calc(100vw - 32px))', height: 540,
              background: '#0d1f18',
              border: '1px solid #006747',
              borderRadius: 20,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(0,103,71,0.4), 0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #006747, #004d35)',
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '1px solid rgba(207,196,147,0.3)',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'rgba(207,196,147,0.15)',
                border: '2px solid #CFC493',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <RockyIcon size={34} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#CFC493' }}>Hanith's Assistant 🐂</div>
                <div style={{ fontSize: 11, color: 'rgba(207,196,147,0.65)', fontFamily: 'JetBrains Mono' }}>Ask me anything · Always online</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#CFC493', fontFamily: 'JetBrains Mono' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                live
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {msg.from === 'bot' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#006747', border: '1.5px solid #CFC493',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginRight: 8, alignSelf: 'flex-end',
                    }}>
                      <RockyIcon size={22} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '78%',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, #006747, #004d35)'
                      : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${msg.from === 'user' ? 'rgba(0,103,71,0.6)' : 'rgba(207,196,147,0.15)'}`,
                    borderRadius: msg.from === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#e8f5f0',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#006747', border: '1.5px solid #CFC493', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RockyIcon size={22} />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(207,196,147,0.15)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 7, height: 7, borderRadius: '50%', background: '#CFC493' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            <div style={{
              padding: '8px 12px',
              borderTop: '1px solid rgba(207,196,147,0.15)',
              display: 'flex', gap: 6, overflowX: 'auto',
              scrollbarWidth: 'none',
            }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    flexShrink: 0, padding: '5px 12px',
                    background: 'rgba(0,103,71,0.25)',
                    border: '1px solid rgba(207,196,147,0.25)',
                    borderRadius: 999, color: '#CFC493',
                    fontSize: 11, cursor: 'pointer', fontFamily: 'JetBrains Mono',
                    transition: 'background 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,103,71,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,103,71,0.25)'}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(207,196,147,0.15)',
              display: 'flex', gap: 8,
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about Hanith..."
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(0,103,71,0.5)',
                  borderRadius: 10, padding: '10px 14px',
                  color: '#e8f5f0', fontSize: 13, outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <motion.button
                onClick={() => sendMessage()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #006747, #004d35)',
                  border: '1px solid #CFC493',
                  color: '#CFC493', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <FaPaperPlane size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

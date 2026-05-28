import { useState, useEffect } from 'react'
import useMobile from '../hooks/useMobile'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import {
  FaLinkedin, FaEnvelope, FaChevronDown, FaAws,
  FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase,
  FaDownload, FaGithub,
} from 'react-icons/fa'

const ROLES = [
  'Site Reliability Engineer',
  'DevOps Engineer',
  'Cloud Infrastructure Engineer',
  'Platform Engineer',
]

function Typewriter({ words }) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const speed = deleting ? 38 : 72
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 2000)
        else setCharIdx(c => c + 1)
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(w => (w + 1) % words.length); setCharIdx(0) }
        else setCharIdx(c => c - 1)
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx, words])

  return (
    <span>
      <span style={{ color: 'var(--purple)', fontWeight: 700 }}>{text}</span>
      <span className="cursor" />
    </span>
  )
}

const INFO_ROWS = [
  { icon: FaMapMarkerAlt,  text: 'Tampa, FL 33613',                                       color: 'var(--cyan)' },
  { icon: FaGraduationCap, text: 'M.S. Computer Science · USF, May 2026 Graduate',        color: 'var(--purple)' },
  { icon: FaBriefcase,     text: 'Open to SRE / DevOps / Platform Engineer roles',        color: 'var(--purple)' },
  { icon: FaEnvelope,      text: 'hanithpulimi6767@gmail.com', color: 'var(--cyan)',       href: 'mailto:hanithpulimi6767@gmail.com' },
  { icon: FaPhone,         text: '(813) 568-7329',             color: 'var(--cyan)',       href: 'tel:+18135687329' },
  { icon: FaLinkedin,      text: 'linkedin.com/in/hanith-reddy-pulimi', color: 'var(--purple)', href: 'https://linkedin.com/in/hanith-reddy-pulimi-1a57b1299' },
]

const SOCIALS = [
  { href: 'https://linkedin.com/in/hanith-reddy-pulimi-1a57b1299', icon: FaLinkedin, label: 'LinkedIn' },
  { href: 'https://github.com/hanithpulimi',                        icon: FaGithub,   label: 'GitHub' },
  { href: 'mailto:hanithpulimi6767@gmail.com',                      icon: FaEnvelope, label: 'Email' },
  { href: 'tel:+18135687329',                                       icon: FaPhone,    label: 'Phone' },
]

export default function Hero() {
  const [imgError, setImgError] = useState(false)
  const isMobile = useMobile()

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        padding: '100px 24px 60px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Subtle green accent strip at very top */}
      <div className="usf-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <div className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
          gap: isMobile ? 28 : 56,
          alignItems: 'center',
        }}>

          {/* ── LEFT: Photo + Socials ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
          >
            {/* Photo */}
            <div className="hero-photo" style={{
              width: isMobile ? 150 : 220, height: isMobile ? 150 : 220,
              borderRadius: '50%',
              border: '3px solid var(--purple)',
              overflow: 'hidden',
              background: 'var(--bg-2)',
              boxShadow: '0 0 0 6px rgba(0,103,71,0.08), 0 4px 20px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}>
              {!imgError ? (
                <img
                  src="/hanith.jpg"
                  alt="Hanith Sai Kumar Reddy Pulimi"
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--purple-dim)', fontSize: 64, fontWeight: 900,
                  color: 'var(--purple)',
                }}>HP</div>
              )}
            </div>

            {/* Graduation badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 12, color: 'var(--purple)',
              fontFamily: 'JetBrains Mono', fontWeight: 600,
              padding: '5px 14px',
              background: 'var(--purple-dim)',
              border: '1px solid rgba(0,103,71,0.18)',
              borderRadius: 20,
              textAlign: 'center',
            }}>
              🎓 May 2026 Graduate · Seeking Roles
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  title={label}
                  style={{
                    width: 38, height: 38, borderRadius: 8,
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--purple-dim)'
                    e.currentTarget.style.borderColor = 'var(--purple)'
                    e.currentTarget.style.color = 'var(--purple)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-2)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            {/* Name + title */}
            <div>
              <h1 style={{
                fontSize: 'clamp(30px, 4.5vw, 48px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: 4,
              }}>
                Hanith Sai Kumar Reddy Pulimi
              </h1>
              <div style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: 8 }}>
                <Typewriter words={ROLES} />
              </div>
              <div style={{ height: 2, width: 56, background: 'var(--cyan)', borderRadius: 2, marginBottom: 16 }} />
            </div>

            {/* Bio */}
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: 600 }}>
              <strong style={{ color: 'var(--purple)' }}>May 2026 M.S. CS graduate</strong> from the University of South Florida.
              Joining the Masters program deepened my passion for <strong style={{ color: 'var(--purple)' }}>AWS, SRE, and Cloud Infrastructure</strong> —
              driving me to specialise in building <strong>self-healing, fault-tolerant</strong> distributed systems at production scale
              using <strong style={{ color: 'var(--cyan)' }}>Linux · Docker · Kubernetes · Terraform · Prometheus · Grafana</strong>.
            </p>

            {/* SRE Tech badge strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {[
                { label: 'Linux',       color: '#B8922A' },
                { label: 'Docker',      color: '#006747' },
                { label: 'Kubernetes',  color: '#006747' },
                { label: 'AWS',         color: '#B8922A' },
                { label: 'Terraform',   color: '#006747' },
                { label: 'Prometheus',  color: '#B8922A' },
                { label: 'Grafana',     color: '#006747' },
                { label: 'CI/CD',       color: '#B8922A' },
                { label: 'Helm',        color: '#006747' },
                { label: 'ArgoCD',      color: '#B8922A' },
              ].map(({ label, color }) => (
                <span key={label} style={{
                  padding: '3px 11px', borderRadius: 6, fontSize: 11,
                  fontFamily: 'JetBrains Mono', fontWeight: 600,
                  background: `${color}10`, color: color,
                  border: `1px solid ${color}30`,
                }}>
                  {label}
                </span>
              ))}
            </div>

            {/* Info rows */}
            <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {INFO_ROWS.map(({ icon: Icon, text, color, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={13} style={{ color, flexShrink: 0 }} />
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--purple)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >{text}</a>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="projects" smooth duration={700} offset={-80}>
                <button className="btn-primary">View Projects</button>
              </Link>
              <Link to="contact" smooth duration={700} offset={-80}>
                <button className="btn-outline">Get In Touch</button>
              </Link>
              <a href="/resume.pdf" download="Hanith_Pulimi_Resume.pdf" className="btn-outline"
                style={{ borderColor: 'var(--border-cyan)', color: 'var(--cyan)' }}>
                <FaDownload size={12} /> Resume
              </a>
            </div>

            {/* Stats strip */}
            <div className="hero-stats" style={{
              display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4,1fr)',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 10, overflow: 'hidden',
              maxWidth: isMobile ? '100%' : 480,
            }}>
              {[
                { label: 'Experience', value: '3+ yrs' },
                { label: 'Projects',   value: '10+' },
                { label: 'Publications', value: '4' },
                { label: 'Certs',      value: '4' },
              ].map(({ label, value }, i) => (
                <div key={i} style={{
                  padding: '13px 8px', textAlign: 'center',
                  borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--purple)' }}>{value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'JetBrains Mono' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono',
        }}
      >
        <span>scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <FaChevronDown size={12} />
        </motion.div>
      </motion.div>
    </section>
  )
}

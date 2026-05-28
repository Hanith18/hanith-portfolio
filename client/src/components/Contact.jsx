import { useState, useEffect } from 'react'
import useMobile from '../hooks/useMobile'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaEnvelope, FaLinkedin, FaMapMarkerAlt, FaPhone, FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

function Toast({ type, message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500)
    return () => clearTimeout(t)
  }, [onDismiss])

  const isSuccess = type === 'success'
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        style={{
          position: 'fixed', top: 88, right: 24, zIndex: 9000,
          background: isSuccess ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: 12, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          backdropFilter: 'blur(16px)',
          boxShadow: isSuccess
            ? '0 8px 32px rgba(16,185,129,0.2)'
            : '0 8px 32px rgba(239,68,68,0.2)',
          maxWidth: 360,
        }}
      >
        {isSuccess
          ? <FaCheckCircle size={18} style={{ color: '#006747', flexShrink: 0 }} />
          : <FaTimesCircle size={18} style={{ color: '#B8922A', flexShrink: 0 }} />}
        <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{message}</span>
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
        >×</button>
      </motion.div>
    </AnimatePresence>
  )
}

const CONTACT_INFO = [
  { icon: FaEnvelope, label: 'Email', value: 'hanithpulimi6767@gmail.com', href: 'mailto:hanithpulimi6767@gmail.com', color: '#B8922A' },
  { icon: FaPhone, label: 'Phone', value: '(813) 568-7329', href: 'tel:+18135687329', color: '#006747' },
  { icon: FaLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/hanith-reddy-pulimi', href: 'https://linkedin.com/in/hanith-reddy-pulimi-1a57b1299', color: '#006747' },
  { icon: FaMapMarkerAlt, label: 'Location', value: 'Tampa, FL 33613', href: null, color: '#006747' },
]

export default function Contact() {
  const isMobile = useMobile()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [toast, setToast] = useState(null) // { type, message }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
        setToast({ type: 'success', message: "Message sent! I'll get back to you within 24 hours." })
      } else {
        setStatus('error')
        setToast({ type: 'error', message: 'Failed to send. Please email me directly at hanithpulimi6767@gmail.com' })
      }
    } catch {
      setStatus('error')
      setToast({ type: 'error', message: 'Network error. Please email me at hanithpulimi6767@gmail.com' })
    }
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <>
    {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}
    <section id="contact" className="section-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Background photo ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(/contact-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        filter: 'brightness(0.35) saturate(0.7)',
      }} />

      {/* ── Dark gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(8,12,8,0.72) 0%, rgba(4,20,12,0.82) 50%, rgba(0,10,6,0.92) 100%)',
      }} />

      {/* ── USF green top stripe ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 2,
        background: 'linear-gradient(to right, transparent, #006747, #B8922A, #006747, transparent)',
        boxShadow: '0 0 12px rgba(0,103,71,0.5)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 3 }}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Get In Touch</div>
            <h2 className="section-title">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', fontSize: 16 }}>
              Open to SRE / DevOps / Platform Engineer roles — graduating May 2026.
              Let's talk reliability engineering.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36 }}>
            {/* Contact info */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="glass-card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ready to Build Together?</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
                  Whether you're looking to hire a reliable SRE, collaborate on a cloud project, or discuss
                  distributed systems architecture — I'm always open to interesting conversations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: `${color}15`, border: `1px solid ${color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={17} style={{ color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{label}</div>
                        {href ? (
                          <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = color}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                          >
                            {value}
                          </a>
                        ) : (
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability card */}
              <div className="glass-card" style={{ padding: '22px 24px', borderColor: 'rgba(16,185,129,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 10, height: 10, background: '#006747', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #006747', animation: 'pulseGlow 2s ease-in-out infinite' }} />
                  <span style={{ fontWeight: 700, color: '#006747' }}>Available for Opportunities</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Graduating <strong style={{ color: 'var(--text)' }}>May 2026</strong>. Actively seeking full-time
                  SRE / DevOps / Platform Engineer positions in the US.
                </p>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: '32px 28px' }}>
              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 20px' }}
                >
                  <FaCheckCircle size={56} style={{ color: '#006747', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Thanks for reaching out. I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Send a Message</h3>

                  <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
                    <div className="form-field">
                      <input
                        type="text" name="name" value={form.name}
                        onChange={handleChange} placeholder=" " required
                        style={{ width: '100%' }}
                      />
                      <label>Your Name</label>
                    </div>
                    <div className="form-field">
                      <input
                        type="email" name="email" value={form.email}
                        onChange={handleChange} placeholder=" " required
                      />
                      <label>Email Address</label>
                    </div>
                  </div>

                  <div className="form-field">
                    <input
                      type="text" name="subject" value={form.subject}
                      onChange={handleChange} placeholder=" " required
                    />
                    <label>Subject</label>
                  </div>

                  <div className="form-field">
                    <textarea
                      name="message" value={form.message}
                      onChange={handleChange} placeholder=" " required
                      rows={5}
                    />
                    <label>Message</label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 15, opacity: status === 'sending' ? 0.7 : 1 }}
                  >
                    <FaPaperPlane size={15} />
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

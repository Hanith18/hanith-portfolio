import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const NAV_LINKS = [
  { label: 'About',      to: 'about' },
  { label: 'Skills',     to: 'skills' },
  { label: 'Experience', to: 'experience' },
  { label: 'Projects',   to: 'projects' },
  { label: 'Gallery',    to: 'gallery' },
  { label: 'Roadmap',    to: 'roadmap' },
  { label: 'Contact',    to: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [active, setActive]     = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg)',
        borderBottom: scrolled
          ? '1px solid var(--border-strong)'
          : '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
    >
      {/* USF green accent stripe at the very top */}
      <div style={{ height: 3, background: 'linear-gradient(to right, var(--purple), var(--purple-light), var(--cyan))', position: 'absolute', top: 0, left: 0, right: 0 }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo — name only, clean */}
        <Link to="hero" smooth duration={600} style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* USF-green initial square */}
            <div style={{
              width: 32, height: 32, borderRadius: 7,
              background: 'var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 14,
              letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif',
              flexShrink: 0,
            }}>HP</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              Hanith Pulimi
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6, fontSize: 13 }}>
                · SRE
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop" style={{ gap: 4 }}>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              smooth
              duration={600}
              offset={-70}
              spy
              onSetActive={() => setActive(to)}
              onSetInactive={() => setActive(a => a === to ? '' : a)}
              style={{
                fontSize: 13.5,
                fontWeight: active === to ? 700 : 500,
                cursor: 'pointer',
                color: active === to ? 'var(--purple)' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 6,
                background: active === to ? 'var(--purple-dim)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
                display: 'block',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                if (active !== to) {
                  e.currentTarget.style.color = 'var(--purple)'
                  e.currentTarget.style.background = 'var(--purple-dim)'
                }
              }}
              onMouseLeave={e => {
                if (active !== to) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="mailto:hanithpulimi6767@gmail.com"
            className="btn-primary"
            style={{ padding: '7px 18px', fontSize: 13, marginLeft: 8, borderRadius: 7 }}
          >
            Hire Me
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="nav-mobile-btn">
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 7, padding: '6px 8px',
              color: 'var(--text)', cursor: 'pointer', fontSize: 20,
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {open ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>


      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--bg)',
              borderTop: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              padding: '12px 24px 20px',
              overflow: 'hidden',
            }}
          >
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                smooth
                duration={600}
                offset={-70}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '11px 0',
                  color: 'var(--text-secondary)', fontSize: 15,
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
            <a
              href="mailto:hanithpulimi6767@gmail.com"
              className="btn-primary"
              style={{ marginTop: 16, width: '100%', justifyContent: 'center', fontSize: 14 }}
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

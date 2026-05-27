import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import SREDashboard from './components/SREDashboard'
import SkillConstellation from './components/SkillConstellation'
import Projects from './components/Projects'
import Publications from './components/Publications'
import Certifications from './components/Certifications'
import Gallery from './components/Gallery'
import Roadmap from './components/Roadmap'
import Contact from './components/Contact'
import RockyBot from './components/RockyBot'
import SplashScreen from './components/SplashScreen'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import CustomCursor from './components/CustomCursor'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      <CustomCursor />
      <SplashScreen onDone={() => setSplashDone(true)} />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <SREDashboard />
        <SkillConstellation />
        <Projects />
        <Publications />
        <Certifications />
        <Gallery />
        <Roadmap />
        <Contact />
      </main>
      <RockyBot />
      <BackToTop />
      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-2)',
        padding: '40px 24px',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {/* Name + credentials */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              Hanith Sai Kumar Reddy Pulimi
            </div>
            <div style={{ fontSize: 13, color: 'var(--purple)', fontFamily: 'JetBrains Mono', marginTop: 3, fontWeight: 600 }}>
              Site Reliability Engineer · M.S. CS, USF
            </div>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { href: 'https://github.com/hanithpulimi',                        icon: FaGithub,   label: 'GitHub' },
              { href: 'https://linkedin.com/in/hanith-reddy-pulimi-1a57b1299', icon: FaLinkedin, label: 'LinkedIn' },
              { href: 'mailto:hanithpulimi6767@gmail.com',                      icon: FaEnvelope, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                title={label}
                style={{
                  width: 36, height: 36, borderRadius: 7,
                  background: '#fff',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--purple)'
                  e.currentTarget.style.borderColor = 'var(--purple)'
                  e.currentTarget.style.background = 'var(--purple-dim)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = '#fff'
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            Tampa, FL · {new Date().getFullYear()} · All rights reserved
          </div>
        </div>
      </footer>
    </>
  )
}

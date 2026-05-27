import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase]   = useState(0)  // 0=bg | 1=name | 2=sub | 3=hold | 4=exit
  const [gone, setGone]     = useState(false)

  useEffect(() => {
    const ts = []
    ts.push(setTimeout(() => setPhase(1), 400))   // bg in → show name
    ts.push(setTimeout(() => setPhase(2), 1100))  // show PORTFOLIO
    ts.push(setTimeout(() => setPhase(3), 1800))  // hold
    ts.push(setTimeout(() => setPhase(4), 2800))  // start exit
    ts.push(setTimeout(() => { setGone(true); onDone?.() }, 3500))
    return () => ts.forEach(clearTimeout)
  }, [])

  if (gone) return null

  const isExiting = phase === 4

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer' }}
      onClick={() => { setGone(true); onDone?.() }}
    >
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
          >
            {/* ── Background photo ── */}
            <motion.div
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/splash-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />

            {/* ── Dark gradient overlay so text pops ── */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.80) 100%)',
            }} />

            {/* ── USF green bottom strip ── */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
              background: 'linear-gradient(to right, #006747, #B8922A, #006747)',
            }} />

            {/* ── Center text ── */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 0,
            }}>

              {/* HANITH'S — letter by letter */}
              {phase >= 1 && (
                <div style={{
                  display: 'flex', alignItems: 'baseline',
                  gap: 'clamp(2px, 0.8vw, 10px)',
                  lineHeight: 1,
                }}>
                  {"HANITH'S".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        delay: i * 0.07,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        fontSize: 'clamp(52px, 13vw, 148px)',
                        fontWeight: 900,
                        fontFamily: '"Inter", "Arial Black", sans-serif',
                        color: char === "'" ? '#B8922A' : '#ffffff',
                        letterSpacing: '-0.03em',
                        display: 'inline-block',
                        // Text stroke for crispness
                        WebkitTextStroke: char === "'" ? '0px' : '1px rgba(255,255,255,0.15)',
                        textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)',
                        lineHeight: 1,
                      }}
                    >
                      {char === ' ' ? ' ' : char}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* PORTFOLIO — slide up */}
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      marginTop: 'clamp(4px, 1.2vw, 14px)',
                      display: 'flex', alignItems: 'center', gap: 16,
                    }}
                  >
                    {/* Left line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      style={{
                        height: 2, width: 'clamp(30px, 6vw, 80px)',
                        background: 'linear-gradient(to right, transparent, #B8922A)',
                        transformOrigin: 'right',
                      }}
                    />

                    <span style={{
                      fontSize: 'clamp(13px, 3vw, 34px)',
                      fontWeight: 300,
                      fontFamily: '"Inter", sans-serif',
                      color: '#ffffff',
                      letterSpacing: '0.5em',
                      textTransform: 'uppercase',
                      paddingLeft: '0.5em',
                      textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                    }}>
                      Portfolio
                    </span>

                    {/* Right line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      style={{
                        height: 2, width: 'clamp(30px, 6vw, 80px)',
                        background: 'linear-gradient(to left, transparent, #B8922A)',
                        transformOrigin: 'left',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tagline */}
              <AnimatePresence>
                {phase >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                      marginTop: 'clamp(12px, 2.5vw, 28px)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 'clamp(9px, 1.4vw, 14px)',
                      color: 'rgba(255,255,255,0.55)',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Site Reliability Engineer &nbsp;·&nbsp; USF, May 2026
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Skip hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5 }}
              style={{
                position: 'absolute', bottom: 28, left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'JetBrains Mono', fontSize: 10,
                color: '#ffffff', letterSpacing: '0.15em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}
            >
              click anywhere to skip
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Blast-door exit ── */}
      {isExiting && (
        <>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              backgroundImage: 'url(/splash-bg.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center top',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #006747, #B8922A, #006747, transparent)', boxShadow: '0 0 12px rgba(0,103,71,0.7)' }} />
          </motion.div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
              backgroundImage: 'url(/splash-bg.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center bottom',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #006747, #B8922A, #006747, transparent)', boxShadow: '0 0 12px rgba(0,103,71,0.7)' }} />
          </motion.div>
        </>
      )}
    </div>
  )
}

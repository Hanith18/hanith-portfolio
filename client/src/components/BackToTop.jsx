import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronUp } from 'react-icons/fa'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollToTop}
          title="Back to top"
          style={{
            position: 'fixed',
            bottom: 104,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(8,8,18,0.9)',
            border: '1px solid var(--border)',
            color: 'var(--purple-light)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            zIndex: 900,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'border-color 0.25s, box-shadow 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(67,56,202,0.6)'
            e.currentTarget.style.boxShadow = 'var(--glow-purple)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'
          }}
        >
          <FaChevronUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

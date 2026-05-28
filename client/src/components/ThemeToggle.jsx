import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 38, height: 38,
        borderRadius: 9,
        border: '1px solid var(--border-strong)',
        background: dark ? 'rgba(0,200,130,0.08)' : 'var(--bg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          style={{ fontSize: 17, lineHeight: 1, display: 'block' }}
        >
          {dark ? '☀️' : '🌙'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 3,
        background: 'linear-gradient(to right, var(--purple), var(--cyan))',
        transformOrigin: '0%',
        scaleX,
        zIndex: 998,
        boxShadow: '0 0 10px rgba(217, 119, 6, 0.5)',
      }}
    />
  )
}

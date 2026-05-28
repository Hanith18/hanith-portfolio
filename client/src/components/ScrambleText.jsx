import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

/**
 * ScrambleText — reveals text with a character-scramble effect when scrolled into view.
 * Props:
 *   text     – the final string to display
 *   as       – element tag (default 'span')
 *   speed    – ms between frames (default 35)
 *   delay    – ms before start (default 0)
 *   style    – extra inline styles
 *   className
 */
export default function ScrambleText({ text, as: Tag = 'span', speed = 35, delay = 0, style, className }) {
  const [display, setDisplay] = useState(text)
  const frameRef  = useRef(null)
  const startRef  = useRef(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    const chars = text.split('')
    const revealed = new Array(chars.length).fill(false)
    let frameCount = 0

    function tick() {
      // Reveal one more real character per 3 frames
      if (frameCount % 3 === 0) {
        const nextHidden = revealed.findIndex(r => !r)
        if (nextHidden !== -1) revealed[nextHidden] = true
      }
      frameCount++

      const current = chars.map((ch, i) => {
        if (revealed[i]) return ch
        if (ch === ' ') return ' '
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      setDisplay(current.join(''))

      if (revealed.every(Boolean)) return
      frameRef.current = setTimeout(tick, speed)
    }

    const t = setTimeout(tick, delay)
    return () => { clearTimeout(t); clearTimeout(frameRef.current) }
  }, [inView, text, speed, delay])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        display: 'inline',
        ...style,
      }}
    >
      {display}
    </Tag>
  )
}

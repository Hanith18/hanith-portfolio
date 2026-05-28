/**
 * NoiseOverlay — subtle SVG grain texture fixed over the entire page.
 * Adds depth and a premium "printed" feel popular in 2025 design.
 * Completely non-interactive (pointer-events: none).
 */
export default function NoiseOverlay() {
  return (
    <div
      className="no-theme-transition"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 'var(--noise-opacity, 0.03)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 180px',
        animation: 'grainShift 0.8s steps(1) infinite',
        mixBlendMode: 'overlay',
      }}
    />
  )
}

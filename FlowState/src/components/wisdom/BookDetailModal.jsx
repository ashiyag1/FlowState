import { useRef, useState, useCallback, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useWisdom } from '../../context/WisdomContext'
import pageBg from '../../assets/page.png'

const easeBack = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export default function BookDetailModal({ book, onClose, initialPage = 0 }) {
  const { dark } = useTheme()
  const { updateBookProgress } = useWisdom()
  const pages = book.pages || []

  const [idx, setIdx] = useState(initialPage)
  const [angle, setAngle] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // mutable refs for gesture tracking
  const stateRef = useRef({ flip: 'idle' }) // idle | dragging | animating
  const startX = useRef(0)
  const startY = useRef(0)
  const dragDir = useRef(1) // 1 forward, -1 backward
  const rafId = useRef(null)
  const bookEl = useRef(null)

  // clean up raf
  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current) }, [])

  useEffect(() => {
    updateBookProgress(book.id, idx)
  }, [idx, book.id, updateBookProgress])

  const goTo = useCallback((nextIdx) => {
    setIdx(nextIdx)
    setAngle(0)
    stateRef.current.flip = 'idle'
    setIsAnimating(false)
  }, [])

  const animate = useCallback((from, to, dur, onDone) => {
    const t0 = performance.now()
    stateRef.current.flip = 'animating'
    setIsAnimating(true)

    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      const eased = p < 1 ? 1 - Math.pow(1 - p, 3) : 1
      const extra = p < 1 ? 0 : 4 * (1 - easeBack(Math.min(1, (now - t0 - dur) / 100)))

      const val = from + (to - from) * eased + extra
      setAngle(Math.max(-180, Math.min(180, val)))

      if (p < 1 || now - t0 < dur + 100) {
        rafId.current = requestAnimationFrame(step)
      } else {
        setAngle(to)
        onDone()
      }
    }
    rafId.current = requestAnimationFrame(step)
  }, [])

  const flipForward = useCallback(() => {
    if (idx >= pages.length - 1) return
    animate(angle, -180, 400, () => goTo(idx + 1))
  }, [idx, pages.length, angle, animate, goTo])

  const flipBackward = useCallback(() => {
    if (idx <= 0) return
    animate(angle, 180, 400, () => goTo(idx - 1))
  }, [idx, angle, animate, goTo])

  const snapBack = useCallback(() => {
    animate(angle, 0, 300, () => {
      stateRef.current.flip = 'idle'
      setIsAnimating(false)
      setAngle(0)
    })
  }, [angle, animate])

  const onDown = useCallback((e) => {
    if (stateRef.current.flip !== 'idle') return
    startX.current = e.clientX
    startY.current = e.clientY
    stateRef.current.flip = 'ready'
    dragDir.current = 1
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
    ;(e.target).setPointerCapture(e.pointerId)
  }, [])

  const onMove = useCallback((e) => {
    const s = stateRef.current.flip
    if (s !== 'ready' && s !== 'dragging') return

    const dx = e.clientX - startX.current
    const dy = Math.abs(e.clientY - startY.current)

    if (s === 'ready') {
      if (Math.abs(dx) < 8 || dy > Math.abs(dx) * 0.5) return
      dragDir.current = dx < 0 ? 1 : -1 // left drag = forward, right drag = backward
      if (dragDir.current === 1 && idx >= pages.length - 1) return
      if (dragDir.current === -1 && idx <= 0) return
      stateRef.current.flip = 'dragging'
    }

    const rect = bookEl.current?.getBoundingClientRect()
    if (!rect) return
    const pw = rect.width * 0.8
    const raw = -(dx / pw) * 180
    let a
    if (dragDir.current === 1) {
      a = Math.max(-180, Math.min(0, raw))
    } else {
      a = Math.min(180, Math.max(0, raw))
    }
    if (Math.abs(a) < 1) a = 0
    setAngle(a)
  }, [idx, pages.length])

  const onUp = useCallback((e) => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    try { (e.target).releasePointerCapture(e.pointerId) } catch {}

    if (stateRef.current.flip === 'ready') {
      stateRef.current.flip = 'idle'
      // tap — detect which side
      const rect = bookEl.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left) / rect.width
      if (x > 0.65 && idx < pages.length - 1) flipForward()
      else if (x < 0.35 && idx > 0) flipBackward()
      return
    }

    if (stateRef.current.flip !== 'dragging') return
    const progress = Math.abs(angle) / 180
    if (progress > 0.3 && idx > 0 && idx < pages.length - 1) {
      // prevent rapid re-entry
      // rely on flipForward / flipBackward to set state
    }
    if (progress > 0.35) {
      if (dragDir.current === 1 && idx < pages.length - 1) { flipForward(); return }
      if (dragDir.current === -1 && idx > 0) { flipBackward(); return }
    }
    snapBack()
  }, [angle, idx, pages.length, flipForward, flipBackward, snapBack])

  // keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && idx < pages.length - 1) flipForward()
      if (e.key === 'ArrowLeft' && idx > 0) flipBackward()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [idx, pages.length, onClose, flipForward, flipBackward])

  const cur = pages[idx]
  const next = pages[idx + 1]
  const prev = pages[idx - 1]
  const isTurning = stateRef.current.flip !== 'idle' || isAnimating
  const flipPct = Math.abs(angle) / 180
  const showBack = dragDir.current === 1 && angle < -90

  const s = styles(dark)

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>

        <div style={s.header}>
          {book.image && <img src={book.image} alt="" style={s.headerImg} />}
          <div>
            <h2 style={s.title}>{book.title}</h2>
            <p style={s.scripture}>{book.scripture}</p>
          </div>
        </div>

        <div style={s.progressWrap}>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${((idx + 1) / pages.length) * 100}%` }} />
          </div>
          <span style={s.progressLabel}>{idx + 1} / {pages.length}</span>
        </div>

        <div ref={bookEl} style={s.bookArea}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* Page thickness stack on right edge */}
          {pages.length - idx > 1 && !isTurning && (
            <div style={s.thicknessStack}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ ...s.thickLayer, left: -1 - i * 1.2, zIndex: -i - 2 }} />
              ))}
            </div>
          )}

          {/* Under page (next content, revealed during forward flip) */}
          {next && isTurning && dragDir.current === 1 && (
            <div style={{ ...s.page, ...s.pageUnder, zIndex: 6 }}>
              <div style={s.pageBg} />
              <div style={s.pageInner}>
                <h3 style={s.pageHead}>{next.heading}</h3>
                <div style={s.pageText}>{next.text}</div>
                <div style={s.pageNum}>{idx + 2}</div>
              </div>
            </div>
          )}

          {/* Under page (prev content, revealed during backward flip) */}
          {prev && isTurning && dragDir.current === -1 && (
            <div style={{ ...s.page, ...s.pageUnder, zIndex: 6 }}>
              <div style={s.pageBg} />
              <div style={s.pageInner}>
                <h3 style={s.pageHead}>{prev.heading}</h3>
                <div style={s.pageText}>{prev.text}</div>
                <div style={s.pageNum}>{idx}</div>
              </div>
            </div>
          )}

          {/* Spine shadow */}
          {isTurning && (
            <div style={{ ...s.spineShadow, opacity: Math.min(1, flipPct * 2) }} />
          )}

          {/* Flipping page */}
          <div style={{
            ...s.page,
            ...s.flipper,
            transform: `perspective(1500px) rotateY(${angle}deg)`,
            zIndex: 10,
            pointerEvents: isTurning ? 'none' : 'auto',
          }}>
            <div style={s.pageBg} />

            {/* Front face */}
            <div style={{ ...s.pageInner, ...s.face, opacity: showBack ? 0 : 1 }}>
              {cur && (
                <>
                  <h3 style={s.pageHead}>{cur.heading}</h3>
                  <div style={s.pageText}>{cur.text}</div>
                  <div style={s.pageNum}>{idx + 1}</div>
                </>
              )}
            </div>

            {/* Back face */}
            <div style={{ ...s.pageInner, ...s.face, ...s.backFace, opacity: showBack ? 1 : 0 }}>
              {next && (
                <>
                  <h3 style={s.pageHead}>{next.heading}</h3>
                  <div style={s.pageText}>{next.text}</div>
                  <div style={s.pageNum}>{idx + 2}</div>
                </>
              )}
            </div>

            {/* Curl shadow */}
            <div style={{ ...s.curlShadow, opacity: flipPct * 0.5 }} />
          </div>

          {/* Drop shadow on turning page */}
          {isTurning && (
            <div style={{ ...s.dropShadow, opacity: flipPct * 0.3, transform: `translateX(${flipPct * 5}px)` }} />
          )}

          {/* Static left page (previous page) */}
          {prev && !isTurning && (
            <div style={{ ...s.page, ...s.leftPage, zIndex: 2 }}>
              <div style={s.pageBg} />
              <div style={s.pageInner}>
                <h3 style={s.pageHead}>{prev.heading}</h3>
                <div style={s.pageText}>{prev.text}</div>
                <div style={s.pageNum}>{idx}</div>
              </div>
            </div>
          )}

          {/* Spine line */}
          <div style={s.spineLine} />

          {/* Tappable prev/next zones */}
          {!isTurning && idx > 0 && <div style={{ ...s.touch, ...s.touchL }} />}
          {!isTurning && idx < pages.length - 1 && <div style={{ ...s.touch, ...s.touchR }} />}
        </div>

        <div style={s.footer}>
          <p style={s.verse}>{book.sampleVerse}</p>
        </div>
      </div>
    </div>
  )
}

const C = '#c9a84c'

const styles = (dark) => ({
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  },
  modal: {
    background: dark ? '#1a1208' : '#faf3e0',
    borderRadius: '16px', maxWidth: '520px', width: '100%',
    maxHeight: '88vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    border: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '10px', right: '10px',
    width: '30px', height: '30px', borderRadius: '50%', border: 'none',
    background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    cursor: 'pointer', fontSize: '0.95rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: dark ? '#c9b080' : '#5c3d1e', zIndex: 10,
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '1.25rem 1.5rem 0.3rem', flexShrink: 0,
  },
  headerImg: { width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' },
  title: {
    margin: 0, fontSize: '1.1rem',
    fontFamily: '"Cinzel", serif',
    color: dark ? '#e8d9b5' : '#5c3d1e',
  },
  scripture: {
    margin: '0.1rem 0 0', fontSize: '0.72rem',
    color: dark ? '#c9b080' : '#8b6914',
    fontStyle: 'italic', fontFamily: '"Lora", serif',
  },
  progressWrap: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.3rem 1.5rem', flexShrink: 0,
  },
  progressTrack: {
    flex: 1, height: '3px',
    background: dark ? '#3a2a10' : '#e0d0b0', borderRadius: '2px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: `linear-gradient(90deg, ${C}, #8b6914)`,
    borderRadius: '2px', transition: 'width 0.35s ease',
  },
  progressLabel: {
    fontSize: '0.62rem', color: dark ? '#8a7a60' : '#a09070',
    fontFamily: 'monospace', minWidth: '40px', textAlign: 'right',
  },

  // ── BOOK ──
  bookArea: {
    position: 'relative', flex: 1, minHeight: '160px', margin: '0 1.25rem',
    borderRadius: '4px', overflow: 'hidden', cursor: 'grab',
    touchAction: 'none', userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  page: {
    position: 'absolute', inset: 0,
    borderRadius: '3px', overflow: 'hidden',
    background: dark ? '#2a1e10' : '#fcf6e8',
    boxShadow: dark
      ? '0 1px 4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(201,168,76,0.06)'
      : '0 1px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(201,168,76,0.08)',
  },
  pageUnder: { zIndex: 5 },
  leftPage: {
    right: '50%',
    borderRight: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
  },
  flipper: {
    zIndex: 10, transformStyle: 'preserve-3d',
    transformOrigin: 'left center',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  },
  pageBg: {
    position: 'absolute', inset: 0,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: 'cover', backgroundPosition: 'center',
    opacity: dark ? 0.1 : 0.15, pointerEvents: 'none',
  },
  pageInner: {
    position: 'relative', padding: '1.25rem 1.25rem 0.75rem',
    display: 'flex', flexDirection: 'column', height: '100%',
    boxSizing: 'border-box',
  },
  face: {
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
  },
  backFace: {
    transform: 'rotateY(180deg)',
    position: 'absolute', inset: 0, padding: '1.25rem 1.25rem 0.75rem',
  },
  pageHead: {
    fontSize: '0.9rem', fontFamily: '"Cinzel", serif',
    color: dark ? '#e8d9b5' : '#5c3d1e',
    margin: '0 0 0.4rem', textAlign: 'center', flexShrink: 0,
    letterSpacing: '0.02em',
  },
  pageText: {
    fontSize: '0.78rem', fontFamily: '"Lora", serif',
    color: dark ? '#d4c9a0' : '#4a3a20',
    lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line', flex: 1,
    overflowY: 'auto',
  },
  pageNum: {
    textAlign: 'center', fontSize: '0.58rem',
    color: dark ? '#8a7a60' : '#a09070', marginTop: '0.5rem',
    fontFamily: 'serif', fontStyle: 'italic', flexShrink: 0,
  },

  // ── DEPTH EFFECTS ──
  curlShadow: {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
    background: 'linear-gradient(270deg, rgba(0,0,0,0.2) 0%, transparent 45%)',
  },
  dropShadow: {
    position: 'absolute', left: '100%', top: '1%', bottom: '1%', width: '18px',
    background: 'linear-gradient(270deg, rgba(0,0,0,0.15), transparent)',
    zIndex: 4, pointerEvents: 'none',
  },
  spineShadow: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px',
    background: 'linear-gradient(270deg, transparent, rgba(0,0,0,0.1))',
    zIndex: 7, pointerEvents: 'none',
  },
  thicknessStack: {
    position: 'absolute', right: '-1px', top: '2px', bottom: '2px', zIndex: 8,
    pointerEvents: 'none',
  },
  thickLayer: {
    position: 'absolute', top: 0, bottom: 0, width: '2px',
    background: dark ? '#3a2a10' : '#e8ddd0',
    borderRadius: '0 1px 1px 0',
    borderRight: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
  },
  spineLine: {
    position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px',
    background: dark ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.1)',
    zIndex: 3, pointerEvents: 'none',
  },

  // ── TOUCH ──
  touch: {
    position: 'absolute', top: 0, bottom: 0, width: '28%', zIndex: 20,
    cursor: 'pointer',
  },
  touchL: { left: 0 },
  touchR: { right: 0 },

  // ── FOOTER ──
  footer: { padding: '0.4rem 1.5rem 0.8rem', flexShrink: 0 },
  verse: {
    margin: 0, fontSize: '0.7rem',
    color: dark ? '#8a7a60' : '#8b6914',
    fontStyle: 'italic', textAlign: 'center',
    fontFamily: '"Lora", serif', lineHeight: 1.4,
  },
})
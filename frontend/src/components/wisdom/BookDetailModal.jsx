import { useRef, useState, useCallback, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useWisdom } from '../../context/WisdomContext'
import { useAchievements } from '../../context/AchievementsContext'
import html2canvas from 'html2canvas'
import pageBg from '../../assets/page.webp'

const easeBack = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export default function BookDetailModal({ book, onClose, initialPage = 0 }) {
  const { dark } = useTheme()
  const { updateBookProgress, savePage, removeSavedPage, isPageSaved, addNote, removeNote, getPageNotes } = useWisdom()
  const { trackEvent } = useAchievements()
  const [liked, setLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFemale, setIsFemale] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [previewBlob, setPreviewBlob] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleClosePreview = useCallback(() => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage)
      setPreviewImage(null)
    }
    setPreviewBlob(null)
    setCopied(false)
  }, [previewImage])

  const [stickyOpen, setStickyOpen] = useState(false)
  const [stickyText, setStickyText] = useState('')
  const [stickyColor, setStickyColor] = useState('#FFD43B')
  const shareRef = useRef(null)
  const cardRef = useRef(null)
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
  const hadVertical = useRef(false)

  // ── SPEECH SYNTHESIS ──
  const speak = useCallback((text, female) => {
    if (!text) return
    window.speechSynthesis.cancel()

    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    u.pitch = female ? 0.93 : 0.82

    const voices = window.speechSynthesis.getVoices()
    const isIndia = v => /india/i.test(v.name)
    const isKnownFemale = v => /female|heera|priya|neerja|zira|samantha|aria/i.test(v.name)
    const isKnownMale = v => /male|david|guy|mark|prabhat/i.test(v.name)

    const v = female
      ? voices.find(v => isIndia(v) && isKnownFemale(v))
        || voices.find(v => isKnownFemale(v))
        || voices.find(v => v.name.includes('Google UK English Female'))
        || voices.find(v => v.name.includes('Google US English Female'))
        || voices[0]
      : voices.find(v => isIndia(v) && !isKnownFemale(v))
        || voices.find(v => isKnownMale(v))
        || voices.find(v => v.name.includes('Google UK English Male'))
        || voices.find(v => v.name.includes('Google US English Male'))
        || voices[0]
    if (v) u.voice = v

    window.speechSynthesis.speak(u)
  }, [])

  // load voices
  useEffect(() => {
    const h = () => { window.speechSynthesis.getVoices() }
    window.speechSynthesis.addEventListener('voiceschanged', h)
    h()
    return () => window.speechSynthesis.removeEventListener('voiceschanged', h)
  }, [])

  // cancel speech on unmount
  useEffect(() => () => window.speechSynthesis.cancel(), [])

  useEffect(() => {
    trackEvent('book_opened', { bookId: book.id })
  }, [book.id, trackEvent])

  // refs for auto-read on page turn
  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying
  const isFemaleRef = useRef(isFemale)
  isFemaleRef.current = isFemale

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
    hadVertical.current = false
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
      if (dy > Math.abs(dx) * 0.5) { hadVertical.current = true; return }
      if (Math.abs(dx) < 8) return
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

  const resetGesture = useCallback(() => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    stateRef.current.flip = 'idle'
  }, [])

  const onUp = useCallback((e) => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    try { (e.target).releasePointerCapture(e.pointerId) } catch {}

    if (stateRef.current.flip === 'ready') {
      stateRef.current.flip = 'idle'
      if (hadVertical.current) return // was a scroll, not a tap
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
    if (progress > 0.35) {
      if (dragDir.current === 1 && idx < pages.length - 1) { flipForward(); return }
      if (dragDir.current === -1 && idx > 0) { flipBackward(); return }
    }
    snapBack()
  }, [angle, idx, pages.length, flipForward, flipBackward, snapBack])

  const onCancel = useCallback(() => {
    resetGesture()
  }, [resetGesture])

  // close share dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShowShare(false)
    }
    if (showShare) {
      setTimeout(() => document.addEventListener('click', h), 0)
      return () => document.removeEventListener('click', h)
    }
  }, [showShare])

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

  // ── SPEECH: auto-read on page turn, play/pause, voice toggle ──
  useEffect(() => {
    if (isPlayingRef.current && cur) {
      speak(`${cur.heading}. ${cur.text}`, isFemaleRef.current)
    }
  }, [idx]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      if (cur) speak(`${cur.heading}. ${cur.text}`, isFemale)
    }
  }, [isPlaying, cur, isFemale, speak])

  const toggleVoice = useCallback(() => {
    const next = !isFemale
    setIsFemale(next)
    if (isPlaying && cur) speak(`${cur.heading}. ${cur.text}`, next)
  }, [isPlaying, cur, isFemale, speak])

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

        {/* Page actions — outside book area so they never trigger page flips */}
        {cur && (
          <div style={s.actionsBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: 0, flex: 1 }}>
              <button
                style={s.actionBtn}
                onClick={togglePlay}
                title={isPlaying ? 'Pause reading' : 'Read aloud'}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c"><polygon points="5,3 19,12 5,21"/></svg>
                )}
              </button>
              <button
                style={s.actionBtn}
                onClick={toggleVoice}
                title={isFemale ? 'Switch to male voice' : 'Switch to female voice'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <span style={{ fontSize: '0.5rem', fontWeight: 700, marginLeft: '1px', color: '#c9a84c' }}>{isFemale ? 'F' : 'M'}</span>
              </button>
              <span style={s.actionsLabel}>{cur.heading}</span>
            </div>
            <div style={s.actionsGroup}>
              <button
                style={s.actionBtn}
                onClick={() => setLiked(v => !v)}
                title={liked ? 'Unlike' : 'Like'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#e74c3c' : 'none'} stroke={liked ? '#e74c3c' : '#c9a84c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button
                style={s.actionBtn}
                onClick={() => {
                  if (isPageSaved(book.id, idx)) {
                    removeSavedPage(book.id, idx)
                  } else {
                    savePage({
                      bookId: book.id, pageIdx: idx,
                      heading: cur.heading, text: cur.text,
                      bookTitle: book.title, bookScripture: book.scripture,
                      bookEmoji: book.emoji,
                    })
                  }
                }}
                title={isPageSaved(book.id, idx) ? 'Unsave page' : 'Save page'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isPageSaved(book.id, idx) ? '#c9a84c' : 'none'} stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button
                style={{
                  ...s.actionBtn,
                  background: stickyOpen ? '#c9a84c22' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'),
                }}
                onClick={() => { setStickyOpen(v => !v); setStickyText('') }}
                title="Sticky note"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={stickyOpen ? '#c9a84c' : 'none'} stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </button>
              <div style={{ position: 'relative' }} ref={shareRef}>
                <button
                  style={s.actionBtn}
                  onClick={() => setShowShare(v => !v)}
                  title="Share page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
                {showShare && (
                  <div style={s.shareDropdown(dark)}>
                    <button style={s.shareOption(dark)} onClick={async () => {
                      setShowShare(false)
                      const text = `${cur.heading}\n\n${cur.text}\n\n— ${book.title}, ${book.scripture}`
                      if (navigator.share) {
                        await navigator.share({ title: cur.heading, text })
                      } else {
                        await navigator.clipboard.writeText(text)
                        alert('Page copied to clipboard!')
                      }
                    }}>
                      Share Text
                    </button>
                    <button style={s.shareOption(dark)} onClick={async () => {
                      setShowShare(false)
                      try {
                        const el = cardRef.current
                        if (!el) return
                        el.style.display = 'block'
                        await new Promise(r => requestAnimationFrame(r))
                        const canvas = await html2canvas(el, {
                          scale: 2,
                          useCORS: true,
                          background: '#fcf6e8',
                        })
                        el.style.display = 'none'
                        const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
                        if (!blob) return
                        const url = URL.createObjectURL(blob)
                        const file = new File([blob], 'wisdom-card.png', { type: 'image/png' })
                        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                        if (isMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
                          await navigator.share({
                            title: cur.heading,
                            text: `hey checkout this wisdom card on tarang-flowstate`,
                            files: [file],
                          })
                          URL.revokeObjectURL(url)
                        } else {
                          setPreviewBlob(blob)
                          setPreviewImage(url)
                        }
                      } catch (err) {
                        console.error('Share image failed:', err)
                        alert('Could not share image. Try using Share Text instead.')
                      }
                    }}>
                      Share as Image
                    </button>
                    <button style={s.shareOption(dark)} onClick={async () => {
                      setShowShare(false)
                      try {
                        await navigator.clipboard.writeText(
                          `hey checkout this wisdom card on tarang-flowstate\n\n${cur.heading}\n\n${cur.text}\n\n— ${book.title}, ${book.scripture}`
                        )
                        alert('Link copied to clipboard!')
                      } catch { /* ignore */ }
                    }}>
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hidden wisdom card for image sharing */}
        <div ref={cardRef} style={s.shareCard}>
          <div style={s.shareCardInner}>
            <div style={s.shareCardEmoji}>{book.emoji || '📖'}</div>
            <h3 style={s.shareCardHeading}>{cur?.heading}</h3>
            <p style={s.shareCardText}>{cur?.text}</p>
            <div style={s.shareCardFooter}>
              <div style={s.shareCardSource}>— {book.title}, {book.scripture}</div>
              <div style={s.shareCardTag}>tarang-flowstate</div>
            </div>
          </div>
        </div>

        {/* Preview overlay when image is generated */}
        {previewImage && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '1.5rem', padding: '1rem',
          }} onClick={handleClosePreview}>
            <img src={previewImage} alt="Wisdom Card"
              style={{
                maxWidth: '90vw', maxHeight: '70vh',
                borderRadius: '12px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
              onClick={e => e.stopPropagation()}
            />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => {
                try {
                  if (!previewBlob) {
                    alert('No image preview data found!')
                    return
                  }
                  // Force the MIME type to be exactly image/png for OS clipboard compatibility
                  const pngBlob = previewBlob.type === 'image/png'
                    ? previewBlob
                    : new Blob([previewBlob], { type: 'image/png' })

                  const item = new ClipboardItem({ 'image/png': pngBlob })
                  navigator.clipboard.write([item])
                    .then(() => {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    })
                    .catch((err) => {
                      console.error('Clipboard write failed:', err)
                      alert('Failed to copy image: ' + err.message)
                    })
                } catch (err) {
                  console.error('Clipboard Item creation failed:', err)
                  alert('Copy not supported: ' + err.message)
                }
              }} style={{
                padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none',
                background: copied ? '#27ae60' : '#c9a84c',
                color: copied ? '#ffffff' : '#1a1208',
                fontWeight: 700,
                fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.2s, color 0.2s',
              }}>
                {copied ? 'Copied! ✓' : 'Copy Image'}
              </button>
              <a href={previewImage} download="wisdom-card.png" style={{
                padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none',
                background: '#8a6a40', color: '#fcf6e8', fontWeight: 700,
                fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'none', fontFamily: 'inherit',
              }} onClick={() => setTimeout(handleClosePreview, 1000)}>
                Download
              </a>
              <button onClick={handleClosePreview} style={{
                padding: '0.6rem 1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent', color: '#fcf6e8', fontWeight: 600,
                fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Close
              </button>
            </div>
          </div>
        )}

        <div ref={bookEl} style={s.bookArea}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onCancel}
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

        {stickyOpen && (
          <div style={s.stickyPanel(dark)}>
            {getPageNotes(book.id, idx).length > 0 && (
              <div style={s.stickyPanelNotes}>
                {getPageNotes(book.id, idx).map((n, ni) => (
                  <div key={n.id} style={{ ...s.stickyPanelNote, background: n.color + 'E0', transform: `rotate(${['-1deg','1deg','-0.5deg','0.5deg'][ni % 4]})` }}>
                    <span style={s.stickyPanelNoteText}>{n.text}</span>
                    <button style={s.stickyPanelNoteDel} onClick={() => removeNote(book.id, idx, n.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <input
              style={s.stickyPanelInput(dark)}
              placeholder="Write a sticky note..."
              value={stickyText}
              onChange={e => setStickyText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && stickyText.trim()) {
                  addNote(book.id, idx, stickyText.trim(), stickyColor)
                  setStickyText('')
                }
              }}
              autoFocus
            />
            <div style={s.stickyPanelRow}>
              {['#FF6B6B','#FFA94D','#FFD43B','#69DB7C','#4DABF7','#9775FA','#F783AC','#63E6BE'].map(c => (
                <button key={c} style={{ ...s.stickyPanelColor, background: c, border: stickyColor === c ? '2px solid #333' : '2px solid transparent' }} onClick={() => setStickyColor(c)} />
              ))}
              <button style={s.stickyPanelBtn} onClick={() => { if (stickyText.trim()) { addNote(book.id, idx, stickyText.trim(), stickyColor); setStickyText('') } }}>Stick</button>
            </div>
          </div>
        )}
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
    position: 'relative', flex: 1, minHeight: '320px', margin: '0 1.25rem',
    borderRadius: '4px', overflow: 'hidden', cursor: 'grab',
    touchAction: 'pan-y', userSelect: 'none',
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
    fontSize: '0.82rem', fontFamily: '"Lora", serif',
    color: dark ? '#d4c9a0' : '#4a3a20',
    lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line', flex: 1,
  },
  pageNum: {
    textAlign: 'center', fontSize: '0.58rem',
    color: dark ? '#8a7a60' : '#a09070', marginTop: '0.3rem',
    fontFamily: 'serif', fontStyle: 'italic', flexShrink: 0,
  },
  stickyPanelNotes: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    marginBottom: '0.4rem',
    maxHeight: '120px', overflowY: 'auto',
  },
  stickyPanelNote: {
    display: 'flex', alignItems: 'flex-start', gap: '0.3rem',
    padding: '4px 8px', borderRadius: '3px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    fontSize: '0.65rem', lineHeight: 1.4,
    fontStyle: 'italic',
    fontFamily: '"Caveat", "Segoe Script", cursive',
  },
  stickyPanelNoteText: {
    flex: 1, color: '#2a1e10', wordBreak: 'break-word',
  },
  stickyPanelNoteDel: {
    background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%',
    width: '14px', height: '14px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '0.45rem', color: '#2a1e10',
    padding: 0, flexShrink: 0, lineHeight: 1, opacity: 0.7,
  },
  stickyPanel: (dark) => ({
    margin: '0.3rem 1.25rem 0', padding: '0.5rem 0.6rem',
    background: dark ? 'rgba(40,30,15,0.3)' : 'rgba(255,252,240,0.6)',
    border: dark ? '1px solid rgba(201,168,76,0.08)' : '1px solid rgba(201,168,76,0.1)',
    borderRadius: '10px', flexShrink: 0,
  }),
  stickyPanelInput: (dark) => ({
    background: dark ? '#2a1e10' : '#fff',
    border: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
    borderRadius: '6px', padding: '0.35rem 0.5rem',
    fontSize: '0.75rem', width: '100%', boxSizing: 'border-box',
    color: dark ? '#c9b080' : '#5c3d1e', outline: 'none',
    fontFamily: '"Caveat", "Segoe Script", cursive',
  }),
  stickyPanelRow: {
    display: 'flex', gap: '4px', alignItems: 'center',
    marginTop: '5px', flexWrap: 'wrap',
  },
  stickyPanelColor: {
    width: '16px', height: '16px', borderRadius: '50%',
    border: '2px solid transparent', cursor: 'pointer', padding: 0,
  },
  stickyPanelBtn: {
    background: '#c9a84c', border: 'none', borderRadius: '6px',
    padding: '0.25rem 0.7rem', fontSize: '0.65rem',
    color: '#fff', cursor: 'pointer', fontWeight: 700,
    marginLeft: 'auto', letterSpacing: '0.03em',
  },
  actionsBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    margin: '0.3rem 1.25rem 0.2rem', padding: '0.35rem 0.6rem',
    background: dark ? 'rgba(40,30,15,0.25)' : 'rgba(255,252,240,0.5)',
    border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.1)',
    borderRadius: '10px', flexShrink: 0,
  },
  actionsLabel: {
    fontSize: '0.65rem', fontStyle: 'italic',
    color: '#c9a84c', opacity: 0.7,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    marginRight: '0.5rem',
  },
  actionsGroup: {
    display: 'flex', gap: '0.25rem', flexShrink: 0,
  },
  actionBtn: {
    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
    border: 'none', borderRadius: '8px',
    cursor: 'pointer', padding: '6px 7px 4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    lineHeight: 1, transition: 'background 0.15s',
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

  // ── SHARE ──
  shareDropdown: (dark) => ({
    position: 'absolute', bottom: '100%', right: 0, marginBottom: '4px',
    background: dark ? '#2a1e10' : '#fff',
    border: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
    borderRadius: '8px', overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 50, minWidth: '120px',
  }),
  shareOption: (dark) => ({
    display: 'block', width: '100%', textAlign: 'left',
    background: 'none', border: 'none',
    padding: '0.4rem 0.7rem', fontSize: '0.7rem',
    color: dark ? '#c9b080' : '#5c3d1e',
    cursor: 'pointer', fontFamily: 'inherit',
    borderBottom: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.08)',
    transition: 'background 0.1s',
  }),
  shareCard: {
    display: 'none',
    position: 'absolute',
    left: '-9999px',
    width: '400px',
    padding: '2rem',
    background: '#fcf6e8',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    border: '1px solid #d4c5a0',
    fontFamily: '"Lora", "Georgia", serif',
  },
  shareCardInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  shareCardEmoji: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  shareCardHeading: {
    fontSize: '1.1rem',
    fontFamily: '"Cinzel", serif',
    color: '#5c3d1e',
    margin: 0,
  },
  shareCardText: {
    fontSize: '0.9rem',
    color: '#4a3a20',
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: 'pre-line',
  },
  shareCardFooter: {
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  shareCardSource: {
    fontSize: '0.75rem',
    color: '#8b6914',
    fontStyle: 'italic',
  },
  shareCardTag: {
    fontSize: '0.6rem',
    color: '#c9a84c',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
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
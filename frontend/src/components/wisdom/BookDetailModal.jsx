import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useWisdom } from '../../context/WisdomContext'
import { useAchievements } from '../../context/AchievementsContext'
import { useAuth } from '../../context/AuthContext'
import { logPageReadToday } from '../../utils/wisdomTracking'
import { toPng } from 'html-to-image'
import RosePetals from './RosePetals'

// Extracted Subcomponents
import { XPFloat } from './BookDetailModal/XPFloat.jsx'
import { CompletionCelebration } from './BookDetailModal/CompletionCelebration.jsx'
import { WisdomShareCard } from './BookDetailModal/WisdomShareCard.jsx'
import { WisdomShareOverlay } from './BookDetailModal/WisdomShareOverlay.jsx'
import { useBookSpeech } from './BookDetailModal/useBookSpeech.js'
import { styles } from './BookDetailModal/styles.js'
import { BookActionsBar } from './BookDetailModal/BookActionsBar.jsx'
import { BookStickyNotePanel } from './BookDetailModal/BookStickyNotePanel.jsx'
import { useBookGestures } from './BookDetailModal/useBookGestures.js'

export default function BookDetailModal({ book, onClose, initialPage = 0 }) {
  const { dark } = useTheme()
  const { updateBookProgress, savePage, removeSavedPage, isPageSaved, addNote, removeNote, getPageNotes } = useWisdom()
  const { trackEvent } = useAchievements()
  const { adjustPoints } = useAuth()

  const [liked, setLiked] = useState(false)
  const [xpFloats, setXpFloats] = useState([])
  const [showRosePetals, setShowRosePetals] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const prevIdxRef = useRef(initialPage)

  // Image Sharing States
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
  const cardRef = useRef(null)
  const bookEl = useRef(null)
  const pages = book.pages || []

  const [idx, setIdx] = useState(initialPage)

  const cur = pages[idx]
  const next = pages[idx + 1]
  const prev = pages[idx - 1]

  // Custom Hook for Speech Synthesis
  const { isPlaying, isFemale, togglePlay, toggleVoice } = useBookSpeech(cur?.text, cur?.heading)

  // Custom Hook for Gesture & Pointer Flips
  const {
    angle,
    isAnimating,
    onDown,
    onMove,
    onUp,
    onCancel,
    flipForward,
    flipBackward,
    isTurning,
    dragDir,
    flipPct
  } = useBookGestures({ pages, idx, setIdx, bookEl, onClose })

  const showBack = dragDir === 1 && angle < -90

  useEffect(() => {
    trackEvent('book_opened', { bookId: book.id })
  }, [book.id, trackEvent])

  // Update book progress on page changes
  useEffect(() => {
    updateBookProgress(book.id, idx)
    if (prevIdxRef.current !== idx) {
      prevIdxRef.current = idx
      if (idx === (book.pages?.length ?? 0) - 1) {
        setTimeout(() => {
          setShowRosePetals(true)
          setShowCompletion(true)
          setTimeout(() => setShowRosePetals(false), 5500)
        }, 400)
      }
    }
  }, [idx, book.id, updateBookProgress, book.pages?.length])

  // Reading contemplation timer for XP awards (6 seconds)
  const [awardedPages, setAwardedPages] = useState(new Set())
  const [readingTimerActive, setReadingTimerActive] = useState(false)
  const wisdomAbsorbed = awardedPages.has(idx)

  useEffect(() => {
    if (awardedPages.has(idx)) {
      setReadingTimerActive(false)
      return
    }

    setReadingTimerActive(true)
    const timer = setTimeout(() => {
      adjustPoints(10, 0)
      setXpFloats(prev => [...prev, Date.now()])
      trackEvent('page_read', { bookId: book.id, page: idx })
      logPageReadToday(book.id, idx)
      window.dispatchEvent(new Event('wisdom_progress_updated'))
      setAwardedPages(prev => {
        const nextSet = new Set(prev)
        nextSet.add(idx)
        return nextSet
      })
      setReadingTimerActive(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [idx, awardedPages, adjustPoints, trackEvent, book.id])

  // Sharing handlers
  const handleShareText = useCallback(async () => {
    const textStr = `${cur.heading}\n\n${cur.text}\n\n— ${book.title}, ${book.scripture}`
    if (navigator.share) {
      await navigator.share({ title: cur.heading, text: textStr })
    } else {
      await navigator.clipboard.writeText(textStr)
      alert('Page copied to clipboard!')
    }
  }, [cur, book])

  const handleShareImage = useCallback(async () => {
    try {
      const el = cardRef.current
      if (!el) return
      el.style.display = 'block'
      await new Promise(r => requestAnimationFrame(r))
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        style: { display: 'block' },
        backgroundColor: '#fcf6e8',
      })
      el.style.display = 'none'
      const imgRes = await fetch(dataUrl)
      const blob = await imgRes.blob()
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
  }, [cur, book])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `hey checkout this wisdom card on tarang-flowstate\n\n${cur.heading}\n\n${cur.text}\n\n— ${book.title}, ${book.scripture}`
      )
      alert('Link copied to clipboard!')
    } catch { /* ignore */ }
  }, [cur, book])

  const s = styles(dark)

  return (
    <div style={s.overlay} onClick={onClose}>
      <RosePetals trigger={showRosePetals} count={40} />

      <CompletionCelebration
        show={showCompletion}
        dark={dark}
        book={book}
        onContinue={() => setShowCompletion(false)}
        onClose={() => { setShowCompletion(false); onClose() }}
      />

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

        {/* Modular Actions Tool Bar */}
        <BookActionsBar
          dark={dark}
          book={book}
          idx={idx}
          cur={cur}
          isPlaying={isPlaying}
          isFemale={isFemale}
          togglePlay={togglePlay}
          toggleVoice={toggleVoice}
          readingTimerActive={readingTimerActive}
          wisdomAbsorbed={wisdomAbsorbed}
          liked={liked}
          setLiked={setLiked}
          isPageSaved={isPageSaved}
          savePage={savePage}
          removeSavedPage={removeSavedPage}
          stickyOpen={stickyOpen}
          setStickyOpen={setStickyOpen}
          setStickyText={setStickyText}
          onShareImage={handleShareImage}
          onShareText={handleShareText}
          onCopyLink={handleCopyLink}
          styles={s}
        />

        <WisdomShareCard ref={cardRef} book={book} cur={cur} />

        <WisdomShareOverlay
          previewImage={previewImage}
          copied={copied}
          onClose={handleClosePreview}
          onCopy={() => {
            try {
              if (!previewBlob) {
                alert('No image preview data found!')
                return
              }
              const pngBlob = previewBlob.type === 'image/png' ? previewBlob : new Blob([previewBlob], { type: 'image/png' })
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
          }}
        />

        <div
          ref={bookEl}
          style={{ ...s.bookArea, position: 'relative' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onCancel}
        >
          <AnimatePresence>
            {xpFloats.map(id => (
              <XPFloat
                key={id}
                id={id}
                onDone={() => setXpFloats(prev => prev.filter(x => x !== id))}
              />
            ))}
          </AnimatePresence>

          {/* Under page and Flipping effects */}
          {pages.length - idx > 1 && !isTurning && (
            <div style={s.thicknessStack}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ ...s.thickLayer, left: -1 - i * 1.2, zIndex: -i - 2 }} />
              ))}
            </div>
          )}

          {next && isTurning && dragDir === 1 && (
            <div style={{ ...s.page, ...s.pageUnder, zIndex: 6 }}>
              <div style={s.pageBg} />
              <div style={s.pageInner}>
                <h3 style={s.pageHead}>{next.heading}</h3>
                <div style={s.pageText}>{next.text}</div>
                <div style={s.pageNum}>{idx + 2}</div>
              </div>
            </div>
          )}

          {prev && isTurning && dragDir === -1 && (
            <div style={{ ...s.page, ...s.pageUnder, zIndex: 6 }}>
              <div style={s.pageBg} />
              <div style={s.pageInner}>
                <h3 style={s.pageHead}>{prev.heading}</h3>
                <div style={s.pageText}>{prev.text}</div>
                <div style={s.pageNum}>{idx}</div>
              </div>
            </div>
          )}

          {isTurning && (
            <div style={{ ...s.spineShadow, opacity: Math.min(1, flipPct * 2) }} />
          )}

          <div
            style={{
              ...s.page,
              ...s.flipper,
              transform: `perspective(1500px) rotateY(${angle}deg)`,
              zIndex: 10,
              pointerEvents: isTurning ? 'none' : 'auto',
            }}
          >
            <div style={s.pageBg} />

            {/* Front and back flip pages */}
            <div style={{ ...s.pageInner, ...s.face, opacity: showBack ? 0 : 1 }}>
              {cur && (
                <>
                  <h3 style={s.pageHead}>{cur.heading}</h3>
                  <div style={s.pageText}>{cur.text}</div>
                  <div style={s.pageNum}>{idx + 1}</div>
                </>
              )}
            </div>

            <div style={{ ...s.pageInner, ...s.face, ...s.backFace, opacity: showBack ? 1 : 0 }}>
              {next && (
                <>
                  <h3 style={s.pageHead}>{next.heading}</h3>
                  <div style={s.pageText}>{next.text}</div>
                  <div style={s.pageNum}>{idx + 2}</div>
                </>
              )}
            </div>

            <div style={{ ...s.curlShadow, opacity: flipPct * 0.5 }} />
          </div>

          {isTurning && (
            <div style={{ ...s.dropShadow, opacity: flipPct * 0.3, transform: `translateX(${flipPct * 5}px)` }} />
          )}

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

          <div style={s.spineLine} />

          {!isTurning && idx > 0 && <div style={{ ...s.touch, ...s.touchL }} />}
          {!isTurning && idx < pages.length - 1 && <div style={{ ...s.touch, ...s.touchR }} />}
        </div>

        {/* Modular Sticky notes panel */}
        <BookStickyNotePanel
          dark={dark}
          book={book}
          idx={idx}
          stickyOpen={stickyOpen}
          stickyText={stickyText}
          setStickyText={setStickyText}
          stickyColor={stickyColor}
          setStickyColor={setStickyColor}
          getPageNotes={getPageNotes}
          addNote={addNote}
          removeNote={removeNote}
          styles={s}
        />

        <div style={s.footer}>
          <p style={s.verse}>{book.sampleVerse}</p>
        </div>
      </div>
    </div>
  )
}
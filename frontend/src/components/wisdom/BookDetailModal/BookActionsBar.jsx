import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function BookActionsBar({
  dark,
  book,
  idx,
  cur,
  isPlaying,
  isFemale,
  togglePlay,
  toggleVoice,
  readingTimerActive,
  wisdomAbsorbed,
  liked,
  setLiked,
  isPageSaved,
  savePage,
  removeSavedPage,
  stickyOpen,
  setStickyOpen,
  setStickyText,
  onShareImage,
  onShareText,
  onCopyLink,
  styles
}) {
  const [showShare, setShowShare] = useState(false)
  const shareRef = useRef(null)
  const s = styles

  // Close share dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false)
      }
    }
    if (showShare) {
      setTimeout(() => document.addEventListener('click', handleOutsideClick), 0)
      return () => document.removeEventListener('click', handleOutsideClick)
    }
  }, [showShare])

  if (!cur) return null

  return (
    <div style={s.actionsBar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: 0, flex: 1 }}>
        <button
          style={s.actionBtn}
          onClick={togglePlay}
          title={isPlaying ? 'Pause reading' : 'Read aloud'}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
        <button
          style={s.actionBtn}
          onClick={toggleVoice}
          title={isFemale ? 'Switch to male voice' : 'Switch to female voice'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, marginLeft: '1px', color: '#c9a84c' }}>{isFemale ? 'F' : 'M'}</span>
        </button>
        <span style={s.actionsLabel}>{cur.heading}</span>
        {readingTimerActive && (
          <motion.span
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ fontSize: '0.65rem', color: '#c9a84c', fontStyle: 'italic', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}
          >
            🧘 Contemplating...
          </motion.span>
        )}
        {wisdomAbsorbed && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: '0.65rem', color: dark ? '#2ecc71' : '#27ae60', fontWeight: 600, marginLeft: '0.5rem', whiteSpace: 'nowrap' }}
          >
            ✨ Absorbed (+10 XP)
          </motion.span>
        )}
      </div>

      <div style={s.actionsGroup}>
        {/* Like Button */}
        <button
          style={s.actionBtn}
          onClick={() => setLiked(v => !v)}
          title={liked ? 'Unlike' : 'Like'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#e74c3c' : 'none'} stroke={liked ? '#e74c3c' : '#c9a84c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Save Button */}
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

        {/* Sticky Note Button */}
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

        {/* Share Dropdown */}
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
              <button
                style={s.shareOption(dark)}
                onClick={() => {
                  setShowShare(false)
                  onShareText()
                }}
              >
                Share Text
              </button>
              <button
                style={s.shareOption(dark)}
                onClick={() => {
                  setShowShare(false)
                  onShareImage()
                }}
              >
                Share as Image
              </button>
              <button
                style={s.shareOption(dark)}
                onClick={() => {
                  setShowShare(false)
                  onCopyLink()
                }}
              >
                Copy Link
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
export default BookActionsBar

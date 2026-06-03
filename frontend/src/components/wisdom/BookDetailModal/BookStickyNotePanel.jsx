import React from 'react'

export function BookStickyNotePanel({
  dark,
  book,
  idx,
  stickyOpen,
  stickyText,
  setStickyText,
  stickyColor,
  setStickyColor,
  getPageNotes,
  addNote,
  removeNote,
  styles
}) {
  const s = styles

  if (!stickyOpen) return null

  const notes = getPageNotes(book.id, idx)

  const handleStick = () => {
    if (stickyText.trim()) {
      addNote(book.id, idx, stickyText.trim(), stickyColor)
      setStickyText('')
    }
  }

  return (
    <div style={s.stickyPanel(dark)}>
      {notes.length > 0 && (
        <div style={s.stickyPanelNotes}>
          {notes.map((n, ni) => (
            <div
              key={n.id}
              style={{
                ...s.stickyPanelNote,
                background: n.color + 'E0',
                transform: `rotate(${['-1deg', '1deg', '-0.5deg', '0.5deg'][ni % 4]})`
              }}
            >
              <span style={s.stickyPanelNoteText}>{n.text}</span>
              <button
                style={s.stickyPanelNoteDel}
                onClick={() => removeNote(book.id, idx, n.id)}
              >
                ✕
              </button>
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
          if (e.key === 'Enter') {
            handleStick()
          }
        }}
        autoFocus
      />
      <div style={s.stickyPanelRow}>
        {['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA', '#F783AC', '#63E6BE'].map(c => (
          <button
            key={c}
            style={{
              ...s.stickyPanelColor,
              background: c,
              border: stickyColor === c ? '2px solid #333' : '2px solid transparent'
            }}
            onClick={() => setStickyColor(c)}
          />
        ))}
        <button
          style={s.stickyPanelBtn}
          onClick={handleStick}
        >
          Stick
        </button>
      </div>
    </div>
  )
}
export default BookStickyNotePanel

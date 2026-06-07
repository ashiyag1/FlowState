import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWellness } from '../../context/WellnessContext'
import { getEmotionalReflection } from '../../utils/emotionalMemory'

const HISTORY_KEY = 'sahayak_chat_history'
const MAX_STORED  = 20   // max messages persisted to localStorage
const MAX_CONTEXT = 6    // max messages sent as conversation history to API

/* ─────────────────────────────────────────────────────────────
   COZY CAMPFIRE FRIEND ICON (Sahayak's Friendly Mascot)
───────────────────────────────────────────────────────────── */
function CozyFriendIcon({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.3s ease', ...style }}>
      {/* Clean speech bubble */}
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      {/* Small solid heart in the center */}
      <path d="M12 12s-1.8-1.2-1.8-2.2c0-.6.4-1 .9-1 .3 0 .6.2.7.4l.2.3.2-.3c.1-.2.4-.4.7-.4.5 0 .9.4.9 1 0 1-1.8 2.2-1.8 2.2z" fill="currentColor" />
    </svg>
  )
}

export default function AIAssistant() {
  const { journal, habitDone } = useWellness()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    // Load persisted history on mount
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [showLabel, setShowLabel] = useState(() => {
    return localStorage.getItem('fwa_sakha_label_dismissed') !== 'true'
  })
  const listRef = useRef(null)

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length === 0) return
    try {
      // Only store the last MAX_STORED messages
      const toStore = messages.slice(-MAX_STORED)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(toStore))
    } catch { /* storage full — ignore */ }
  }, [messages])

  // Generate greeting only if no history exists yet
  useEffect(() => {
    if (!isFirstLoad) return
    setIsFirstLoad(false)

    // If we have saved messages, don't overwrite with a greeting
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) return
      } catch { /* fall through */ }
    }

    const reflection = getEmotionalReflection(journal, habitDone)
    let greeting = "Namaste. I am here when you need stillness, clarity, or simply a quiet presence."
    let suggestions = ["Write in my Mindspace", "Guide me in breathing", "Read some wisdom"]
    
    if (reflection.isReturning) {
      greeting = `Namaste. ${reflection.message} I am here when you are ready to slow down.`
      suggestions = ["Start breathing exercise", "Write in Mindspace", "Just chat"]
    } else if (reflection.tod === 'night') {
      greeting = "Namaste. Still awake? Let's quiet the noise a little."
      suggestions = ["Help me clear my mind", "Do a breathing exercise", "Read daily quotes"]
    } else if (reflection.tod === 'morning') {
      greeting = "Namaste. A new day begins. How are you feeling this morning?"
      suggestions = ["Set my Sankalpa", "Log water intake", "Show daily quotes"]
    }
    
    setMessages([{
      role: 'assistant',
      text: greeting,
      suggestions: suggestions
    }])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY)
    const reflection = getEmotionalReflection(journal, habitDone)
    setMessages([{
      role: 'assistant',
      text: "Our conversation starts fresh. I'm here — what's on your mind?",
      suggestions: ["How are you feeling?", "Give me a breathing exercise", "Share some wisdom"]
    }])
  }

  async function sendMessage(text) {
    if (!text || loading) return
    const userMsg = { role: 'user', text, suggestions: [] }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // Build conversation history for the API (last MAX_CONTEXT messages before this one)
    const historyForApi = updatedMessages
      .slice(-MAX_CONTEXT - 1, -1) // exclude the message we just added
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.text }))

    try {
      const token = localStorage.getItem('fwa_auth_token')
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: text,
          conversationHistory: historyForApi
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Status ${res.status}`)
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.reply || 'I could not process that. Please try again.',
        suggestions: data.suggestions || [],
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: err.message === 'Failed to fetch'
          ? 'The connection wavers. Try again — I am not going anywhere.'
          : `Hmm, something went wrong: ${err.message}`,
        suggestions: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    sendMessage(input.trim())
  }

  return (
    <>
      <style>{`
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,168,42,0.25); border-radius: 99px; }
        .sahayak-fab { bottom: 20px; }
        .sahayak-fab-label { bottom: 80px; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes sahayak-pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        .sahayak-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e8622a;
          display: inline-block;
          animation: sahayak-pulse 2s infinite ease-in-out;
        }
        @media (max-width: 768px) {
          .sahayak-fab { bottom: 84px; }
          .sahayak-fab-label { bottom: 144px; }
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: 84, right: 20, zIndex: 999,
              width: 360, maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'min(540px, 70vh)',
              display: 'flex', flexDirection: 'column',
              borderRadius: 20,
              background: 'rgba(253,246,227,0.92)',
              backdropFilter: 'blur(24px) saturate(1.3)',
              border: '1px solid rgba(212,168,42,0.2)',
              boxShadow: '0 16px 64px rgba(0,0,0,0.18), 0 0 80px rgba(212,168,42,0.06)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid rgba(212,168,42,0.12)',
              background: 'linear-gradient(135deg, rgba(212,168,42,0.08), rgba(232,199,122,0.04))',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(212,168,42,0.2), rgba(232,199,122,0.1))',
                  border: '1px solid rgba(212,168,42,0.3)',
                }}>
                  <CozyFriendIcon size={18} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Cinzel',serif", fontSize: '0.78rem', fontWeight: 600,
                    color: '#3d2208', letterSpacing: '0.04em',
                  }}>Sahayak</div>
                  <div style={{
                    fontSize: '0.6rem', color: '#8b7355',
                    fontFamily: "'Lora',serif", fontStyle: 'italic',
                  }}>Your FlowState guide</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Clear history button */}
                <button
                  type="button"
                  onClick={clearHistory}
                  title="Clear conversation"
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer', background: 'transparent',
                    color: 'rgba(139,115,85,0.5)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#b45a3c'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(139,115,85,0.5)'}
                >
                  <Trash2 size={12} />
                </button>
                <button type="button" onClick={() => setOpen(false)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer', background: 'transparent',
                    color: '#8b7355', transition: 'all 0.2s',
                  }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div ref={listRef} className="chat-scrollbar" style={{
              flex: 1, overflowY: 'auto', padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {messages.map((msg, i) => (
                <div key={i}>
                  <div style={{
                    display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '0.82rem', lineHeight: 1.5,
                      fontFamily: "'DM Sans', sans-serif",
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(212,168,42,0.18), rgba(232,199,122,0.08))'
                        : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(212,168,42,0.15)' : 'rgba(212,168,42,0.08)'}`,
                      color: '#3d2208',
                    }}>
                      {msg.text}
                    </div>
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingLeft: 2 }}>
                      {msg.suggestions.map((s, j) => (
                        <button key={j} type="button" onClick={() => sendMessage(s)}
                          style={{
                            padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(212,168,42,0.25)',
                            background: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem',
                            color: '#8b7355', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.target.style.background = 'rgba(212,168,42,0.12)'}
                          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.4)'}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '10px 16px', borderRadius: '16px 16px 16px 4px',
                    fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif",
                    background: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(212,168,42,0.08)',
                    color: '#8b7355',
                  }}>
                    <span style={{ animation: 'pulse 1.4s infinite' }}>Thinking</span>
                    <span style={{ animation: 'pulse 1.4s infinite', animationDelay: '0.2s' }}>.</span>
                    <span style={{ animation: 'pulse 1.4s infinite', animationDelay: '0.4s' }}>.</span>
                    <span style={{ animation: 'pulse 1.4s infinite', animationDelay: '0.6s' }}>.</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px 14px',
              borderTop: '1px solid rgba(212,168,42,0.1)',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Sahayak..."
                style={{
                  flex: 1, padding: '9px 14px', borderRadius: 999,
                  border: '1px solid rgba(212,168,42,0.2)',
                  background: 'rgba(255,255,255,0.6)',
                  fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem',
                  color: '#3d2208', outline: 'none',
                }}
              />
              <button type="submit" disabled={loading || !input.trim()}
                style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: loading || !input.trim() ? 'default' : 'pointer',
                  background: loading || !input.trim()
                    ? 'rgba(212,168,42,0.15)'
                    : 'linear-gradient(135deg, #c4911e, #d4a82a)',
                  color: loading || !input.trim() ? '#c9b080' : '#fff',
                  transition: 'all 0.2s',
                }}>
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sakha floating label above the FAB */}
      {!open && showLabel && (
        <div 
          className="sahayak-fab-label"
          style={{
            position: 'fixed',
            right: '20px',
            background: 'rgba(253, 246, 227, 0.98)',
            border: '1.5px solid rgba(212, 168, 42, 0.4)',
            borderRadius: '16px',
            padding: '8px 32px 8px 14px',
            color: '#8b5a12',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: "'Lexend', sans-serif",
            letterSpacing: '0.02em',
            boxShadow: '0 6px 20px rgba(139,105,20,0.15)',
            zIndex: 998,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto',
          }}
        >
          <span className="sahayak-pulse-dot" />
          <span>I am your Sakha 🪷</span>
          
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLabel(false);
              localStorage.setItem('fwa_sakha_label_dismissed', 'true');
            }}
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              color: 'rgba(139, 115, 85, 0.6)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              outline: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ✕
          </button>
          
          {/* Tooltip arrow pointing down */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            right: '20px',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(212, 168, 42, 0.4)',
          }} />
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', right: 20, zIndex: 999,
          width: 52, height: 52, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(212, 168, 42, 0.25)',
          background: 'linear-gradient(135deg, rgba(212, 168, 42, 0.15), rgba(232,199,122,0.08))',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 40px rgba(212,168,42,0.06)',
          cursor: 'pointer', color: '#c4911e',
          transition: 'all 0.25s ease',
        }}
        className="sahayak-fab"
        aria-label="Toggle AI assistant"
      >
        {open ? <X size={20} /> : <CozyFriendIcon size={26} />}
      </motion.button>
    </>
  )
}

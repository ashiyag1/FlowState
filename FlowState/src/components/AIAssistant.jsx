import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const INITIAL_MSG = {
  role: 'assistant',
  text: "Namaste, I'm Sahayak — your FlowState guide. Ask me about the wisdom library, features, or anything on the site.",
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.reply || 'I could not process that. Please try again.',
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'The sage seems silent right now. Please try again later.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,168,42,0.25); border-radius: 99px; }
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
                  <Sparkles size={14} style={{ color: '#c4911e' }} />
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

            <div ref={listRef} className="chat-scrollbar" style={{
              flex: 1, overflowY: 'auto', padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
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
                placeholder="Ask about FlowState..."
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 999,
          width: 52, height: 52, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(212,168,42,0.25)',
          background: 'linear-gradient(135deg, rgba(212,168,42,0.15), rgba(232,199,122,0.08))',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 40px rgba(212,168,42,0.06)',
          cursor: 'pointer', color: '#c4911e',
          transition: 'all 0.25s ease',
        }}
        aria-label="Toggle AI assistant"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>
    </>
  )
}

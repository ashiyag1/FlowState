import { useState, useEffect } from 'react'
import { X, Share, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SNOOZE_KEY = 'fwa_pwa_snooze'
const SNOOZE_DAYS = 3

function isIOS() {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua)
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function isSnoozed() {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY)
    if (!raw) return false
    const until = parseInt(raw, 10)
    return Date.now() < until
  } catch { return false }
}

function snooze() {
  try {
    const until = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000
    localStorage.setItem(SNOOZE_KEY, String(until))
  } catch { /* ignore storage errors */ }
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showChromeBanner, setShowChromeBanner] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // Never show if already installed as PWA
    if (isInStandaloneMode()) return
    // Never show if snoozed
    if (isSnoozed()) return

    const ios = isIOS()

    if (ios) {
      // iOS Safari: show the manual guide
      // Small delay so it doesn't feel jarring on first load
      const t = setTimeout(() => setShowIOSGuide(true), 4000)
      return () => clearTimeout(t)
    } else {
      // Chrome / Android: listen for the standard prompt
      const handler = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowChromeBanner(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function handleChromeInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null)
      setShowChromeBanner(false)
      snooze() // don't ask again for 3 days
    })
  }

  function dismissChrome() {
    setShowChromeBanner(false)
    snooze()
  }

  function dismissIOS() {
    setShowIOSGuide(false)
    snooze()
  }

  return (
    <AnimatePresence>
      {/* ── CHROME / ANDROID BANNER ── */}
      {showChromeBanner && (
        <motion.div
          key="chrome-banner"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9000, width: 'calc(100vw - 32px)', maxWidth: 420,
            borderRadius: 20,
            background: 'rgba(253,246,227,0.95)',
            backdropFilter: 'blur(24px) saturate(1.3)',
            border: '1px solid rgba(212,168,42,0.25)',
            boxShadow: '0 16px 56px rgba(0,0,0,0.18), 0 0 60px rgba(212,168,42,0.06)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{ fontSize: 28, flexShrink: 0 }}>🪷</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.78rem', fontWeight: 600,
              color: '#3d2208', marginBottom: 2,
            }}>
              Add FlowState to Home Screen
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem',
              color: '#8b7355', lineHeight: 1.4,
            }}>
              Your sanctuary, always one tap away.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleChromeInstall}
              style={{
                padding: '6px 14px', borderRadius: 999,
                background: 'linear-gradient(135deg, #c4911e, #d4a82a)',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Cinzel', serif", fontSize: '0.65rem', fontWeight: 600,
                color: '#fff', letterSpacing: '0.06em',
              }}
            >
              Install
            </button>
            <button
              type="button"
              onClick={dismissChrome}
              style={{
                padding: '4px', borderRadius: 999,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#b89a5a', fontSize: '0.65rem',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Not now
            </button>
          </div>
        </motion.div>
      )}

      {/* ── iOS SAFARI MANUAL GUIDE ── */}
      {showIOSGuide && (
        <motion.div
          key="ios-guide"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9000, width: 'calc(100vw - 32px)', maxWidth: 420,
            borderRadius: 20,
            background: 'rgba(253,246,227,0.97)',
            backdropFilter: 'blur(24px) saturate(1.3)',
            border: '1px solid rgba(212,168,42,0.25)',
            boxShadow: '0 16px 56px rgba(0,0,0,0.18), 0 0 60px rgba(212,168,42,0.06)',
            padding: '18px 20px',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🪷</span>
              <div>
                <div style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600,
                  color: '#3d2208',
                }}>Add to Home Screen</div>
                <div style={{
                  fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.62rem',
                  color: '#8b7355',
                }}>Your sanctuary, always one tap away</div>
              </div>
            </div>
            <button type="button" onClick={dismissIOS}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none',
                background: 'rgba(212,168,42,0.08)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8b7355',
              }}>
              <X size={13} />
            </button>
          </div>

          {/* Step-by-step guide */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            padding: '12px', borderRadius: 12,
            background: 'rgba(212,168,42,0.06)',
            border: '1px solid rgba(212,168,42,0.12)',
          }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'rgba(212,168,42,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(212,168,42,0.2)',
              }}>
                <Share size={13} style={{ color: '#c4911e' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.77rem', color: '#3d2208', fontWeight: 600 }}>
                  Tap the Share button
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#8b7355' }}>
                  The square with an arrow at the bottom of Safari
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(212,168,42,0.1)', margin: '0 4px' }} />

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'rgba(212,168,42,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(212,168,42,0.2)',
              }}>
                <Plus size={13} style={{ color: '#c4911e' }} />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.77rem', color: '#3d2208', fontWeight: 600 }}>
                  Select "Add to Home Screen"
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#8b7355' }}>
                  Scroll down in the share sheet and tap it
                </div>
              </div>
            </div>
          </div>

          <div style={{
            textAlign: 'center', marginTop: 10,
            fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.68rem',
            color: 'rgba(139,115,85,0.6)',
          }}>
            FlowState will appear on your home screen like a native app
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import LotusFlower from '../../icons/LotusFlower'

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if running in standalone display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isDismissed = localStorage.getItem('flowstate_pwa_install_dismissed') === 'true'

    if (isStandalone || isDismissed) return

    const handleBeforeInstallPrompt = (e) => {
      // Prevent standard browser bar from displaying
      e.preventDefault()
      // Store event for manual trigger
      setDeferredPrompt(e)
      // Display the banner after a gentle delay
      const timer = setTimeout(() => {
        setVisible(true)
      }, 6000)
      return () => clearTimeout(timer)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    setVisible(false)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`PWA install prompt user choice outcome: ${outcome}`)
    setDeferredPrompt(null)
  }

  const handleDismissClick = () => {
    setVisible(false)
    localStorage.setItem('flowstate_pwa_install_dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 150, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 150, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            position: 'fixed',
            bottom: '86px', // Raised slightly to clear safe areas and bottom tab bars
            left: '50%',
            zIndex: 999,
            width: 'calc(100% - 1.5rem)',
            maxWidth: '380px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.4rem',
              borderRadius: '24px',
              background: 'rgba(24, 15, 6, 0.96)',
              backdropFilter: 'blur(28px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 168, 76, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="animate-pulse"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(201, 168, 76, 0.35)',
                    color: '#c9933a',
                    flexShrink: 0
                  }}
                >
                  <LotusFlower size={20} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#fff',
                      letterSpacing: '0.08em',
                      margin: 0
                    }}
                  >
                    Keep Sanctuary Close
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Lora', serif",
                      fontStyle: 'italic',
                      fontSize: '0.7rem',
                      color: 'rgba(253, 246, 227, 0.65)',
                      marginTop: '1px',
                      margin: 0
                    }}
                  >
                    Carry your rituals with you.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismissClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(253, 246, 227, 0.4)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} />
              </button>
            </div>

            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.76rem',
                color: 'rgba(253, 246, 227, 0.85)',
                lineHeight: 1.45,
                fontWeight: 300,
                margin: 0
              }}
            >
              Save FlowState on your homescreen for instant, one-handed logging and daily reminders.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleDismissClick}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 168, 76, 0.22)',
                  background: 'transparent',
                  color: 'rgba(253, 246, 227, 0.7)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Later
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #c9933a, #e8b96a)',
                  color: '#1a1208',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(201, 147, 58, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                Bring Mandala Home
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

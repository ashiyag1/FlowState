import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'

function DeleteModal({ open, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('')

  // Reset input when modal opens/closes
  React.useEffect(() => {
    if (open) setConfirmText('')
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-white/95 dark:bg-[#1a0f06]/95 backdrop-blur-xl p-6 md:p-8"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.3), 0 0 40px rgba(220,60,40,0.08)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-16 mx-auto mb-5 rounded-full" style={{ background: 'linear-gradient(90deg, #dc2626, #ea580c)' }} />

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{ background: 'rgba(220,40,40,0.08)', border: '1px solid rgba(220,40,40,0.15)' }}>
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-ink dark:text-sand-lt mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Delete Account?
                </h3>
                <p className="text-sm text-mist-dark/60 dark:text-sand-lt/40 mb-6 leading-relaxed" style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                  This action is irreversible. All your data, rituals, and journals will be permanently erased.
                </p>
                <div className="mb-6 text-left">
                  <label className="block text-xs font-medium text-ink/70 dark:text-sand-lt/70 mb-2">
                    Type <strong className="text-red-500 font-bold tracking-widest">DELETE</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full rounded-xl px-4 py-3 text-sm border bg-white/70 backdrop-blur-sm placeholder:text-mist-dark/40 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500/50 transition-all dark:bg-white/[0.04] dark:text-white dark:border-red-500/15 border-red-500/20 text-center uppercase"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gold/20 text-ink/70 dark:text-sand-lt/70 hover:bg-gold/5 transition-colors"
                  style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={confirmText === 'DELETE' ? { scale: 1.02 } : {}}
                  whileTap={confirmText === 'DELETE' ? { scale: 0.98 } : {}}
                  onClick={onConfirm}
                  disabled={confirmText !== 'DELETE'}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(220,40,40,0.25)',
                  }}
                >
                  Delete Forever
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function DangerZoneCard({ onDeleteAccount }) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div
      className="rounded-2xl border border-red-500/10 dark:border-red-500/8 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)' }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-red-500/50 text-xs">✦</span>
        <Trash2 size={14} className="text-red-500/50" />
        <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-red-500/70 dark:text-red-400/60"
          style={{ fontFamily: "'Cinzel', serif" }}>
          Danger Zone
        </h3>
      </div>

      <p className="text-sm text-mist-dark/50 dark:text-sand-lt/30 mb-4 leading-relaxed"
        style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
        Once you delete your account, there is no going back. All your rituals, journals, and progress will be permanently removed.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setDeleteOpen(true)}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/5 hover:border-red-500/30 transition-all duration-300 flex items-center gap-2"
        style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}
      >
        <Trash2 size={14} />
        Delete Account
      </motion.button>

      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          onDeleteAccount()
          setDeleteOpen(false)
        }}
      />
    </div>
  )
}
export default DangerZoneCard

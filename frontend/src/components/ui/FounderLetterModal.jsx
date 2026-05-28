import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Sparkles } from 'lucide-react'

export default function FounderLetterModal({ open, onClose, dark }) {
  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{
          background: dark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-[36px] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(30, 20, 30, 0.95), rgba(20, 15, 30, 0.95))'
              : 'linear-gradient(135deg, rgba(255, 245, 248, 0.95), rgba(248, 245, 255, 0.95))',
            border: dark ? '1px solid rgba(255,182,193,0.15)' : '1px solid rgba(255,182,193,0.4)',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-20 bg-white/50 dark:bg-black/30 backdrop-blur"
          >
            <X size={20} className="text-pink-500 dark:text-pink-400" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-pink-500 to-purple-500 mb-6 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Heart size={28} className="text-white fill-white" />
            </div>

            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
            >
              Ashiya's letter for you
            </h2>
            <p className="text-[10px] text-pink-600/70 dark:text-pink-300/70 uppercase tracking-[0.2em] font-bold mb-8 flex items-center justify-center gap-2">
              <Sparkles size={10} className="text-pink-400" /> straight from the heart
            </p>

            <div
              className="space-y-5 text-[14px] md:text-[15px] font-medium leading-relaxed max-w-lg mx-auto text-left"
              style={{ color: dark ? '#f5d0fe' : '#701a75' }}
            >
              <p>Hey bestie! ✨</p>
              <p>
                Okay, real talk. I didn't build this to be some massive, intimidating productivity app. Honestly? It started as a tiny little hydration tracker because I literally kept forgetting to drink water while working. (I know, I know, my skin was screaming.)
              </p>
              <p>
                But then I was like... wait, I need some motivation. But not that "hustle 24/7" toxic nonsense. I wanted deep, soul-soothing ancient Indian wisdom. You know, the kind of stuff that actually makes you feel centered and grounded instead of stressed out and anxious.
              </p>
              <p>
                And then it just naturally grew. I wanted to track my habits, but without those scary red streaks that make you feel like a total failure if you miss just one day because life happened. So I built forgiving cycles. Miss a day? It's your relax day, girl. Miss two? We just reset. Be gentle with yourself!
              </p>
              <p className="p-5 rounded-2xl bg-white/40 dark:bg-black/20 border border-pink-200 dark:border-pink-900 shadow-inner italic text-center text-[15px]">
                "FlowState is basically a piece of my own healing journey. It's our little corner of the internet where we don't have to be perfect. We just have to be present."
              </p>
              <p>
                I am so incredibly happy you're here sharing this space with me. Let's build this sanctuary together, slow and steady. 💖
              </p>
              
              <div className="pt-6 mt-4 border-t border-pink-200 dark:border-pink-900/50 flex flex-col items-center justify-center text-center">
                <p className="font-display text-2xl font-bold text-pink-600 dark:text-pink-400">
                  With so much love,<br/>Ashiya 🌸
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

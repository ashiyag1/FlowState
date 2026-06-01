import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Sparkles, Check, ArrowRight } from 'lucide-react'

const SANKALPA_RECOMMENDATIONS = {
  calm: {
    emoji: '🧘',
    label: 'Calm',
    desc: 'Quiet your mind & release stress.',
    recommended: 'Recommended for Stress Relief & Anxiety',
  },
  focus: {
    emoji: '🎯',
    label: 'Focus',
    desc: 'Block out distraction & build clarity.',
    recommended: 'Recommended for Students & Deep Study',
  },
  discipline: {
    emoji: '⚔️',
    label: 'Discipline',
    desc: 'Repeated daily rituals & willpower.',
    recommended: 'Popular for Daily Habits',
  },
  heal: {
    emoji: '🌿',
    label: 'Heal',
    desc: 'Listen to your body & recover gently.',
  },
  grow: {
    emoji: '🌱',
    label: 'Grow',
    desc: 'Rise stronger & embrace growth.',
  },
  gratitude: {
    emoji: '🌸',
    label: 'Gratitude',
    desc: 'Appreciate abundance in the present.',
  },
}

export default function OnboardingWizardModal({ open, onClose, dark, onComplete }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [selectedSankalpa, setSelectedSankalpa] = useState('calm')

  if (!open) return null

  const handleNext = () => setStep((s) => s + 1)
  const handlePrev = () => setStep((s) => s - 1)

  const handleFinish = () => {
    const finalName = name.trim() || 'Seeker'
    onComplete({ name: finalName, sankalpa: selectedSankalpa })
    onClose()
  }

  const modalBg = dark
    ? 'linear-gradient(145deg, #130c05 0%, #1f140a 100%)'
    : 'linear-gradient(145deg, #fffaf2 0%, #fdf6e6 100%)'

  const cardBorder = dark ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.32)'

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{
          background: dark ? 'rgba(10, 6, 2, 0.78)' : 'rgba(253, 246, 227, 0.65)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-xl rounded-[32px] p-6 sm:p-10 shadow-2xl flex flex-col justify-between overflow-y-auto max-h-[92vh] border"
          style={{
            background: modalBg,
            borderColor: cardBorder,
            color: dark ? '#f7eed7' : '#1c1208',
          }}
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-6 border-b pb-4 border-gold/10">
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: '#c8a96e' }}
            >
              Step {step} of 4
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: s === step ? '20px' : '6px',
                    background: s <= step ? '#e8622a' : (dark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.4)'),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 my-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-4xl mb-4 animate-bounce">🪷</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 text-ink dark:text-ivory">
                    Welcome to FlowState
                  </h2>
                  <p
                    className="text-xs sm:text-sm max-w-sm mb-6 leading-relaxed"
                    style={{ color: dark ? 'rgba(245,230,200,0.65)' : 'rgba(45,31,14,0.65)' }}
                  >
                    Your digital sanctuary for mindfulness, quiet strength, and daily consistency.
                  </p>

                  <div className="w-full max-w-sm text-left">
                    <label
                      className="block text-[11px] font-bold uppercase tracking-[0.1em] mb-2"
                      style={{ color: '#c8a96e' }}
                    >
                      How should we address you?
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kabir, Seeker..."
                      className="w-full rounded-2xl px-4 py-3 border border-gold/25 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all duration-200"
                      style={{
                        background: dark ? 'rgba(14, 9, 4, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                        color: dark ? '#fcf6e8' : '#1c1208',
                        borderColor: dark ? 'rgba(201, 168, 76, 0.3)' : 'rgba(201, 168, 76, 0.5)',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNext()
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold mb-1.5 text-ink dark:text-ivory">
                      Choose Your Sankalpa
                    </h2>
                    <p
                      className="text-xs max-w-md mx-auto leading-relaxed"
                      style={{ color: dark ? 'rgba(245,230,200,0.65)' : 'rgba(45,31,14,0.65)' }}
                    >
                      A Sankalpa is a solemn vow to connect with your inner truth. Select one below to shape your rituals and quotes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {Object.entries(SANKALPA_RECOMMENDATIONS).map(([key, item]) => {
                      const isSelected = selectedSankalpa === key
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedSankalpa(key)}
                          className="p-3.5 rounded-2xl text-left border relative transition-all duration-200 flex flex-col justify-between"
                          style={{
                            background: isSelected
                              ? (dark ? 'rgba(201, 147, 58, 0.12)' : 'rgba(201, 147, 58, 0.08)')
                              : 'transparent',
                            borderColor: isSelected ? '#c9933a' : cardBorder,
                            boxShadow: isSelected ? '0 4px 15px rgba(201,147,58,0.1)' : 'none',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <h4 className="font-semibold text-sm">{item.label}</h4>
                              <p
                                className="text-[11px] mt-0.5"
                                style={{ color: dark ? 'rgba(245,230,200,0.6)' : 'rgba(45,31,14,0.6)' }}
                              >
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          {item.recommended && (
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider mt-2.5 px-2 py-0.5 rounded-full inline-block self-start border bg-gold/10"
                              style={{
                                color: '#e8622a',
                                borderColor: 'rgba(232, 98, 42, 0.25)',
                              }}
                            >
                              ★ {item.recommended}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold mb-1.5 text-ink dark:text-ivory">
                      How to Use FlowState
                    </h2>
                    <p
                      className="text-xs max-w-sm mx-auto leading-relaxed"
                      style={{ color: dark ? 'rgba(245,230,200,0.65)' : 'rgba(45,31,14,0.65)' }}
                    >
                      Four simple pillars designed to fit into your busy day without pressure.
                    </p>
                  </div>

                  <div className="space-y-3.5 max-w-md mx-auto">
                    {[
                      {
                        emoji: '🧘',
                        title: 'Sadhana Practice',
                        desc: 'Add habits and daily rituals in cycles, with a personalized relax day of your choice.',
                      },
                      {
                        emoji: '💧',
                        title: 'Mindful Hydration',
                        desc: 'Simple, interactive water logging to protect your energy and health.',
                      },
                      {
                        emoji: '✍️',
                        title: 'Forgiving Reflections',
                        desc: 'A safe journal space with a pranayama unwind and visual consistency heatmaps. No scary red streaks—just gentle cycles.',
                      },
                      {
                        emoji: '📖',
                        title: 'Ancient Wisdom',
                        desc: 'Calm the mind with legacy highlights and proverbs, paired with ambient sitar, rain, or windchime music.',
                      },
                    ].map((pillar, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 p-3 rounded-2xl border"
                        style={{
                          background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.5)',
                          borderColor: cardBorder,
                        }}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{pillar.emoji}</span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm">{pillar.title}</h4>
                          <p
                            className="text-[11px] sm:text-xs leading-normal mt-0.5"
                            style={{ color: dark ? 'rgba(245,230,200,0.65)' : 'rgba(45,31,14,0.65)' }}
                          >
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="relative mb-6">
                    <span className="text-5xl block animate-pulse">✨</span>
                    <Sparkles className="text-gold absolute -top-1 -right-2 animate-bounce" size={16} />
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-ink dark:text-ivory">
                    Your Sanctuary is Ready, {name.trim() || 'Seeker'}!
                  </h2>

                  <div
                    className="p-5 rounded-2xl border my-4 max-w-sm italic text-xs leading-relaxed"
                    style={{
                      background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
                      borderColor: cardBorder,
                      color: dark ? '#ffeab8' : '#3d2600',
                    }}
                  >
                    "Arise, awake, and stop not till the goal is reached."
                    <br />
                    <span className="block mt-2 font-bold not-italic" style={{ color: '#c8a96e' }}>
                      — Swami Vivekananda
                    </span>
                  </div>

                  <p
                    className="text-xs max-w-xs mt-2 mb-4 leading-relaxed"
                    style={{ color: dark ? 'rgba(245,230,200,0.65)' : 'rgba(45,31,14,0.65)' }}
                  >
                    Let's walk this path of focus and mindfulness, slow and steady.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between border-t pt-4 border-gold/10 mt-6">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-xs font-semibold py-2 px-4 rounded-xl border border-gold/20 hover:bg-gold/5 transition-all"
                style={{ color: '#c8a96e' }}
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-5 rounded-full text-white transition-all shadow-md hover:translate-x-0.5"
                style={{
                  background: 'linear-gradient(135deg, #e8622a, #f4925a)',
                }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 text-xs font-bold py-3 px-6 rounded-full text-white transition-all shadow-lg hover:scale-102"
                style={{
                  background: 'linear-gradient(135deg, #c8a96e, #e8b96a)',
                  boxShadow: '0 4px 15px rgba(201, 147, 58, 0.3)',
                }}
              >
                Enter your Sanctuary <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

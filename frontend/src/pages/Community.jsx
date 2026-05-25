import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Flame, Heart, Share2, Users, Check, MessageSquare, Compass, Award } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNotif } from '../components/NotificationPopup'
import PageLayout from '../components/PageLayout'
import LotusFlower from '../icons/LotusFlower'
import DiyaLamp from '../icons/DiyaLamp'
import communityBg from '../assets/community_bg.png'

const DUMMY_ACTIVITIES = [
  { id: 'act-1', name: 'Sneha Sharma', avatar: '🌸', habit: '🧘 Meditation & Sadhana', streak: 24, time: '20 minutes ago', text: 'Completed 15 minutes of Pranayama and morning meditation. Feeling deeply grounded today.', prana: 142, comments: 3, color: '#E8622A' },
  { id: 'act-2', name: 'Ishaan Verma', avatar: '🏃', habit: '🏃 Run & Fitness', streak: 18, time: '1 hour ago', text: 'Chasing sunsets! Just finished a 5km run at twilight. Consistency beats perfection!', prana: 89, comments: 1, color: '#1B4FA8' },
  { id: 'act-3', name: 'Kavya Rao', avatar: '🪷', habit: '💧 Hydration (Amrit)', streak: 31, time: '3 hours ago', text: 'Hit my 3-liter target of copper-vessel water before evening. Feels like cellular revival.', prana: 205, comments: 5, color: '#1A7A4E' },
  { id: 'act-4', name: 'Kabir Mehta', avatar: '📖', habit: '📖 Study & Wisdom', streak: 9, time: '5 hours ago', text: 'Reading Swami Vivekananda\'s thoughts on the power of focus. Absolutely fires up the mind.', prana: 67, comments: 2, color: '#7B68AE' }
]
const DUMMY_INTENTIONS = [
  { id: 'int-1', author: 'Aarav', text: 'To stay fully present in every conversation today.', time: 'Just now' },
  { id: 'int-2', author: 'Riya', text: 'To drink warm water from my copper vessel first thing in the morning.', time: '10m ago' },
  { id: 'int-3', author: 'Dev', text: 'To show kindness to myself when things do not go as planned.', time: '1h ago' }
]

export default function Community() {
  const { dark } = useTheme()
  const { user, isAuthenticated, token } = useAuth()
  const notif = useNotif()
  
  const [activities, setActivities] = useState(DUMMY_ACTIVITIES)
  const [intentions, setIntentions] = useState(DUMMY_INTENTIONS)
  const [newIntention, setNewIntention] = useState('')
  const [globalVibe, setGlobalVibe] = useState(12845)
  const [particles, setParticles] = useState([])

  const topMembers = [...activities].sort((a, b) => b.streak - a.streak).slice(0, 3)
  const medals = ['🥇', '🥈', '🥉']
  const leaders = topMembers.length > 0
    ? topMembers.map((member, i) => ({ ...member, rank: medals[i] || '⭐' }))
    : [
        { rank: '🥇', name: 'Diya Kapoor', habit: '🌿 Seedlings', streak: 35, color: '#E8622A' },
        { rank: '🥈', name: 'Sneha Sharma', habit: '🧘 Yoga Sadhana', streak: 24, color: '#C9933A' },
        { rank: '🥉', name: 'Ishaan Verma', habit: '🏃 Sunset Sprint', streak: 18, color: '#1B4FA8' }
      ]

  useEffect(() => {
    fetch('/api/community/feed')
      .then(res => res.json())
      .then(data => {
        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities)
        } else {
          setActivities(DUMMY_ACTIVITIES)
        }
      })
      .catch(() => setActivities(DUMMY_ACTIVITIES))
  }, [])

  useEffect(() => {
    fetch('/api/community/intentions')
      .then(res => res.json())
      .then(data => {
        if (data.intentions && data.intentions.length > 0) {
          setIntentions(data.intentions)
        } else {
          setIntentions(DUMMY_INTENTIONS)
        }
      })
      .catch(() => setIntentions(DUMMY_INTENTIONS))
  }, [])

  const tPri = dark ? '#f0e6d0' : '#2D1F0E'
  const tSec = dark ? '#c9b080' : '#8A6E4E'

  const handleSendPrana = (e, activityId) => {
    // Generate floating sparks on click
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random(),
      x,
      y,
      angle: (i * 60 * Math.PI) / 180,
      distance: 30 + Math.random() * 30,
    }))

    setParticles((prev) => [...prev, ...newParticles])
    // Clean up particles
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.includes(p)))
    }, 800)

    setActivities((prev) =>
      prev.map((act) =>
        act.id === activityId ? { ...act, prana: act.prana + 1 } : act
      )
    )
    setGlobalVibe((v) => v + 5)
    notif('Positive Prana sent! ✦', 'default')
  }

  const handleAddIntention = async () => {
    if (!newIntention.trim()) return
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch('/api/community/intentions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: newIntention.trim(),
          author: isAuthenticated && user ? user.name.split(' ')[0] : 'Seeker'
        })
      })
      if (!res.ok) throw new Error('Failed to add intention')
      const intention = await res.json()
      setIntentions(prev => [intention, ...prev])
      setNewIntention('')
      setGlobalVibe((v) => v + 50)
      notif('Intention pinned to the Sankalpa Wall ✦', 'success')
    } catch (err) {
      console.error('Add intention error:', err)
      notif('Could not pin intention. Try again.', 'default')
    }
  }

  return (
    <PageLayout>
      {/* Background Cover */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `url(${communityBg}) center/cover no-repeat fixed`,
        filter: dark ? 'brightness(0.35) saturate(1.0)' : 'brightness(0.9) saturate(1.1)',
        opacity: dark ? 0.9 : 0.6,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '4.5rem 1.2rem 4rem' }}>
        
        {/* HERO TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gold mb-2 inline-block"
          >
            <LotusFlower size={36} />
          </motion.div>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.28em',
            color: '#E8622A', textTransform: 'uppercase', marginBottom: '0.35rem'
          }}>
            ✦ Sangha Sanctuary ✦
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2.8rem',
            fontWeight: 400, color: tPri, lineHeight: 1.1, margin: '0 auto 0.4rem'
          }}>
            Flowing Together
          </h1>
          <p style={{
            fontFamily: "'Lora', serif", fontSize: '0.85rem', color: tSec,
            maxWidth: 440, margin: '0 auto', fontStyle: 'italic'
          }}>
            "When minds gather in single-pointed devotion, collective evolution begins."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLUMNS: Dynamic Prana Feed */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* SOCIAL PROOF — Live count + anonymous mood cloud */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="journal-glass p-4 border border-gold/20 flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Live pulse */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative flex items-center justify-center w-8 h-8">
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute w-full h-full rounded-full bg-emerald-400/30"
                  />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ivory" style={{ fontFamily: "'Cinzel', serif" }}>
                    <motion.span
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {Math.floor(32 + Math.sin(Date.now() / 10000) * 8 + 12)}
                    </motion.span> souls reflecting
                  </p>
                  <p className="text-[9px] text-ivory/45 font-light">in this sanctuary right now</p>
                </div>
              </div>

              <div className="h-px sm:h-8 sm:w-px w-full bg-gold/15" />

              {/* Anonymous mood cloud */}
              <div className="flex-1">
                <p className="text-[9px] text-gold/55 uppercase tracking-widest font-bold mb-2">What others felt this evening</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { mood: 'Reflective', count: 14, color: '#a78bfa' },
                    { mood: 'Calm', count: 11, color: '#60a5fa' },
                    { mood: 'Tired', count: 8, color: '#9ca3af' },
                    { mood: 'Grateful', count: 6, color: '#f472b6' },
                    { mood: 'Energized', count: 5, color: '#fbbf24' },
                    { mood: 'Happy', count: 4, color: '#34d399' },
                  ].map(({ mood, count, color }) => (
                    <div
                      key={mood}
                      style={{
                        padding: '2px 9px',
                        borderRadius: 999,
                        background: `${color}18`,
                        border: `1px solid ${color}35`,
                        color,
                        fontSize: '10px',
                        fontFamily: "'Lexend', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {mood} <span style={{ opacity: 0.6, fontSize: 9 }}>×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* COMMUNITY SACRED VIBE DASHBOARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="journal-glass p-6 border border-gold/25 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative shrink-0 flex items-center justify-center w-20 h-20 rounded-full border-2 border-gold/30 bg-gold/5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-1 border border-dashed border-gold/20 rounded-full"
                />
                <Sparkles size={24} className="text-gold" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[9px] tracking-widest text-saffron uppercase font-bold">
                  Community Energy level
                </span>
                <h3 className="font-display text-2xl text-ivory font-bold mt-1">
                  {globalVibe.toLocaleString()} ✦ Prana Points
                </h3>
                <p className="text-xs text-ivory/50 font-light mt-1 leading-relaxed">
                  Every ritual completed, intention set, and vibe sent elevates our collective spiritual resonance. Flow strong, support each other!
                </p>
              </div>
            </motion.div>

            {/* FEED SECTION HEADER */}
            <div className="flex items-center gap-4 mt-2">
              <h2 className="font-display text-lg text-ivory flex items-center gap-2">
                <Compass size={18} className="text-gold" /> Sadhana Live Stream
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/35 to-transparent" />
            </div>

            {/* ACTIVITIES STREAM */}
            <div className="flex flex-col gap-4">
              {activities.map((act) => (
                <motion.div
                  key={act.id}
                  layout
                  className="journal-glass-card p-5 relative overflow-hidden border-l-4"
                  style={{ borderLeftColor: act.color }}
                >
                  <div className="flex items-start justify-between gap-4">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-gold/20 flex items-center justify-center text-xl shadow-inner">
                        {act.avatar}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-semibold text-ivory flex items-center gap-1.5">
                          {act.name}
                          <span className="flex items-center gap-0.5 text-[10px] text-gold font-sans font-bold py-0.5 px-1.5 rounded-full bg-gold/10">
                            <Flame size={10} fill="#c9933a" /> {act.streak}d
                          </span>
                        </h4>
                        <p className="text-[10px] text-gold-lt/70 mt-0.5 font-mono">
                          {act.habit} • {act.time}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] text-ivory/40">Verified Sadhana ✓</span>
                  </div>

                  <p className="text-xs md:text-sm text-ivory/80 leading-relaxed font-light mt-3">
                    "{act.text}"
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                    {/* Send Prana Button */}
                    <button
                      onClick={(e) => handleSendPrana(e, act.id)}
                      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/20 hover:border-gold/30 text-xs font-bold text-gold-lt tracking-wide transition-all select-none overflow-hidden active:scale-95"
                    >
                      <span>✦ Send Prana</span>
                      <span className="font-mono text-gold px-1.5 py-0.5 rounded bg-gold/10">
                        {act.prana}
                      </span>

                      {/* Click Particle Renderer */}
                      <AnimatePresence>
                        {particles.map((p) => (
                          <motion.span
                            key={p.id}
                            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
                            animate={{
                              x: p.x + Math.cos(p.angle) * p.distance,
                              y: p.y + Math.sin(p.angle) * p.distance,
                              scale: 0.2,
                              opacity: 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="absolute w-1.5 h-1.5 bg-gold rounded-full pointer-events-none"
                          />
                        ))}
                      </AnimatePresence>
                    </button>

                    <div className="flex items-center gap-1.5 text-ivory/40 text-xs font-light">
                      <MessageSquare size={13} />
                      <span>{act.comments} thoughts shared</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: Intention Wall ("Sankalpa Wall") */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* SANKALPA WALL CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="journal-glass p-5 border border-gold/25"
            >
              <div className="pb-3 border-b border-gold/15 mb-4">
                <h3 className="font-display text-lg text-ivory flex items-center gap-2">
                  📌 Sankalpa Wall
                </h3>
                <p className="text-[10px] text-ivory/50 font-light mt-0.5">
                  Pin your positive energy or daily focus to the wall
                </p>
              </div>

              {/* Input for new Intention */}
              <div className="flex flex-col gap-2.5 mb-5">
                <textarea
                  value={newIntention}
                  onChange={(e) => setNewIntention(e.target.value)}
                  maxLength={100}
                  placeholder="I set my intention to..."
                  rows={2}
                  className="w-full rounded-xl border border-gold/20 bg-white/5 p-3 text-xs md:text-sm text-ivory leading-relaxed placeholder:text-gold/30 placeholder:italic resize-none focus:outline-none focus:border-gold/45 transition-all"
                />
                <button
                  onClick={handleAddIntention}
                  disabled={!newIntention.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron to-gold text-white font-semibold text-xs tracking-wider shadow-md hover:shadow-lg hover:shadow-gold/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <Send size={12} /> Pin Intention (+50 Vibe)
                </button>
              </div>

              {/* Intentions List */}
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {intentions.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-gold/5 border border-gold/20 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gold/5 rounded-full blur-sm pointer-events-none" />
                      <p className="text-xs text-ivory/90 leading-relaxed italic">
                        "{item.text}"
                      </p>
                      <div className="flex justify-between items-center mt-2.5 text-[9px] text-gold-lt/70">
                        <span className="font-semibold uppercase tracking-wider">✦ {item.author}</span>
                        <span className="font-mono">{item.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* SANGHA LEADERBOARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="journal-glass p-5 border border-gold/20"
            >
              <div className="pb-2 border-b border-gold/10 mb-3 flex items-center justify-between">
                <h4 className="font-display text-sm text-ivory flex items-center gap-1.5">
                  <Award size={14} className="text-gold" /> Streak Guardians
                </h4>
                <span className="text-[9px] text-gold-lt tracking-wider uppercase font-semibold">
                  Top Consistent
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {leaders.map((member, i) => (
                  <div
                    key={member.id || i}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-ivory/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm shrink-0">{member.rank}</span>
                      <div>
                        <p className="font-medium text-ivory truncate max-w-[130px]">{member.name}</p>
                        <p className="text-[9px] text-gold-lt/60 leading-none">{member.habit}</p>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-gold text-xs flex items-center gap-0.5 shrink-0">
                      <Flame size={11} fill="#c9933a" /> {member.streak} Days
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </PageLayout>
  )
}

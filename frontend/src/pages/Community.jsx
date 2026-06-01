import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Flame, Heart, Share2, Users, Check, MessageSquare, Compass, Award } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNotif } from '../components/system/NotificationPopup'
import PageLayout from '../components/ui/PageLayout'
import LotusFlower from '../icons/LotusFlower'
import DiyaLamp from '../icons/DiyaLamp'
import communityBg from '../assets/community_bg.webp'

const DUMMY_ACTIVITIES = []
const DUMMY_INTENTIONS = []

export default function Community() {
  const { dark } = useTheme()
  const { user, isAuthenticated, token } = useAuth()
  const notif = useNotif()
  
  const [activities, setActivities] = useState(DUMMY_ACTIVITIES)
  const [intentions, setIntentions] = useState(DUMMY_INTENTIONS)
  const [newIntention, setNewIntention] = useState('')
  const [particles, setParticles] = useState([])
  const [baseVibe, setBaseVibe] = useState(1008)
  const globalVibe = baseVibe + (intentions.length * 5) + (activities.length * 5)

  const topMembers = [...activities].sort((a, b) => b.streak - a.streak).slice(0, 3)
  const medals = ['🥇', '🥈', '🥉']
  const leaders = topMembers.length > 0
    ? topMembers.map((member, i) => ({ ...member, rank: medals[i] || '⭐' }))
    : []

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
    setBaseVibe((v) => v + 5)
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
              {activities.length > 0 ? activities.map((act, i) => (
                <motion.div
                  key={act.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="journal-glass p-5 border border-gold/20 flex flex-col gap-3 relative overflow-hidden border-l-4"
                  style={{ borderLeftColor: act.color }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none" style={{
                    background: `radial-gradient(circle at top right, ${act.color || '#c9933a'}, transparent)`
                  }} />
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner bg-white/5 border border-white/10 shrink-0">
                        {act.avatar}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm text-ivory flex items-center gap-2">
                          {act.name}
                          <span className="text-[10px] text-ivory/40 font-mono font-normal">
                            {act.time}
                          </span>
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-ivory/70 border border-white/5 whitespace-nowrap">
                            {act.habit}
                          </span>
                          {act.streak > 0 && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                              <Flame size={10} /> {act.streak} Days
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-ivory/90 leading-relaxed font-light mt-1">
                    {act.text}
                  </p>

                  <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gold/10">
                    <button
                      onClick={(e) => handleSendPrana(e, act.id)}
                      className="flex items-center gap-1.5 text-[11px] text-gold/70 hover:text-gold transition-colors font-semibold uppercase tracking-wider relative"
                    >
                      <Heart size={14} className="hover:fill-gold/20" />
                      {act.prana} Prana
                    </button>
                    <button className="flex items-center gap-1.5 text-[11px] text-ivory/40 hover:text-ivory/70 transition-colors font-semibold uppercase tracking-wider">
                      <MessageSquare size={13} />
                      {act.comments}
                    </button>
                    <button className="flex items-center gap-1 text-[11px] text-ivory/40 hover:text-ivory/70 transition-colors font-semibold uppercase tracking-wider ml-auto">
                      <Share2 size={13} /> Share
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="journal-glass p-10 border border-gold/20 text-center flex flex-col items-center justify-center">
                  <Compass size={32} className="text-gold/40 mb-3" />
                  <h3 className="text-lg font-display text-ivory mb-2">The Sanctuary is Quiet</h3>
                  <p className="text-sm text-ivory/60 italic max-w-md">Be the first to share your journey today and inspire others on the path.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Intention Wall ("Sankalpa Wall") */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* SANKALPA WALL (Gen-Z pastel bubble style) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative p-5 rounded-3xl overflow-hidden shadow-xl"
              style={{
                background: dark 
                  ? 'linear-gradient(135deg, rgba(20,15,30,0.6) 0%, rgba(30,20,45,0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(250,245,255,0.7) 0%, rgba(245,235,255,0.9) 100%)',
                border: '1px solid rgba(167,139,250,0.3)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="mb-4 flex items-center justify-between relative z-10">
                <h3 className="font-display text-[15px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-indigo-400" /> Sankalpa Wall
                </h3>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-indigo-400/70">
                  Shared Intentions
                </span>
              </div>

              {/* Input Area */}
              {isAuthenticated ? (
                <div className="mb-4 flex flex-col gap-2 relative z-10">
                  <textarea
                    value={newIntention}
                    onChange={(e) => setNewIntention(e.target.value)}
                    maxLength={100}
                    placeholder="i'm focusing on..."
                    rows={2}
                    className="w-full rounded-2xl border border-indigo-200/20 dark:border-indigo-900/40 bg-white/60 dark:bg-black/20 p-3 text-[13px] text-indigo-950 dark:text-indigo-50 leading-relaxed placeholder:text-indigo-900/40 dark:placeholder:text-indigo-100/40 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 transition-all custom-scrollbar"
                  />
                  <button
                    onClick={handleAddIntention}
                    disabled={!newIntention.trim()}
                    className="w-full py-2.5 rounded-[16px] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-[11px] tracking-wide shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Send size={12} /> pin it to the wall
                  </button>
                </div>
              ) : (
                <div className="mb-4 flex flex-col gap-2 relative z-10 p-4 rounded-2xl border border-indigo-200/20 dark:border-indigo-900/40 bg-white/30 dark:bg-black/10 text-center">
                  <p className="text-[12px] text-indigo-900 dark:text-indigo-200 font-semibold mb-2">
                    Join the Sangha to share your energy
                  </p>
                  <p className="text-[10px] text-indigo-800/70 dark:text-indigo-300/70">
                    Log in to pin your intentions to the Sankalpa Wall.
                  </p>
                </div>
              )}

              {/* Intentions List (iMessage bubbles style) */}
              <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar relative z-10">
                <AnimatePresence initial={false}>
                  {intentions.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`flex flex-col max-w-[85%] ${isEven ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div className={`p-3.5 rounded-[24px] ${isEven ? 'bg-indigo-500 text-white rounded-br-[8px]' : 'bg-white/80 dark:bg-black/30 text-indigo-950 dark:text-indigo-50 rounded-bl-[8px]'} shadow-sm`}>
                          <p className="text-sm leading-snug">
                            {item.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-indigo-900/50 dark:text-indigo-100/50 px-2 font-medium">
                          <span>{item.author}</span> • <span>{item.time}</span>
                        </div>
                      </motion.div>
                    )
                  })}
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

            {/* FOUNDER'S LOG (BEHIND THE SCENES) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="journal-glass p-5 border border-gold/20"
            >
              <div className="pb-2 border-b border-gold/10 mb-3 flex items-center justify-between">
                <h4 className="font-display text-sm text-ivory flex items-center gap-1.5">
                  <Sparkles size={14} className="text-gold" /> Founder's Log
                </h4>
                <span className="text-[9px] text-gold-lt tracking-wider uppercase font-semibold">
                  Behind the Scenes
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600" alt="Building FlowState" className="w-full h-32 object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                    <p className="text-xs text-ivory font-semibold mb-1">Building the new Chakra Portal 🧘‍♀️</p>
                    <p className="text-[9px] text-ivory/60">It took 5 iterations to get the glowing aura right without slowing down the site! I really want this to feel like real pranayama. - Ashiya</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600" alt="Sketching Ideas" className="w-full h-32 object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                    <p className="text-xs text-ivory font-semibold mb-1">Why I ditched generic features</p>
                    <p className="text-[9px] text-ivory/60">I realized today that people don't want perfection, they want connection. Rebuilding the community page to feel more human. Let me know what you think!</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CO-BUILD WITH ASHIYA (FEEDBACK) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 p-6 rounded-[32px] border border-orange-200/50 dark:border-orange-500/10 shadow-lg relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 text-9xl opacity-[0.03] dark:opacity-[0.05] pointer-events-none">✨</div>
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-300 dark:border-orange-500/30">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Ashiya" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-orange-950 dark:text-orange-100 text-lg">Co-build with Ashiya 🛠️</h4>
                  <p className="text-[10px] text-orange-800/70 dark:text-orange-200/70 font-medium">help me make this sanctuary better for you</p>
                </div>
              </div>
              <textarea
                placeholder="what feature should I build next? what feels missing? tell me bestie..."
                rows={3}
                className="w-full rounded-[20px] border-none bg-white/60 dark:bg-black/20 p-4 text-xs text-orange-950 dark:text-orange-50 leading-relaxed placeholder:text-orange-900/40 dark:placeholder:text-orange-100/40 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all mb-3 relative z-10 custom-scrollbar"
              />
              <button
                className="w-full py-3 rounded-[16px] bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold text-[11px] tracking-wide shadow-md transition-transform active:scale-95 relative z-10"
                onClick={() => notif("Feedback sent straight to Ashiya! 💌", "success")}
              >
                Send to Ashiya
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </PageLayout>
  )
}

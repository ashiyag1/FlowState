import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Heart, ShieldAlert, BarChart3, TrendingUp, Settings } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import PageLayout from '../components/ui/PageLayout'
import adminBg from '../assets/community_bg.webp' // Reusing a bg for now

export default function AdminDashboard() {
  const { dark } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Seekers', value: '1,284', trend: '+12%', icon: Users, color: '#34d399' },
    { label: 'Daily Active', value: '456', trend: '+5%', icon: Activity, color: '#60a5fa' },
    { label: 'Prana Exchanged', value: '84.5k', trend: '+22%', icon: Heart, color: '#f472b6' },
    { label: 'Flagged Content', value: '2', trend: '-1', icon: ShieldAlert, color: '#fbbf24' },
  ]

  const recentUsers = [
    { id: 1, name: 'Ananya S.', joined: '2 hours ago', status: 'Active' },
    { id: 2, name: 'Rohan K.', joined: '5 hours ago', status: 'Active' },
    { id: 3, name: 'Meera V.', joined: '1 day ago', status: 'Inactive' },
    { id: 4, name: 'Dev P.', joined: '2 days ago', status: 'Active' },
  ]

  return (
    <PageLayout>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `url(${adminBg}) center/cover no-repeat fixed`,
        filter: dark ? 'brightness(0.3) saturate(1.0)' : 'brightness(0.9) saturate(1.1)',
        opacity: dark ? 0.9 : 0.6,
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink dark:text-ivory">Founder's Control Center</h1>
            <p className="text-sm text-ink-soft dark:text-ivory/60 mt-1">Manage the sanctuary and monitor community vibes.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-white/5 border border-gold/20 text-gold hover:bg-gold/10 transition-colors">
              <Settings size={20} />
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-saffron to-gold text-white font-semibold text-sm shadow-lg hover:shadow-gold/20 transition-all">
              New Founder's Log
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 dark:bg-black/20 border border-gold/10 backdrop-blur-md relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                  <s.icon size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {s.trend}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink dark:text-ivory mb-1">{s.value}</h3>
              <p className="text-xs text-ink-soft dark:text-ivory/50 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-white/5 dark:bg-black/20 border border-gold/10 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-ink dark:text-ivory flex items-center gap-2">
                <BarChart3 size={20} className="text-gold" />
                Growth Trajectory
              </h2>
            </div>
            {/* Fake Chart Area */}
            <div className="h-64 w-full flex items-end justify-between gap-2 pt-10 border-b border-gold/20 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
              {[40, 55, 45, 60, 80, 75, 90, 85, 100, 95, 110, 120].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className="w-full bg-gradient-to-t from-saffron to-gold rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-ink-soft dark:text-ivory/40 uppercase tracking-widest">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-white/5 dark:bg-black/20 border border-gold/10 backdrop-blur-md flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-ink dark:text-ivory flex items-center gap-2">
                <Users size={20} className="text-gold" />
                New Seekers
              </h2>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-semibold text-ink dark:text-ivory">{u.name}</p>
                    <p className="text-[10px] text-ink-soft dark:text-ivory/50">{u.joined}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 rounded-xl border border-gold/30 text-xs font-bold text-gold uppercase tracking-widest hover:bg-gold/10 transition-colors">
              View All Members
            </button>
          </motion.div>
        </div>

      </div>
    </PageLayout>
  )
}

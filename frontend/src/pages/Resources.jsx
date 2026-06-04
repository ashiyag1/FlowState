import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Compass, Music, Sparkles, Search, ExternalLink, ArrowLeft, Heart } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import PageLayout from '../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import LotusFlower from '../icons/LotusFlower'

const RESOURCES = [
  {
    id: 'res-1',
    category: 'philosophy',
    title: 'Patanjali Yoga Sutras',
    author: 'Patanjali · ~400 CE',
    desc: 'The definitive foundational text mapping the eight limbs of yoga and the systematic calming of the mind\'s fluctuations.',
    type: 'Sacred Text',
    linkText: 'Read translation',
    badge: 'Mind Architecture',
    color: '#a78bfa'
  },
  {
    id: 'res-2',
    category: 'wellness',
    title: 'Charaka Samhita',
    author: 'Agnivesha / Charaka · ~300 BCE',
    desc: 'One of the foundational textbooks of Ayurveda, detailing systemic dietetics, preventative medicine, and the concept of balance.',
    type: 'Ayurvedic Classic',
    linkText: 'Explore treatise',
    badge: 'Diet & Vigor',
    color: '#34d399'
  },
  {
    id: 'res-3',
    category: 'philosophy',
    title: 'Bhagavad Gita',
    author: 'Sage Vyasa',
    desc: 'A 700-verse dialogue on duty, spiritual focus, and selfless execution (Karma Yoga) amidst life\'s conflicts.',
    type: 'Sadhana Guide',
    linkText: 'View translations',
    badge: 'Self-Mastery',
    color: '#fbbf24'
  },
  {
    id: 'res-4',
    category: 'heritage',
    title: 'Chandah Sutra',
    author: 'Pingala · ~200 BCE',
    desc: 'The ancient textbook on Sanskrit metrics that first laid down the binary representation of syllables, combinatorics, and Pascal\'s triangle.',
    type: 'Ancient Science',
    linkText: 'Read math study',
    badge: 'Binary Origin',
    color: '#60a5fa'
  },
  {
    id: 'res-5',
    category: 'audio',
    title: 'Morning Bansuri Flute Loop',
    author: 'Curated by Ashiya',
    desc: 'A calming, ambient loop of North Indian bamboo flute, set at 432Hz to ground your nervous system during morning sadhana.',
    type: 'Soundscape',
    linkText: 'Listen in Sanctuary',
    badge: '432Hz Ambient',
    color: '#f472b6'
  },
  {
    id: 'res-6',
    category: 'audio',
    title: 'Sitar & Tanpura grounding drone',
    author: 'Classical Ragas',
    desc: 'Deep tanpura resonance tuned to the key of C#, accompanied by soft acoustic sitar leads. Highly recommended for Trataka practice.',
    type: 'Dhrupad BGM',
    linkText: 'Play background track',
    badge: 'Focus Anchor',
    color: '#f472b6'
  },
  {
    id: 'res-7',
    category: 'wellness',
    title: 'Sushruta Samhita',
    author: 'Sushruta · ~600 BCE',
    desc: 'An ancient Sanskrit text on medicine and surgery, famous for detailed descriptions of reconstructive surgery, surgical tools, and botanical remedies.',
    type: 'Medical Classic',
    linkText: 'Explore archives',
    badge: 'Early Surgery',
    color: '#34d399'
  },
  {
    id: 'res-8',
    category: 'philosophy',
    title: 'The Upanishads',
    author: 'Vedic Rishis',
    desc: 'Philosophical texts exploring the nature of ultimate reality (Brahman) and the individual soul (Atman). The source of non-dual meditation.',
    type: 'Non-Dual Wisdom',
    linkText: 'Read translations',
    badge: 'Vedanta Roots',
    color: '#fbbf24'
  }
]

export default function Resources() {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const tPri = dark ? '#f5e6c8' : '#2D1F0E'
  const tSec = dark ? '#c9b080' : '#8A6E4E'

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(res => {
      const matchCat = filter === 'all' || res.category === filter
      const matchSearch = res.title.toLowerCase().includes(search.toLowerCase()) ||
                          res.desc.toLowerCase().includes(search.toLowerCase()) ||
                          res.badge.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [filter, search])

  return (
    <PageLayout>
      {/* Background Cover */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: dark 
          ? 'radial-gradient(circle at 10% 20%, rgba(28, 18, 8, 0.45) 0%, rgba(10, 5, 2, 0.95) 100%)' 
          : 'radial-gradient(circle at 10% 20%, rgba(254, 252, 247, 0.5) 0%, rgba(253, 246, 236, 0.95) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '5rem 1.2rem 4rem' }}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', color: '#c8a96e',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', cursor: 'pointer', fontFamily: 'sans-serif',
            marginBottom: '1.5rem', fontWeight: 600
          }}
        >
          <ArrowLeft size={14} /> Back to Sanctuary
        </button>

        {/* Hero title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '8px', color: '#c8a96e' }}>
            <LotusFlower size={36} />
          </div>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.28em',
            color: '#E8622A', textTransform: 'uppercase', marginBottom: '0.35rem'
          }}>
            ✦ CURATED REPOSITORIES ✦
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2.6rem',
            fontWeight: 400, color: tPri, lineHeight: 1.1, margin: '0 auto 0.4rem'
          }}>
            Ashiya's Sutras
          </h1>
          <p style={{
            fontFamily: "'Lora', serif", fontSize: '0.85rem', color: tSec,
            maxWidth: 480, margin: '0 auto', fontStyle: 'italic'
          }}>
            "curated guides, ancient manuals, and soundscapes handpicked to assist your daily contemplation."
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '2rem'
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#c8a96e',
              opacity: 0.7
            }} />
            <input
              type="text"
              placeholder="Search titles, keywords, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: '16px',
                border: dark ? '0.5px solid rgba(232, 213, 176, 0.22)' : '0.5px solid rgba(139, 105, 20, 0.18)',
                background: dark ? 'rgba(0,0,0,0.2)' : '#fff',
                color: dark ? '#f5e6c8' : '#2D1F0E',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'sans-serif'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#c8a96e', opacity: 0.7, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>&times;</span>
              </button>
            )}
          </div>

          {/* Filter Categories */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {[
              { id: 'all', label: 'All Resources', icon: Compass },
              { id: 'philosophy', label: 'Philosophy', icon: BookOpen },
              { id: 'wellness', label: 'Wellness', icon: LotusFlower },
              { id: 'heritage', label: 'Ancient Science', icon: Sparkles },
              { id: 'audio', label: 'Sadhana Audio', icon: Music },
            ].map(cat => {
              const Icon = cat.icon
              const isActive = filter === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '99px',
                    border: '0.5px solid #e8d5b0',
                    fontSize: '12px',
                    color: isActive ? '#2c1a00' : (dark ? '#e8c97a' : '#8B6914'),
                    background: isActive ? '#c8a96e' : (dark ? 'rgba(0,0,0,0.15)' : '#fff'),
                    fontWeight: isActive ? 600 : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontFamily: 'sans-serif'
                  }}
                >
                  <Icon size={12} /> {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px'
        }}>
          <AnimatePresence mode="popLayout">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, i) => (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  style={{
                    background: dark 
                      ? 'linear-gradient(135deg, rgba(32, 22, 11, 0.85) 0%, rgba(20, 12, 5, 0.82) 100%)' 
                      : 'linear-gradient(135deg, #fffcf8 0%, #fdf6ec 100%)',
                    border: dark ? '0.5px solid rgba(232, 213, 176, 0.22)' : '0.5px solid rgba(139, 105, 20, 0.18)',
                    borderTop: `2px solid ${res.color || '#c8a96e'}`,
                    borderRadius: '16px',
                    padding: '20px 24px',
                    boxShadow: dark ? '0 10px 30px rgba(0, 0, 0, 0.35)' : '0 10px 30px rgba(44, 26, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px',
                      color: res.color || '#c8a96e',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontFamily: 'sans-serif'
                    }}>
                      {res.type}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: dark ? '#f5e6c8' : '#8b7355',
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(139, 105, 20, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontWeight: 600,
                      fontFamily: 'sans-serif'
                    }}>
                      {res.badge}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '20px',
                    color: dark ? '#f5e6c8' : '#2c1a00',
                    fontWeight: 600,
                    margin: 0
                  }}>
                    {res.title}
                  </h3>

                  <p style={{
                    fontSize: '11px',
                    color: dark ? 'rgba(245, 230, 200, 0.6)' : '#8b7355',
                    fontFamily: 'sans-serif',
                    margin: 0,
                    fontWeight: 500
                  }}>
                    {res.author}
                  </p>

                  <p style={{
                    fontSize: '13px',
                    color: dark ? '#fdf6ec' : '#332211',
                    lineHeight: 1.5,
                    fontFamily: 'sans-serif',
                    margin: '4px 0 8px 0',
                    fontWeight: 300
                  }}>
                    {res.desc}
                  </p>

                  <button
                    onClick={() => {
                      if (res.category === 'audio') {
                        navigate('/')
                      } else if (res.url) {
                        window.open(res.url, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    disabled={res.category !== 'audio' && !res.url}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#c8a96e',
                      cursor: (res.category !== 'audio' && !res.url) ? 'not-allowed' : 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontWeight: 600,
                      fontFamily: 'sans-serif',
                      width: 'fit-content',
                      opacity: (res.category !== 'audio' && !res.url) ? 0.5 : 1
                    }}
                  >
                    {res.linkText} {(res.category === 'audio' || !res.url) ? null : <ExternalLink size={11} />}
                  </button>
                </motion.div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed #e8d5b0',
                borderRadius: '16px',
                color: '#c8a96e'
              }}>
                No matches found in Ashiya's scriptures. Try another query.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </PageLayout>
  )
}

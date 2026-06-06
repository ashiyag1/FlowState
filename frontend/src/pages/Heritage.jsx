import { useState, useEffect, useMemo, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { Play, Pause } from 'lucide-react'

// Import components and data
import HeritageSnapCard from '../components/heritage/HeritageSnapCard'
import { CONCEPT_STORIES, CURIOSITY_STORIES, SCHOLARS } from '../data/heritageData'
import heritageBg from '../assets/heritage/heritage_bg.webp'

// Re-export ALL_HERITAGE_STORIES to maintain public API contracts
export { ALL_HERITAGE_STORIES } from '../data/heritageData'

function Heritage() {
  const { dark } = useTheme()
  const { startWisdomAmbience, stopWisdomAmbience } = useSoundEffects()
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const lastExpandedIdRef = useRef(null)

  // Flatten all stories into a single feed array, interleaved
  const FEED = useMemo(() => {
    const items = [
      ...SCHOLARS.map(s => ({
        id: 'scholar-' + s.id,
        type: 'scholar',
        image: s.img,
        title: s.name,
        subtitle: s.title,
        body: s.desc,
        accent: s.color,
        readMore: s.story.paragraphs
      })),
      ...CONCEPT_STORIES.map((c, i) => ({
        id: 'concept-' + i,
        type: 'concept',
        image: heritageBg,
        title: c.title,
        subtitle: c.source,
        body: c.paragraphs[0],
        accent: '#c9a84c',
        readMore: c.paragraphs
      })),
      ...CURIOSITY_STORIES.map((c, i) => ({
        id: 'curiosity-' + i,
        type: 'curiosity',
        image: heritageBg,
        title: c.title,
        subtitle: c.source,
        body: c.paragraphs[0],
        accent: '#e87722',
        readMore: c.paragraphs
      }))
    ]
    
    // Pseudo-random deterministic shuffle seeded by today's date
    const todaySeed = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    let seed = parseInt(todaySeed, 10)
    const random = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }

    let m = items.length, t, i
    const shuffled = [...items]
    while (m) {
      i = Math.floor(random() * m--)
      t = shuffled[m]
      shuffled[m] = shuffled[i]
      shuffled[i] = t
    }
    return shuffled
  }, [])

  const togglePlaySound = () => {
    if (isPlayingSound) {
      stopWisdomAmbience()
      setIsPlayingSound(false)
    } else {
      startWisdomAmbience('sitarBgm')
      setIsPlayingSound(true)
    }
  }

  useEffect(() => {
    return () => stopWisdomAmbience()
  }, [stopWisdomAmbience])

  // Scroll expanded story to top when opened, and restore snap alignment when collapsed
  useEffect(() => {
    if (expandedId) {
      lastExpandedIdRef.current = expandedId
      const el = document.getElementById(expandedId)
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    } else if (lastExpandedIdRef.current) {
      const el = document.getElementById(lastExpandedIdRef.current)
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
      lastExpandedIdRef.current = null
    }
  }, [expandedId])

  return (
    <div style={{ height: '100dvh', width: '100vw', background: dark ? '#050301' : '#1a1005', overflow: 'hidden' }}>
      
      {/* Absolute top navbar area overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '4.5rem 1.5rem 1.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
        pointerEvents: 'none'
      }}>
        <div style={{ fontFamily: 'Cinzel, serif', color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '0.1em', pointerEvents: 'auto' }}>
          Heritage <span style={{ color: '#c9a84c' }}>Feed</span>
        </div>
        <button onClick={togglePlaySound} style={{ color: '#fff', padding: 10, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', backdropFilter: 'blur(10px)', pointerEvents: 'auto', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
          {isPlayingSound ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Snap Scroll Container */}
      <div style={{
        height: '100dvh',
        overflowY: 'scroll',
        scrollSnapType: expandedId ? 'none' : 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }} className="hide-scrollbar">
        {FEED.map((item, index) => (
          <HeritageSnapCard
            key={item.id}
            item={item}
            index={index}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        ))}
      </div>
      
      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default Heritage
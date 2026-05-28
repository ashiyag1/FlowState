const fs = require('fs');
const path = './frontend/src/pages/Heritage.jsx';
const content = fs.readFileSync(path, 'utf8');
const funcStart = content.indexOf('function Heritage() {');
const dataPart = content.substring(0, funcStart);
const newComponent = `function Heritage() {
  const { dark } = useTheme()
  const { startWisdomAmbience, stopWisdomAmbience } = useSoundEffects()
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const navigate = useNavigate()

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
    
    // Deterministic shuffle
    let m = items.length, t, i
    const shuffled = [...items]
    while (m) {
      i = Math.floor(Math.random() * m--)
      t = shuffled[m]
      shuffled[m] = shuffled[i]
      shuffled[i] = t
    }
    return shuffled
  }, [])

  const [expandedId, setExpandedId] = useState(null)

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
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
      }} className="hide-scrollbar">
        {FEED.map((item) => (
          <div key={item.id} style={{
            height: '100dvh',
            width: '100%',
            scrollSnapAlign: 'start',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
            {/* Background Image */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(' + item.image + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: item.type === 'scholar' ? 'brightness(0.7) contrast(1.1)' : 'brightness(0.3) saturate(1.2)'
            }} />
            
            {/* Gradient Overlay for Text Readability */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(0deg, rgba(5,3,1,1) 0%, rgba(5,3,1,0.85) 30%, rgba(5,3,1,0.3) 60%, transparent 100%)'
            }} />

            {/* Content Area */}
            <div style={{
              position: 'relative', zIndex: 10,
              padding: '2rem 1.5rem 7rem 1.5rem', // Bottom padding accounts for mobile nav
              color: '#fff',
              maxWidth: '800px',
              margin: '0 auto',
              width: '100%'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.6 }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, ' + item.accent + ', ' + item.accent + '88)',
                  color: '#fff',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1.2rem',
                  boxShadow: '0 4px 12px ' + item.accent + '44'
                }}>
                  {item.type}
                </div>

                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  lineHeight: '1.05',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  color: '#fff'
                }}>
                  {item.title}
                </h2>
                
                <p style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '1.2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '500'
                }}>
                  {item.subtitle}
                </p>

                <p style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '1.5rem',
                  display: expandedId === item.id ? 'block' : '-webkit-box',
                  WebkitLineClamp: expandedId === item.id ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                  {item.body}
                </p>

                {expandedId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginBottom: '1.5rem' }}
                  >
                    {item.readMore.slice(item.type === 'scholar' ? 0 : 1).map((p, i) => (
                      <p key={i} style={{
                        fontFamily: 'Lora, serif',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.95)',
                        marginBottom: '1rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}>{p}</p>
                    ))}
                  </motion.div>
                )}

                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: item.accent,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid ' + item.accent + '66',
                    padding: '10px 20px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  {expandedId === item.id ? 'Show Less' : 'Read Full Story'} 
                  <ChevronRight size={18} style={{ transform: expandedId === item.id ? 'rotate(-90deg)' : 'none', transition: '0.3s' }} />
                </button>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Hide scrollbar styles */}
      <style>{\`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      \`}</style>
    </div>
  )
}

export default Heritage;`;

fs.writeFileSync(path, dataPart + newComponent);

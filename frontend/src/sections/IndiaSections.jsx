import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { INDIA_LEGACY } from '../utils'
import SectionHeading from '../components/SectionHeading'
import OrnateDivider from '../components/OrnateDivider'
import DiyaLamp from '../icons/DiyaLamp'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function IndiaSections() {
  const { dark } = useTheme()
  const legacyRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIdx, setActiveIdx] = useState(null)

  const updateArrows = () => {
    const el = legacyRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6)
  }

  useEffect(() => {
    const el = legacyRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows)
    updateArrows()
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [])

  const scrollLegacy = (dir) => {
    const el = legacyRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  return (
    <section style={sectionStyles.outer(dark)}>
      <div style={sectionStyles.glow(dark)} aria-hidden />

      <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <SectionHeading eyebrow="भारत का गौरव" title="India's" accent="ancient greatness." accentColor="#d97706" />
      </motion.div>
      <OrnateDivider symbol="🪔" />

      <div style={carouselStyles.wrapper}>
        {canScrollLeft && <div style={carouselStyles.leftFade(dark)} />}
        {canScrollRight && <div style={carouselStyles.rightFade(dark)} />}

        <div ref={legacyRef} style={carouselStyles.track}>
          {(INDIA_LEGACY || []).map((item, i) => {
            const active = activeIdx === i
            return (
              <motion.div
                key={item.title}
                style={carouselStyles.slot}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => setActiveIdx(active ? null : i)}
              >
                <div 
                  className="fs-sandstone-tablet fs-gold-corner-card"
                  style={{
                    ...carouselStyles.card(dark),
                    ...(active ? carouselStyles.cardActive(dark) : {}),
                    borderColor: active
                      ? 'rgba(217,119,6,0.5)'
                      : dark
                        ? 'rgba(201,168,76,0.18)'
                        : 'rgba(201,168,76,0.28)',
                    padding: '1.2rem 1.1rem 0.9rem',
                  }}
                >
                  <div style={carouselStyles.topBorder(active)} />

                  <div style={carouselStyles.cardHeader}>
                    <div style={carouselStyles.iconWrap(dark)}>
                      {item.icon}
                    </div>
                    <div style={carouselStyles.cardTitleGroup}>
                      <h3 style={carouselStyles.title(dark)}>{item.title}</h3>
                      <p style={carouselStyles.subtitle}>{item.subtitle}</p>
                    </div>
                    <span style={carouselStyles.ornament}>✦</span>
                  </div>

                  <div style={carouselStyles.divider(dark)} />

                  <div style={{
                    maxHeight: active ? '140px' : '44px',
                    transition: 'max-height 0.55s cubic-bezier(0.22,1,0.36,1)',
                    overflow: 'hidden',
                  }}>
                    <p style={carouselStyles.desc(dark)}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
          <div style={{ flexShrink: 0, width: '4px' }} />
        </div>

        {/* Tactile Wooden Shelf with Glowing oil Diyas */}
        <div className="relative mt-[-4px] mx-[0.5rem] z-10 flex items-end justify-between pointer-events-none">
          {/* Left Diya */}
          <div style={{ transform: 'translateY(16px) translateX(6px)', filter: 'drop-shadow(0 -4px 8px rgba(232,119,34,0.35))' }} className="z-20">
            <DiyaLamp size={38} />
          </div>

          {/* Shelf Body */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="fs-wooden-shelf-top h-[3px]" />
            <div className="fs-wooden-shelf-decor h-[6px] rounded-b-[3px]" />
            <div className="h-[6px] bg-gradient-to-b from-black/25 to-transparent rounded-b-[4px]" />
          </div>

          {/* Right Diya */}
          <div style={{ transform: 'translateY(16px) translateX(-6px)', filter: 'drop-shadow(0 -4px 8px rgba(232,119,34,0.35))' }} className="z-20">
            <DiyaLamp size={38} />
          </div>
        </div>

        <div style={carouselStyles.arrows}>
          <button style={{ ...carouselStyles.arrow, opacity: canScrollLeft ? 0.85 : 0.2 }} onClick={() => scrollLegacy(-1)} disabled={!canScrollLeft}>‹</button>
          <button style={{ ...carouselStyles.arrow, opacity: canScrollRight ? 0.85 : 0.2 }} onClick={() => scrollLegacy(1)} disabled={!canScrollRight}>›</button>
        </div>
      </div>
    </section>
  )
}

const sectionStyles = {
  outer: (dark) => ({
    position: 'relative',
    marginBottom: '2.5rem',
    overflow: 'hidden',
  }),
  glow: (dark) => ({
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(90vw, 800px)',
    height: '180px',
    background: dark
      ? 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)'
      : 'radial-gradient(ellipse at center, rgba(217,119,6,0.04) 0%, rgba(255,200,100,0.03) 40%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  }),
}

const carouselStyles = {
  wrapper: {
    position: 'relative',
    margin: '0.5rem 0 0.5rem',
    zIndex: 1,
  },
  track: {
    display: 'flex',
    gap: '14px',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '0.75rem 0.5rem 0.35rem',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollSnapType: 'x mandatory',
    position: 'relative',
    zIndex: 2,
  },
  slot: {
    flexShrink: 0,
    width: '272px',
    scrollSnapAlign: 'start',
    position: 'relative',
    zIndex: 3,
  },
  card: (dark) => ({
    position: 'relative',
    borderRadius: '12px',
    padding: '1.15rem 1.1rem 0.9rem',
    border: '1px solid',
    background: dark
      ? 'linear-gradient(165deg, rgba(44,32,16,0.75), rgba(30,22,10,0.6))'
      : 'linear-gradient(165deg, rgba(255,251,240,0.96), rgba(250,240,215,0.92))',
    backdropFilter: 'blur(2px)',
    transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
    cursor: 'pointer',
    minHeight: '170px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: dark
      ? '0 2px 8px rgba(0,0,0,0.12)'
      : '0 2px 8px rgba(92,61,30,0.04)',
  }),
  cardActive: (dark) => ({
    transform: 'translateY(-2px)',
    boxShadow: dark
      ? '0 6px 18px rgba(0,0,0,0.16), 0 0 0 1px rgba(217,119,6,0.06)'
      : '0 6px 18px rgba(92,61,30,0.06), 0 0 0 1px rgba(217,119,6,0.05)',
    background: dark
      ? 'linear-gradient(165deg, rgba(52,38,20,0.82), rgba(36,26,12,0.68))'
      : 'linear-gradient(165deg, rgba(255,252,245,0.98), rgba(253,244,222,0.95))',
  }),
  topBorder: (active) => ({
    height: '2px',
    margin: '-1.15rem -1.1rem 0.75rem',
    borderRadius: '12px 12px 0 0',
    background: active
      ? 'linear-gradient(90deg, rgba(217,119,6,0.12), rgba(217,119,6,0.3), rgba(217,119,6,0.12))'
      : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '0.5rem',
  },
  iconWrap: (dark) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '38px', height: '38px', borderRadius: '8px',
    background: dark ? 'rgba(217,119,6,0.06)' : 'rgba(217,119,6,0.05)',
    fontSize: '1.1rem', flexShrink: 0,
    border: `1px solid ${dark ? 'rgba(217,119,6,0.04)' : 'rgba(217,119,6,0.06)'}`,
  }),
  cardTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  title: (dark) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1rem', fontWeight: 600,
    color: 'var(--bark)',
    margin: 0,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  subtitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '0.55rem', fontWeight: 700,
    color: '#d97706',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ornament: {
    fontSize: '0.55rem',
    color: '#c9a84c',
    opacity: 0.25,
    flexShrink: 0,
  },
  divider: (dark) => ({
    height: '1px',
    marginBottom: '0.5rem',
    background: dark
      ? 'linear-gradient(90deg, rgba(201,168,76,0.04), rgba(201,168,76,0.12), rgba(201,168,76,0.04))'
      : 'linear-gradient(90deg, rgba(201,168,76,0.05), rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
  }),
  desc: (dark) => ({
    fontFamily: "'Lora', serif",
    fontSize: '0.72rem',
    color: dark ? '#b0a078' : '#6a5a40',
    lineHeight: 1.5,
    margin: 0,
  }),
  shelfTop: {
    position: 'relative',
    zIndex: 1,
    height: '3px',
    margin: '-2px 0.5rem 0',
    background: 'linear-gradient(90deg, transparent 2%, #8a6a30 10%, #b89048 25%, #d4a850 50%, #b89048 75%, #8a6a30 90%, transparent 98%)',
    borderRadius: '2px 2px 0 0',
  },
  shelfBody: {
    position: 'relative',
    zIndex: 1,
    height: '5px',
    margin: '0 0.5rem',
    background: 'linear-gradient(180deg, #7a5a28, #4a3018)',
    borderRadius: '0 0 3px 3px',
  },
  shelfShadow: {
    position: 'relative',
    zIndex: 0,
    height: '5px',
    margin: '0 0.7rem',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.08), transparent)',
    borderRadius: '0 0 4px 4px',
  },
  leftFade: (dark) => ({
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '30px', zIndex: 4,
    background: dark
      ? 'linear-gradient(90deg, rgba(18,12,4,0.65), transparent)'
      : 'linear-gradient(90deg, rgba(254,252,245,0.65), transparent)',
    pointerEvents: 'none',
  }),
  rightFade: (dark) => ({
    position: 'absolute', right: 0, top: 0, bottom: 0, width: '30px', zIndex: 4,
    background: dark
      ? 'linear-gradient(270deg, rgba(18,12,4,0.65), transparent)'
      : 'linear-gradient(270deg, rgba(254,252,245,0.65), transparent)',
    pointerEvents: 'none',
  }),
  arrows: {
    display: 'flex', justifyContent: 'flex-end', gap: '0.4rem',
    marginTop: '0.35rem', paddingRight: '0.4rem',
    position: 'relative',
    zIndex: 5,
  },
  arrow: {
    width: '30px', height: '30px', borderRadius: '50%', border: 'none',
    background: 'linear-gradient(135deg, #c9a84c, #8b6914)',
    color: '#fff', fontSize: '1.1rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(139,105,20,0.12)',
    transition: 'opacity 0.2s',
  },
}

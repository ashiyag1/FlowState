import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useWisdomCarousel } from '../hooks/useWisdomCarousel'
import { useSoundEffects } from '../hooks/useSoundEffects'
import SectionHeading from '../components/ui/SectionHeading'
import { fetchAIQuote, getDailyQuote, Store, today } from '../utils'
import chaiImage from '../assets/wiscarousel/chai.webp'
import sitarImage from '../assets/wiscarousel/sitar.webp'
import flute from '../assets/wiscarousel/sukoon.webp'
import jaipurImage from '../assets/wiscarousel/jaipur1.webp'
import jasmineImage from '../assets/wiscarousel/Disney Princess Aesthetic _ Jasmine.webp'

const SLIDES = [
  {
    tag: 'Yoga & Meditation',
    title: 'Still the mind,\nfree the soul',
    body: 'Yoga daily lowers stress hormones, rewires the brain for focus, and helps you stay present. India\'s timeless wellness gift to the world.',
    stat: '5,000',
    statLabel: 'years of Indian yoga wisdom',
    image: chaiImage,
  },
  {
    tag: 'Water & Prana',
    title: 'Water is life.\nPrana is water.',
    body: 'Charaka Samhita called water the first medicine. Just 2% dehydration drops focus and mood. Keep your system hydrated and clear.',
    stat: '75%',
    statLabel: 'of your brain is water',
    image: sitarImage,
  },
  {
    tag: 'Sleep & Ayurveda',
    title: "Sleep is\nBrahma's reset",
    body: 'Ayurveda names sleep (Nidra) as a main pillar of life. Rest restores brain health, heals the body, and prepares your mind for the next day.',
    stat: '3x',
    statLabel: 'more productive with quality sleep',
    image: flute,
  },
  {
    tag: 'Movement & Prana',
    title: 'Body in motion,\nsoul in flow',
    body: 'Surya Namaskar blends movement with quiet devotion. Even brief daily physical activity cuts anxiety and restores your biological rhythm.',
    stat: '30 min',
    statLabel: 'changes everything',
    image: jaipurImage,
  },
  {
    tag: 'Naam Jaap',
    title: 'The vibration\nthat heals',
    body: 'Repeating a calming sound, like Om or Ram, stimulates the vagus nerve, slows your heart rate, and shifts your brain waves to a relaxed alpha state.',
    stat: '108x',
    statLabel: 'the sacred count of jaap',
    image: jasmineImage,
  },
]

const ERA_COLORS = {
  dharma: '#D4A84B',
  yoga: '#6B9E78',
  wisdom: '#7B8DC8',
  health: '#5DCAA5',
  ayurveda: '#8FB86A',
  mindfulness: '#A08BBF',
  habits: '#E87722',
  cosmos: '#4BBFD4',
  compassion: '#E88080',
  motivation: '#E87722',
}

export function QuoteScroll({ sankalpa }) {
  const [quoteIdx, setQuoteIdx] = useState(() => {
    const d = new Date()
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
    const optionsCount = sankalpa?.wisdomOptions?.length || 1
    return seed % optionsCount
  })

  useEffect(() => {
    const d = new Date()
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
    const optionsCount = sankalpa?.wisdomOptions?.length || 1
    setQuoteIdx(seed % optionsCount)
  }, [sankalpa])

  const handleRefresh = () => {
    if (sankalpa?.wisdomOptions) {
      setQuoteIdx((prev) => (prev + 1) % sankalpa.wisdomOptions.length)
    }
  }

  const quote = sankalpa?.wisdomOptions?.[quoteIdx] || {
    wis: '"What you seek is seeking you."',
    src: 'Rumi',
    ref: '— on the journey'
  }

  const displayQuote = quote.wis
  const accentColor = '#D4A84B'

  return (
    <div className="fs-wisdom-scroll">
      <span className="fs-scroll-rod fs-scroll-rod-left" aria-hidden />
      <span className="fs-scroll-rod fs-scroll-rod-right" aria-hidden />

      <button
        className="fs-quote-refresh"
        onClick={handleRefresh}
        aria-label="Refresh quote"
        title="Get a new quote"
      >
        <RefreshCw size={13} />
      </button>

      <AnimatePresence mode="wait">
        {quote ? (
          <motion.div
            key={displayQuote?.slice(0, 24)}
            className="fs-quote-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}
          >
            <div className="fs-quote-mark" style={{ color: accentColor, margin: '0 auto 12px' }}>
              "
            </div>
            <blockquote>"{displayQuote}"</blockquote>
            <div className="fs-quote-author">- {quote.src}</div>
            {quote.ref && (
              <div className="fs-quote-source" style={{ textAlign: 'center' }}>{quote.ref}</div>
            )}

          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function SlideCard({ slide }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.title}
        className="fs-wisdom-glass overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="fs-wisdom-om" aria-hidden>
          Om
        </span>

        {/* Slow spinning Mandala watermark */}
        <svg
          className="absolute right-[-45px] bottom-[-45px] opacity-[0.08] text-gold dark:text-gold-lt pointer-events-none fs-mandala-spin"
          style={{ width: 170, height: 170 }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="36" />
          <circle cx="50" cy="50" r="26" />
          <circle cx="50" cy="50" r="16" />
          {Array.from({ length: 12 }).map((_, idx) => {
            const angle = (idx * 360) / 12
            return (
              <g key={idx} transform={`rotate(${angle} 50 50)`}>
                <path d="M50 4 C46 22, 54 22, 50 4" />
                <path d="M50 14 C48 26, 52 26, 50 14" />
                <line x1="50" y1="4" x2="50" y2="50" strokeDasharray="1,1" />
              </g>
            )
          })}
        </svg>

        <span className="fs-wisdom-pill">{slide.tag}</span>
        <h3>{slide.title}</h3>
        <p>{slide.body}</p>
        <div className="fs-wisdom-stat">
          <strong>{slide.stat}</strong>
          <span>{slide.statLabel}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function CarouselControls({ total, current, onPrev, onNext, onDot }) {
  return (
    <div className="fs-wisdom-controls">
      <button onClick={onPrev} aria-label="Previous wisdom slide">
        <ChevronLeft size={20} />
      </button>
      <div className="fs-wisdom-dots">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            aria-label={`Slide ${i + 1}`}
            className={i === current ? 'active' : ''}
          />
        ))}
      </div>
      <button onClick={onNext} aria-label="Next wisdom slide">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export function WisdomStyles() {
  return (
    <style>{`
      .fs-wisdom-panorama {
        position: relative;
        min-height: 360px;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid rgba(182, 139, 76, 0.34);
        box-shadow: 0 18px 48px rgba(72, 44, 18, 0.18);
        isolation: isolate;
      }

      .fs-wisdom-image-stack,
      .fs-wisdom-image-stack img,
      .fs-wisdom-panorama::before,
      .fs-wisdom-panorama::after {
        position: absolute;
        inset: 0;
      }

      .fs-wisdom-image-stack img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        filter: saturate(1.06) brightness(0.9);
      }

      .fs-wisdom-panorama::before {
        content: '';
        z-index: 1;
        background:
          linear-gradient(90deg, rgba(15, 11, 5, 0.2) 0%, rgba(42, 23, 7, 0.08) 35%, rgba(22, 14, 8, 0.54) 100%),
          radial-gradient(circle at 35% 24%, rgba(244, 199, 108, 0.25), transparent 30%);
      }

      .fs-wisdom-panorama::after {
        content: '';
        z-index: 2;
        opacity: 0.18;
        background-image:
          repeating-linear-gradient(to right, rgba(255,255,255,0.42) 0, rgba(255,255,255,0.42) 1px, transparent 1px, transparent 62px),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 36px);
        pointer-events: none;
      }

      .fs-wisdom-layout {
        position: relative;
        z-index: 3;
        min-height: 360px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px; 
      }

      .fs-wisdom-scroll {
        position: relative;
        min-height: 236px;
        padding: 35px 42px 26px 54px;
        background: 
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"),
          linear-gradient(90deg, #e2cb9f 0%, #f6e7c9 6%, #fdf8e9 12%, #fbf3dd 50%, #f6e7c9 88%, #edd8ba 94%, #dbbe97 100%);
        border: 1px solid rgba(139, 94, 30, 0.32);
        box-shadow: 
          0 12px 30px rgba(45,30,15,0.22),
          inset 0 0 35px rgba(126, 73, 21, 0.14);
        color: #573512;
      }

      .fs-wisdom-scroll::before {
        content: '';
        position: absolute;
        inset: 10px 24px;
        border: 1px solid rgba(146, 92, 34, 0.18);
        background-image: repeating-linear-gradient(0deg, rgba(108, 72, 28, 0.04), rgba(108, 72, 28, 0.04) 1px, transparent 1px, transparent 26px);
        pointer-events: none;
      }

      .fs-scroll-rod {
        position: absolute;
        top: -6px;
        bottom: -6px;
        width: 14px;
        border-radius: 999px;
        background:
          linear-gradient(90deg, rgba(42, 19, 6, 0.4), transparent 25%, rgba(255, 186, 73, 0.86) 48%, rgba(54, 24, 5, 0.7) 100%),
          #7e491e;
        box-shadow: 2px 0 10px rgba(0,0,0,0.3);
        z-index: 3;
      }

      .fs-scroll-rod::before,
      .fs-scroll-rod::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 22px;
        height: 12px;
        background: radial-gradient(circle at center, #ffe090 0%, #c9a84c 60%, #7e5a1e 100%);
        border: 1px solid rgba(126, 85, 20, 0.4);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      .fs-scroll-rod::before {
        top: -10px;
        border-radius: 6px 6px 2px 2px;
      }
      .fs-scroll-rod::after {
        bottom: -10px;
        border-radius: 2px 2px 6px 6px;
      }

      .fs-scroll-rod-left { left: 9px; }
      .fs-scroll-rod-right { right: 9px; }

      .fs-quote-refresh {
        position: absolute;
        top: 18px;
        right: 36px;
        z-index: 5;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid rgba(123, 79, 28, 0.28);
        background: rgba(255, 240, 194, 0.74);
        color: #7b5123;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .fs-quote-content {
        position: relative;
        z-index: 4;
      }

      .fs-quote-mark {
        font-family: Georgia, serif;
        font-size: 54px;
        line-height: 0.7;
        margin-bottom: 4px;
      }

      .fs-quote-content blockquote {
        margin: 0 0 18px;
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(19px, 2.35vw, 24px);
        line-height: 1.35;
        font-style: italic;
        font-weight: 500;
        color: #5a3517;
      }

      .fs-quote-author {
        font-family: 'Cinzel', serif;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #8a5a2b;
        text-transform: uppercase;
      }

      .fs-quote-source {
        margin-top: 4px;
        font-family: 'Lora', serif;
        font-size: 12px;
        color: rgba(86,55,22,0.62);
      }

      .fs-quote-category {
        display: inline-flex;
        margin-top: 14px;
        padding: 5px 12px;
        border-radius: 999px;
        border: 1px solid rgba(138, 90, 43, 0.28);
        font-family: 'Cinzel', serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #7a4e20;
        background: rgba(255, 246, 222, 0.34);
      }

      .fs-quote-loading {
        position: relative;
        z-index: 4;
        display: grid;
        gap: 12px;
        padding-top: 36px;
      }

      .fs-quote-loading span {
        height: 16px;
        border-radius: 999px;
        background: rgba(132,94,53,0.16);
        animation: pulse 1.2s ease-in-out infinite;
      }

      .fs-quote-loading span:nth-child(1) { width: 46%; }
      .fs-quote-loading span:nth-child(2) { width: 92%; }
      .fs-quote-loading span:nth-child(3) { width: 68%; }

      .fs-wisdom-glass {
        width: 100%;
        min-height: auto;
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.25);
        padding: 26px 30px;
        color: white;
        background: linear-gradient(135deg, rgba(66, 42, 19, 0.15), rgba(32, 22, 13, 0.08));
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 18px 40px rgba(22, 12, 6, 0.12);
        backdrop-filter: blur(2px);
        margin-bottom: 0;
      }

      .fs-wisdom-glass::before {
        content: '';
        position: absolute;
        inset: 0;
        opacity: 0.22;
        background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.18), rgba(255,255,255,0.18) 1px, transparent 1px, transparent 26px);
        pointer-events: none;
      }

      .fs-wisdom-om {
        position: absolute;
        top: 4px;
        right: 22px;
        font-family: Georgia, serif;
        font-size: 68px;
        line-height: 1;
        opacity: 0.14;
        pointer-events: none;
      }

      .fs-wisdom-pill {
        position: relative;
        display: inline-flex;
        padding: 5px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.5);
        background: rgba(255,255,255,0.12);
        font-family: 'Cinzel', serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        text-shadow: 0 1px 8px rgba(0,0,0,0.45);
      }

      .fs-wisdom-glass h3 {
        position: relative;
        margin: 14px 0 12px;
        white-space: pre-line;
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(27px, 3.1vw, 36px);
        line-height: 1.06;
        font-weight: 700;
        text-shadow: 0 2px 14px rgba(0,0,0,0.46);
      }

      .fs-wisdom-glass p {
        position: relative;
        margin: 0 0 20px;
        max-width: 430px;
        font-family: 'Lora', serif;
        font-size: 13px;
        line-height: 1.62;
        color: rgba(255,255,255,0.9);
        text-shadow: 0 1px 9px rgba(0,0,0,0.45);
      }

      .fs-wisdom-stat {
        position: relative;
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .fs-wisdom-stat strong {
        font-family: 'Cormorant Garamond', serif;
        font-size: 30px;
        line-height: 1;
        color: white;
      }

      .fs-wisdom-stat span {
        font-family: 'Lora', serif;
        font-size: 12px;
        font-weight: 700;
        color: rgba(255,255,255,0.8);
      }

      .fs-wisdom-controls {
        position: absolute;
        z-index: 5;
        right: 38px;
        bottom: 28px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .fs-wisdom-controls > button {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1.5px solid #dcae52;
        background: linear-gradient(135deg, #c9a84c 0%, #8b6914 100%);
        color: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .fs-wisdom-controls > button:hover {
        background: linear-gradient(135deg, #e8c97a 0%, #a27e1f 100%);
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 6px 14px rgba(201,168,76,0.35);
      }

      .fs-wisdom-dots {
        display: none;
      }

      .fs-wisdom-dots button {
        width: 6px;
        height: 6px;
        border-radius: 999px;
        border: none;
        padding: 0;
        background: rgba(255,255,255,0.48);
        transition: width 0.2s ease, background 0.2s ease;
      }

      .fs-wisdom-dots button.active {
        width: 20px;
        background: white;
      }

      @media (max-width: 930px) {
        .fs-wisdom-layout {
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 16px;
        }

        .fs-wisdom-scroll {
          min-height: 210px;
        }

        .fs-wisdom-glass {
          justify-self: stretch;
          width: 100%;
          margin-bottom: 56px;
        }

        .fs-wisdom-controls {
          left: 0;
          right: 0;
          justify-content: center;
        }

        .fs-wisdom-dots {
          display: flex;
          align-items: center;
          gap: 7px;
        }
      }

      @media (max-width: 560px) {
        .fs-wisdom-panorama {
          border-radius: 16px;
        }

        .fs-wisdom-layout {
          padding: 12px;
        }

        .fs-wisdom-scroll {
          padding: 34px 34px 24px 44px;
        }

        .fs-quote-content blockquote {
          font-size: 21px;
        }

        .fs-wisdom-glass {
          padding: 22px;
          border-radius: 20px;
        }
      }
    `}</style>
  )
}

export default function WisdomCarousel({ sankalpa }) {
  const { slide, goNext, goPrev, goTo } = useWisdomCarousel(SLIDES.length)
  const activeSlide = SLIDES[slide]

  return (
    <section style={{ marginBottom: '4rem' }}>
      <WisdomStyles />

      <motion.div
        className="fs-wisdom-panorama"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.08 }}
      >
        <div className="fs-wisdom-image-stack" aria-hidden>
          <AnimatePresence mode="sync">
            <motion.img
              key={activeSlide.image}
              src={activeSlide.image}
              alt=""
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </div>

        <div className="fs-wisdom-layout">
          <SlideCard slide={activeSlide} />
        </div>

        <CarouselControls
          total={SLIDES.length}
          current={slide}
          onPrev={goPrev}
          onNext={goNext}
          onDot={goTo}
        />
      </motion.div>
    </section>
  )
}

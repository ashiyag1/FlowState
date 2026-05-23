import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useWisdomCarousel } from '../hooks/useWisdomCarousel'
import { useSoundEffects } from '../hooks/useSoundEffects'
import SectionHeading from '../components/SectionHeading'
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
    body: '20 minutes of yoga daily lowers cortisol by 33%, rewires the brain for calm, and sharpens focus. India gave this 5,000-year gift to the world.',
    stat: '5,000',
    statLabel: 'years of Indian yoga wisdom',
    image: chaiImage,
  },
  {
    tag: 'Water & Prana',
    title: 'Water is life.\nPrana is water.',
    body: 'Charaka Samhita called water the first medicine. Your brain is 75% water - 2% dehydration visibly shrinks focus, mood, and memory.',
    stat: '75%',
    statLabel: 'of your brain is water',
    image: sitarImage,
  },
  {
    tag: 'Sleep & Ayurveda',
    title: "Sleep is\nBrahma's reset",
    body: 'Ancient Ayurveda named sleep (Nidra) as one of the three pillars of health. 7-9 hours nightly repairs DNA and extends life by measurable years.',
    stat: '3x',
    statLabel: 'more productive with quality sleep',
    image: flute,
  },
  {
    tag: 'Movement & Prana',
    title: 'Body in motion,\nsoul in flow',
    body: 'India invented Surya Namaskar - a complete mind-body workout woven into devotion. 30 minutes of daily movement cuts depression risk by 30%.',
    stat: '30 min',
    statLabel: 'changes everything',
    image: jaipurImage,
  },
  {
    tag: 'Naam Jaap',
    title: 'The vibration\nthat heals',
    body: 'Repeating a sacred name - Ram, Om, Hare Krishna - activates the vagus nerve, lowers blood pressure, and synchronises brainwaves into meditative alpha.',
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

function QuoteScroll() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const { playWisdomSound } = useSoundEffects()

  const load = async (force = false) => {
    setLoading(true)
    try {
      setQuote(await fetchAIQuote(force))
    } catch {
      setQuote(getDailyQuote())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleRefresh = async () => {
    setSpinning(true)
    Store.del('quote_' + today())
    await load(true)
    playWisdomSound()
    setSpinning(false)
  }

  const accentColor = quote ? ERA_COLORS[quote.category] || '#D4A84B' : '#D4A84B'
  const displayQuote = quote?.translation || quote?.text

  return (
    <div className="fs-wisdom-scroll">
      <span className="fs-scroll-rod fs-scroll-rod-left" aria-hidden />
      <span className="fs-scroll-rod fs-scroll-rod-right" aria-hidden />

      <button
        className="fs-quote-refresh"
        onClick={handleRefresh}
        disabled={loading || spinning}
        aria-label="Refresh quote"
        title="Get a new quote"
      >
        <RefreshCw size={13} className={spinning || loading ? 'animate-spin' : ''} />
      </button>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="fs-quote-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span />
            <span />
            <span />
          </motion.div>
        ) : quote ? (
          <motion.div
            key={displayQuote?.slice(0, 24)}
            className="fs-quote-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="fs-quote-mark" style={{ color: accentColor }}>
              "
            </div>
            <blockquote>"{displayQuote}"</blockquote>
            <div className="fs-quote-author">- {quote.author}</div>
            {quote.source && quote.source !== quote.author && (
              <div className="fs-quote-source">{quote.source}</div>
            )}
            {quote.category && (
              <div className="fs-quote-category" style={{ borderColor: `${accentColor}77` }}>
                {quote.category}
              </div>
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
        className="fs-wisdom-glass"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="fs-wisdom-om" aria-hidden>
          Om
        </span>
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

function WisdomStyles() {
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
        display: grid;
        grid-template-columns: minmax(280px, 1fr) minmax(24px, 0.08fr) minmax(360px, 1fr);
        align-items: center;
        gap: 20px;
        padding: 24px 32px 80px 18px; 
      }

      .fs-wisdom-scroll {
        position: relative;
        min-height: 236px;
        padding: 35px 42px 26px 54px;
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 235, 171, 0.46), transparent 46%),
          linear-gradient(90deg, #f6d38a 0%, #fff0c1 12%, #ffe8ae 50%, #f2c978 100%);
        border: 1px solid rgba(123, 79, 28, 0.24);
        box-shadow: inset 0 0 35px rgba(126, 73, 21, 0.17), 0 14px 32px rgba(41, 24, 7, 0.28);
        color: #573512;
      }

      .fs-wisdom-scroll::before {
        content: '';
        position: absolute;
        inset: 10px 24px;
        border: 1px solid rgba(146, 92, 34, 0.18);
        background-image: repeating-linear-gradient(0deg, rgba(108, 72, 28, 0.055), rgba(108, 72, 28, 0.055) 1px, transparent 1px, transparent 26px);
        pointer-events: none;
      }

      .fs-scroll-rod {
        position: absolute;
        top: 11px;
        bottom: 11px;
        width: 22px;
        border-radius: 999px;
        background:
          linear-gradient(90deg, rgba(42, 19, 6, 0.4), transparent 25%, rgba(255, 186, 73, 0.86) 48%, rgba(54, 24, 5, 0.7) 100%),
          #9a5517;
        box-shadow: 0 0 12px rgba(28, 12, 2, 0.5);
        z-index: 3;
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
        font-size: clamp(22px, 2.35vw, 31px);
        line-height: 1.23;
        font-style: italic;
        font-weight: 600;
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
        justify-self: end;
        width: min(100%, 440px);
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
        border: 1px solid rgba(255,255,255,0.72);
        background: rgba(255,255,255,0.13);
        color: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(2px);
        transition: background 0.2s ease, transform 0.2s ease;
      }

      .fs-wisdom-controls > button:hover {
        background: rgba(255,255,255,0.24);
        transform: translateY(-1px);
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

export default function WisdomCarousel() {
  const { slide, goNext, goPrev, goTo } = useWisdomCarousel(SLIDES.length)
  const activeSlide = SLIDES[slide]

  return (
    <section style={{ marginBottom: '4rem' }}>
      <WisdomStyles />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <SectionHeading
          eyebrow="Today's Wisdom"
          title="Ancient wisdom, modern life."
        />
      </motion.div>

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
          <QuoteScroll />
          <span aria-hidden />
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

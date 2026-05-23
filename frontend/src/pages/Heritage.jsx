import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import {
  ChevronRight, ArrowUpRight, Sparkles,
  Heart, X, BookOpen
} from 'lucide-react'
import lilavatiMs from '../assets/heritage/lilavati.jpg'
import suryaMs from '../assets/heritage/surya_siddhanta.jpg'

function ScholarImg({ src, alt, style, fallbackColor }) {
  const [errored, setErrored] = useState(false)
  if (errored || !src) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${fallbackColor || '#c9a84c'}22, ${fallbackColor || '#8b6f4c'}44)`,
        fontSize: '48px',
        fontFamily: "'Cormorant Garamond', serif",
        color: fallbackColor || '#c9a84c',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.5, fontFamily: "'Inter', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
            {alt?.[0] || '?'}
          </div>
        </div>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  )
}

const CURIOSITY_STORIES = {
  0: {
    fullTitle: "Līlāvatī wasn't just mathematics — it was a love letter to numbers.",
    paragraphs: [
      "In the 12th century, the mathematician Bhāskara II wrote a treatise that would change mathematics forever. But unlike the dry, formulaic textbooks we know today, the Līlāvatī was different. It was a conversation — a poetic dialogue between a father and his daughter.",
      "Līlāvatī, Bhāskara's daughter, was told that if she waited until a precise astrological moment to get married, her life would be blessed. But the moment passed — a pearl dropped into a cup went unnoticed. In consolation, Bhāskara named his greatest work after her, writing mathematical problems as stories for her to solve.",
      "\"Beautiful Līlāvatī, tell me, how many combinations of flavors can you make with six different tastes?\" — the problems were posed as riddles, as poems, as stories. The Līlāvatī covered arithmetic, geometry, algebra, and even early calculus concepts — all wrapped in the warmth of a father teaching his daughter.",
      "The manuscript opens with a benediction to the gods but reads like a lullaby of logic. It's why the Līlāvatī remains one of the most beloved mathematical texts in history — not because it was the most advanced, but because it was the most human."
    ],
    source: "Līlāvatī of Bhāskara II, 12th Century CE"
  },
  1: {
    fullTitle: "Before Newton, there was Bhāskarācārya — and he understood gravity.",
    paragraphs: [
      "When we think of gravity, we think of Newton and his apple. But five centuries before the apple supposedly fell, an Indian astronomer had already described the fundamental force that holds the universe together.",
      "In his magnum opus, the Siddhānta Śiromaṇi (1150 CE), Bhāskarācārya wrote: \"Objects fall toward the earth because of a force of attraction. The earth itself has this attractive force, just as a magnet attracts iron.\"",
      "This wasn't a casual observation. Bhāskarācārya calculated the time taken for objects to fall, described planetary motion with astonishing accuracy, and even conceived of concepts that would later become integral to calculus — derivatives, differential equations, and the idea of instantaneous velocity.",
      "His work on the motion of planets used a form of differential calculus 500 years before Newton and Leibniz. The Yukti-bhāṣā, based on his school's work, explicitly described the concept of infinitesimals and integration.",
      "When you look at the stars tonight, remember: someone was already doing the math, a thousand years ago, from a quiet observatory in what is now Karnataka."
    ],
    source: "Siddhānta Śiromaṇi, Bhāskarācārya, 1150 CE"
  },
  2: {
    fullTitle: "How ancient India mapped the stars without telescopes.",
    paragraphs: [
      "Long before Galileo pointed a telescope at the sky, Indian astronomers had mapped the cosmos with astonishing precision using nothing but mathematics, geometry, and generations of naked-eye observations.",
      "The Sūrya Siddhānta — a 4th century CE astronomical text — calculated the Earth's diameter to be 8,000 miles. The actual value is 7,918 miles. They were off by less than 1%. They calculated the length of the solar year as 365.258756 days — the modern value is 365.2425 days.",
      "But that's just the beginning. Āryabhaṭa (476 CE) proposed that the Earth rotates on its axis, causing the apparent motion of the stars — a full 1,000 years before Galileo was persecuted for the same idea. He also explained that the moon shines by reflecting sunlight, and correctly explained the causes of solar and lunar eclipses.",
      "The ancient texts described nine planets (including the Sun and Moon as 'planets' in the astronomical sense), calculated their orbital periods, and even predicted their positions centuries in advance. The Kerala school of astronomy, led by Mādhava and later Nīlakaṇṭha, developed a model of the solar system that placed Mercury, Venus, Mars, Jupiter, and Saturn in elliptical orbits around the Sun.",
      "Before telescopes, before modern observatories, they simply looked up, asked questions, and did the math. And they got it remarkably right."
    ],
    source: "Sūrya Siddhānta & Āryabhaṭīya, 4th–6th Century CE"
  },
  3: {
    fullTitle: "Why Pāṇini still influences modern linguistics — and AI.",
    paragraphs: [
      "In the 4th century BCE — roughly the same time Aristotle was writing about logic in Greece — a Sanskrit scholar in what is now Pakistan was creating a system so precise, so algorithmic, that it would influence everything from structural linguistics to modern artificial intelligence.",
      "Pāṇini's Aṣṭādhyāyī (\"Eight Chapters\") is a grammar of Sanskrit consisting of 3,996 rules, organized with such mathematical rigor that it resembles modern programming language syntax. It uses a system of meta-rules, context-sensitive transformations, and a formal notation system that linguists still study today.",
      "The Aṣṭādhyāyī works like a program: you start with a set of lexical roots (the 'database'), apply a series of ordered rules (the 'code'), and the correct grammatical forms emerge as output. It has an algorithm. It has conditionals. It has loops (through recursive rule application). Sound familiar?",
      "Modern linguists — including Noam Chomsky — built their theories on foundations that Pāṇini laid 2,400 years ago. The concept of 'generative grammar' was anticipated by Pāṇini's rule-based system. Computer scientists have studied the Aṣṭādhyāyī for its efficient information encoding and formal rule systems.",
      "Every time you use a grammar checker, a search algorithm, or a voice assistant that understands language, you're standing on the shoulders of a man who figured out how language works, 24 centuries ago, with nothing but a mind and a mission."
    ],
    source: "Aṣṭādhyāyī, Pāṇini, ~400 BCE"
  },
  4: {
    fullTitle: "The golden age of Nalanda — the world's first great university.",
    paragraphs: [
      "Long before Oxford or Cambridge, before Bologna or Al-Azhar, there was Nalanda. Established in the 5th century CE in what is now Bihar, Nalanda was the world's first residential university — and perhaps the greatest center of learning the ancient world ever saw.",
      "At its peak, Nalanda housed 10,000 students and 2,000 teachers from across Asia — from China, Korea, Japan, Tibet, Mongolia, Persia, and beyond. The curriculum covered everything: Buddhist philosophy, logic, grammar, medicine, astronomy, mathematics, metallurgy, and the arts.",
      "The library — called Dharmagañja (\"Treasury of Truth\") — was so vast that it had three massive buildings: Ratnasāgara (Sea of Jewels), Ratnadadhi (Ocean of Jewels), and Ratnarañjaka (Jewel-adorned). It is said that the library was so extensive that when invaders sacked the university in 1193 CE, the library continued to burn for three months.",
      "Xuanzang, the Chinese Buddhist monk who studied at Nalanda in the 7th century, wrote vivid descriptions of the university: towering monasteries, nine-story buildings, ornate temples, and a community of scholars engaged in rigorous daily debates. \"The priests are men of the highest ability and learning,\" he wrote. \"There is no subject they do not study.\"",
      "The destruction of Nalanda wasn't just the loss of a building — it was the loss of centuries of accumulated knowledge, manuscripts that had no copies elsewhere, and a tradition of open inquiry that the world wouldn't see again for centuries."
    ],
    source: "Travels of Xuanzang, 7th Century CE; Archaeological Survey of India"
  },
  5: {
    fullTitle: "Suśruta's surgical genius — ancient hands with modern skill.",
    paragraphs: [
      "Imagine undergoing rhinoplasty — a nose job — in 600 BCE. No anesthesia. No sterile operating theater. No scalpels as we know them. And yet, the ancient Indian surgeon Suśruta was performing this and many other complex surgeries with remarkable success.",
      "The Suśruta Saṃhitā, written around 600 BCE, is the world's oldest surgical text. It describes over 300 surgical procedures, 120 surgical instruments, and 8 types of surgery ranging from excision to suturing. Suśruta detailed how to perform cataract removal (couching), caesarean sections, and reconstructive surgery of the nose and ears.",
      "The 'Indian rhinoplasty' technique — using a flap of skin from the cheek to reconstruct the nose — was so advanced that British surgeons in the 18th century learned it from Indian practitioners and brought it back to Europe. Modern plastic surgery traces its roots directly to Suśruta's methods.",
      "Suśruta's surgical instruments included tweezers, scalpels, forceps, speculums, and even catheters — many of them remarkably similar to modern versions. He emphasized the importance of cleanliness, using sterilized instruments, and even described different types of sutures (using materials like cotton, hemp, and animal sinew).",
      "The Suśruta Saṃhitā also detailed the study of anatomy through dissection, described 1,120 diseases, and listed over 700 medicinal plants. Long before Lister and Pasteur, Suśruta knew that cleanliness saved lives. Long before modern surgeons, he was reshaping faces, removing cataracts, and bringing sight back to the blind."
    ],
    source: "Suśruta Saṃhitā, ~600 BCE"
  }
}

const SCHOLARS = [
  {
    id: 1, name: 'Āryabhaṭa', period: '476–550 CE',
    title: 'Father of Indian Mathematics',
    desc: 'Pioneer who calculated π to four decimal places, explained eclipses, and proposed heliocentric motion 1000 years before Copernicus.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Aryabhatta_1.jpg',
    field: 'mathematics', color: '#c9a84c'
  },
  {
    id: 2, name: 'Bhāskarācārya', period: '1114–1185 CE',
    title: 'Master of the Cosmos',
    desc: 'Wrote Siddhānta Śiromaṇi, first to describe gravity before Newton, conceived of calculus 500 years before Europe.',
    img: suryaMs,
    field: 'astronomy', color: '#8b6f4c'
  },
  {
    id: 3, name: 'Līlāvatī', period: '12th Century',
    title: 'The Mathematical Muse',
    desc: 'Bhāskara\'s seminal treatise on arithmetic, algebra, and geometry — a poetic dialogue that made mathematics feel like art.',
    img: lilavatiMs,
    field: 'mathematics', color: '#d4a82a'
  },
  {
    id: 4, name: 'Caraka', period: '~300 BCE',
    title: 'Father of Āyurveda',
    desc: 'Caraka Saṃhitā — the foundational text of Indian medicine describing diagnosis, treatment, and holistic wellness millennia ago.',
    img: lilavatiMs,
    field: 'medicine', color: '#4a7c59'
  },
  {
    id: 5, name: 'Pāṇini', period: '~400 BCE',
    title: 'The Grammar Genius',
    desc: 'Aṣṭādhyāyī — the world\'s first formal grammar system, whose rules still influence modern linguistics and computer science.',
    img: suryaMs,
    field: 'linguistics', color: '#7c6b4a'
  },
  {
    id: 6, name: 'Suśruta', period: '~600 BCE',
    title: 'Pioneer of Surgery',
    desc: 'Suśruta Saṃhitā — detailed rhinoplasty, cataract surgery, and 300+ surgical procedures long before modern medicine.',
    img: lilavatiMs,
    field: 'medicine', color: '#5a8a6a'
  },
  {
    id: 7, name: 'Nāgārjuna', period: '~150 CE',
    title: 'Alchemist & Philosopher',
    desc: 'Master of metallurgy and chemistry, whose alchemical texts described mineral compounds and philosophical materialism.',
    img: suryaMs,
    field: 'science', color: '#6a5a4a'
  }
]

const CATEGORIES = [
  { id: 'mathematics', label: 'Mathematics', icon: '∑' },
  { id: 'astronomy', label: 'Astronomy', icon: '☉' },
  { id: 'philosophy', label: 'Philosophy', icon: '◈' },
  { id: 'medicine', label: 'Medicine', icon: '⚕' },
  { id: 'literature', label: 'Literature', icon: '✍' },
  { id: 'architecture', label: 'Architecture', icon: '△' },
  { id: 'science', label: 'Science', icon: '⚛' },
  { id: 'linguistics', label: 'Linguistics', icon: 'अ' },
  { id: 'arts', label: 'Arts', icon: '◉' }
]

const IDEAS = [
  {
    title: 'Śūnya', subtitle: 'The Zero', sanskrit: 'शून्य',
    desc: 'The concept of nothingness that changed everything. From placeholder to infinity — India gave mathematics its soul.',
    color: '#c9a84c'
  },
  {
    title: 'Gaṇita', subtitle: 'Sacred Calculation', sanskrit: 'गणित',
    desc: 'Mathematics as cosmic language. The Vedas encoded astronomical cycles, geometric altars, and the rhythm of existence.',
    color: '#8b6f4c'
  },
  {
    title: 'Āyurveda', subtitle: 'Science of Life', sanskrit: 'आयुर्वेद',
    desc: 'Holistic healing 5000 years before "wellness" was a trend. Mind, body, nature — one system, one science.',
    color: '#4a7c59'
  },
  {
    title: 'Graha Gati', subtitle: 'Planetary Motion', sanskrit: 'ग्रह गति',
    desc: 'Mapping the cosmos without telescopes. Ancient Indian astronomers calculated planetary orbits with astonishing precision.',
    color: '#5a6a8a'
  },
  {
    title: 'Yoga', subtitle: 'Union of Being', sanskrit: 'योग',
    desc: 'The original mind-body technology. Not just asanas — a complete science of consciousness and inner engineering.',
    color: '#7a5a4a'
  },
  {
    title: 'Nakṣatra', subtitle: 'Celestial Mansions', sanskrit: 'नक्षत्र',
    desc: '27 lunar houses mapping the sky. Ancient India\'s gift to astrology, timekeeping, and our relationship with the stars.',
    color: '#4a5a7a'
  }
]

const CURIOSITIES = [
  {
    title: 'Līlāvatī wasn\'t just mathematics.',
    desc: 'It was a conversation. Bhāskara II wrote his masterpiece as a dialogue with his daughter — turning equations into poetry, problems into stories.',
    tag: 'poetry of numbers', color: '#c9a84c'
  },
  {
    title: 'Before Newton, there was Bhāskarācārya.',
    desc: 'In the 12th century, he described a version of gravity — "objects fall towards the earth by a force of attraction." 500 years early.',
    tag: 'gravity before gravity', color: '#7c6b4a'
  },
  {
    title: 'How ancient India mapped the stars.',
    desc: 'The Sūrya Siddhānta calculated the Earth\'s diameter to be 8,000 miles — remarkably close to the true 7,918 miles. Without telescopes.',
    tag: 'cosmic precision', color: '#4a6a8a'
  },
  {
    title: 'Why Pāṇini still influences modern AI.',
    desc: 'His Aṣṭādhyāyī (~400 BCE) uses a formal grammar system so precise it resembles modern programming language syntax. Chomsky owes him.',
    tag: 'grammar of the future', color: '#6a5a4a'
  },
  {
    title: 'The golden age of Nalanda.',
    desc: 'The world\'s first residential university (5th century CE). 10,000 students, 2,000 teachers, a library so vast it took months to burn.',
    tag: 'the original campus', color: '#5a7a6a'
  },
  {
    title: 'Suśruta\'s surgical genius.',
    desc: 'He described rhinoplasty, cataract removal, and caesarean sections — all in 600 BCE. His techniques are eerily similar to modern surgery.',
    tag: 'ancient hands, modern skill', color: '#4a7a5a'
  }
]

function Heritage() {
  const { dark } = useTheme()
  const [activeCategory, setActiveCategory] = useState('all')
  const [savedScholars, setSavedScholars] = useState([])
  const [hoveredScholar, setHoveredScholar] = useState(null)
  const [selectedStory, setSelectedStory] = useState(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const toggleSave = (id) => {
    setSavedScholars(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const filteredScholars = activeCategory === 'all'
    ? SCHOLARS
    : SCHOLARS.filter(s => s.field === activeCategory)

  return (
    <div style={styles.page(dark)}>
      <div style={styles.ambientGrid(dark)} />
      <div style={styles.ambientGlow(dark)} />

      {/* ─── HERO (static — no animations causing drift) ─── */}
      <section style={styles.hero(dark)}>
        <div style={styles.heroInner}>
          <div style={styles.heroLeft}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={styles.heroEyebrow(dark)}>
                <span style={styles.heroEyebrowDot} /> our heritage
              </span>
              <h1 style={styles.heroTitle(dark)}>
                brilliance<br />
                <span style={styles.goldText}>from this land.</span>
              </h1>
              <p style={styles.heroSub(dark)}>
                the ideas. the minds.<br />
                the legacy that still shapes the future.
              </p>
              <p style={styles.sanskritLine(dark)}>
                जिज्ञासा ही ज्ञान का पहला द्वार है।
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.cta(dark)}
                onClick={() => document.getElementById('scholars')?.scrollIntoView({ behavior: 'smooth' })}
              >
                explore our heritage <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.heroCollage}>
              <div style={styles.collageItem(1)}>
                <div style={styles.collageFrame(dark)}>
                  <img src={lilavatiMs} alt="Lilavati manuscript" style={styles.collageImg} />
                </div>
              </div>
              <div style={styles.collageItem(2)}>
                <div style={styles.collageFrame(dark)}>
                  <img src={suryaMs} alt="Surya Siddhanta" style={styles.collageImg} />
                </div>
              </div>
              <div style={styles.collageItem(3)}>
                <div style={{ ...styles.collageFrame(dark), ...styles.collagePortrait(dark) }}>
                  <span style={styles.collagePortraitText}>अ</span>
                  <span style={styles.collagePortraitSub}>Āryabhaṭa</span>
                </div>
              </div>
              <div style={styles.collageItem(4)}>
                <div style={styles.geometryBadge(dark)}>
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="none" stroke={dark ? '#c9a84c' : '#8b6f4c'} strokeWidth="1" opacity="0.6" />
                    <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke={dark ? '#c9a84c' : '#8b6f4c'} strokeWidth="0.8" opacity="0.4" />
                    <circle cx="20" cy="20" r="3" fill={dark ? '#c9a84c' : '#8b6f4c'} opacity="0.5" />
                  </svg>
                </div>
              </div>
              <div style={styles.heritageWatermark(dark)}>॥ ज्ञानम् ॥</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY PILLS ─── */}
      <section style={styles.categorySection}>
        <div style={styles.categoryScroll}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={activeCategory === 'all' ? styles.categoryPillActive(dark) : styles.categoryPill(dark)}
            onClick={() => setActiveCategory('all')}
          >
            <Sparkles size={14} /> all
          </motion.button>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={activeCategory === cat.id ? styles.categoryPillActive(dark) : styles.categoryPill(dark)}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span style={{ fontSize: '14px' }}>{cat.icon}</span> {cat.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* ─── MINDS THAT SHAPED TIME ─── */}
      <section id="scholars" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionEyebrow(dark)}>minds that shaped time</span>
            <h2 style={styles.sectionTitle(dark)}>
              The Great Minds
              <span style={styles.sectionBadge}>✦</span>
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            style={styles.viewAll(dark)}
            onClick={() => setActiveCategory('all')}
          >
            view all <ArrowUpRight size={14} />
          </motion.button>
        </div>

        <div style={styles.scholarsScroll}>
          <motion.div style={styles.scholarsTrack} layout>
            <AnimatePresence mode="popLayout">
              {filteredScholars.map((scholar) => (
                <motion.div
                  key={scholar.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={styles.scholarCard(dark)}
                  onMouseEnter={() => !isTouchDevice && setHoveredScholar(scholar.id)}
                  onMouseLeave={() => !isTouchDevice && setHoveredScholar(null)}
                  whileHover={isTouchDevice ? {} : { y: -8, transition: { duration: 0.3 } }}
                >
                  <div style={styles.scholarImageWrap}>
                    <ScholarImg
                      src={scholar.img}
                      alt={scholar.name}
                      style={styles.scholarImg}
                      fallbackColor={scholar.color}
                    />
                    <div style={styles.scholarImgOverlay(dark)} />
                    <div style={styles.scholarField(dark)}>
                      <span style={{ fontSize: '10px' }}>{CATEGORIES.find(c => c.id === scholar.field)?.icon}</span>
                    </div>
                  </div>
                  <div style={styles.scholarContent}>
                    <div style={styles.scholarHeader}>
                      <h3 style={styles.scholarName(dark)}>{scholar.name}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={styles.saveBtn(savedScholars.includes(scholar.id), dark)}
                        onClick={(e) => { e.stopPropagation(); toggleSave(scholar.id) }}
                      >
                        <Heart size={14} fill={savedScholars.includes(scholar.id) ? '#d4607a' : 'none'} />
                      </motion.button>
                    </div>
                    <span style={styles.scholarPeriod(dark)}>{scholar.period}</span>
                    <p style={styles.scholarTitle(dark)}>{scholar.title}</p>
                    {(hoveredScholar === scholar.id || isTouchDevice) && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={styles.scholarDesc(dark)}
                      >
                        {scholar.desc}
                      </motion.p>
                    )}
                    <motion.span
                      style={styles.exploreLink(dark)}
                      animate={{ x: hoveredScholar === scholar.id ? 3 : 0 }}
                    >
                      explore <ChevronRight size={12} />
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ─── IDEAS THAT CHANGED EVERYTHING ─── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionEyebrow(dark)}>ideas that changed everything</span>
            <h2 style={styles.sectionTitle(dark)}>
              Concepts That Shifted Civilization
              <span style={styles.sectionBadge}>∞</span>
            </h2>
          </div>
        </div>

        <div style={styles.ideasGrid}>
          {IDEAS.map((idea, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={styles.ideaCard(dark, idea.color)}
            >
              <div style={styles.ideaSanskrit(dark)}>{idea.sanskrit}</div>
              <h3 style={styles.ideaTitle(dark)}>{idea.title}</h3>
              <span style={styles.ideaSub(dark)}>{idea.subtitle}</span>
              <p style={styles.ideaDesc(dark)}>{idea.desc}</p>
              <div style={styles.ideaGlow(dark, idea.color)} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── LATE NIGHT CURIOSITY ─── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionEyebrow(dark)}>late night curiosity</span>
            <h2 style={styles.sectionTitle(dark)}>
              Things You Didn't Know
              <span style={styles.sectionBadge}>🌙</span>
            </h2>
          </div>
        </div>

        <div style={styles.curiosityGrid}>
          {CURIOSITIES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={isTouchDevice ? {} : { y: -6, transition: { duration: 0.3 } }}
              style={styles.curiosityCard(dark, item.color)}
              onClick={() => setSelectedStory(idx)}
            >
              <div style={styles.curiosityTag(dark, item.color)}>{item.tag}</div>
              <h3 style={styles.curiosityTitle(dark)}>{item.title}</h3>
              <p style={styles.curiosityDesc(dark)}>{item.desc}</p>
              <div style={styles.curiosityFooter}>
                <span style={styles.curiosityReadMore(dark)}>
                  read story <ChevronRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STORY MODAL ─── */}
      <AnimatePresence>
        {selectedStory !== null && CURIOSITY_STORIES[selectedStory] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.overlay(dark)}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={styles.storyModal(dark)}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.storyHeader}>
                <div style={styles.storyBadge(dark)}>
                  <BookOpen size={14} />
                  <span style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    {CURIOSITIES[selectedStory]?.tag}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={styles.storyClose(dark)}
                  onClick={() => setSelectedStory(null)}
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div style={styles.storyContent}>
                <h2 style={styles.storyTitle(dark)}>
                  {CURIOSITY_STORIES[selectedStory].fullTitle}
                </h2>
                <div style={styles.storyDivider(dark)} />
                {CURIOSITY_STORIES[selectedStory].paragraphs.map((p, i) => (
                  <p key={i} style={styles.storyParagraph(dark)}>{p}</p>
                ))}
              </div>

              <div style={styles.storyFooter(dark)}>
                <span style={{ fontSize: '11px', opacity: 0.6 }}>
                  Source: {CURIOSITY_STORIES[selectedStory].source}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FOOTER ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={styles.footer(dark)}
      >
        <div style={styles.footerContent}>
          <div style={styles.footerDivider(dark)} />
          <p style={styles.footerQuote(dark)}>
            "विद्या विनोदि करेत्‌"
          </p>
          <p style={styles.footerSub(dark)}>
            Knowledge is beautiful when it brings humility.
          </p>
          <p style={styles.footerTagline(dark)}>
            FlowState — rooted in brilliance.
          </p>
        </div>
      </motion.section>
    </div>
  )
}

const styles = {
  page: (dark) => ({
    minHeight: '100vh',
    background: dark ? '#0a0d14' : '#f6f1e7',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
  }),

  ambientGrid: (dark) => ({
    position: 'fixed', inset: 0,
    backgroundImage: dark
      ? 'radial-gradient(rgba(201, 168, 76, 0.03) 1px, transparent 1px)'
      : 'radial-gradient(rgba(139, 111, 76, 0.04) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none', zIndex: 0,
  }),

  ambientGlow: (dark) => ({
    position: 'fixed', top: '-20%', left: '-10%',
    width: '60%', height: '60%',
    background: dark
      ? 'radial-gradient(circle, rgba(201, 168, 76, 0.04) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(201, 168, 76, 0.05) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  }),

  hero: (dark) => ({
    position: 'relative', zIndex: 1,
    padding: '140px 48px 60px',
    maxWidth: '1360px', margin: '0 auto',
  }),

  heroInner: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },

  heroLeft: {},

  heroEyebrow: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontSize: '11px', fontWeight: 600, letterSpacing: '2px',
    textTransform: 'uppercase',
    color: dark ? '#c9a84c' : '#8b6f4c',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '24px',
  }),

  heroEyebrowDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    backgroundColor: '#c9a84c', display: 'inline-block',
  },

  heroTitle: (dark) => ({
    fontSize: 'clamp(48px, 6vw, 80px)',
    fontWeight: 400, lineHeight: '1.1',
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    color: dark ? '#e8d9b5' : '#3d2208',
    margin: '0 0 20px', letterSpacing: '-0.02em',
  }),

  goldText: { color: '#c9a84c', fontStyle: 'italic', fontWeight: 300 },

  heroSub: (dark) => ({
    fontSize: '16px', lineHeight: '1.7',
    color: dark ? '#a89873' : '#6c5a3a',
    fontFamily: "'Inter', sans-serif", fontWeight: 300,
    margin: '0 0 16px', maxWidth: '380px',
  }),

  sanskritLine: (dark) => ({
    fontSize: '14px', fontStyle: 'italic',
    color: dark ? '#c9a84c' : '#8b6f4c',
    opacity: 0.7, marginBottom: '32px',
    fontFamily: "'Cormorant Garamond', serif",
  }),

  cta: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    padding: '14px 28px',
    backgroundColor: dark ? 'rgba(201, 168, 76, 0.1)' : 'rgba(201, 168, 76, 0.15)',
    color: dark ? '#c9a84c' : '#3d2208',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.3)' : 'rgba(139, 111, 76, 0.3)'}`,
    borderRadius: '2px', fontSize: '13px',
    fontFamily: "'Inter', sans-serif", fontWeight: 500,
    letterSpacing: '0.5px', cursor: 'pointer',
    transition: 'all 0.3s ease', textTransform: 'uppercase',
  }),

  heroRight: { position: 'relative' },

  heroCollage: {
    position: 'relative', width: '100%', height: '500px',
    willChange: 'transform',
  },

  collageItem: (index) => ({
    position: 'absolute',
    ...({
      1: { top: '5%', left: '5%', width: '55%', zIndex: 2 },
      2: { top: '30%', right: '5%', width: '50%', zIndex: 1 },
      3: { top: '55%', left: '15%', width: '35%', zIndex: 3 },
      4: { bottom: '10%', right: '15%', zIndex: 4 },
    })[index],
  }),

  collageFrame: (dark) => ({
    borderRadius: '2px', overflow: 'hidden',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(139, 111, 76, 0.15)'}`,
    boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(139, 111, 76, 0.1)',
    background: dark ? '#0a0d14' : '#f6f1e7',
  }),

  collageImg: {
    width: '100%', height: 'auto', display: 'block', objectFit: 'cover',
  },

  collagePortrait: (dark) => ({
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '20px 16px', minHeight: '120px',
    background: dark
      ? 'linear-gradient(135deg, rgba(10,13,20,0.95), rgba(20,16,8,0.95))'
      : 'linear-gradient(135deg, rgba(246,241,231,0.95), rgba(240,232,215,0.95))',
  }),

  collagePortraitText: {
    fontSize: '32px', fontFamily: "'Cormorant Garamond', serif",
    color: '#c9a84c', lineHeight: 1, marginBottom: '4px',
  },

  collagePortraitSub: {
    fontSize: '11px', fontFamily: "'Inter', sans-serif",
    color: '#c9a84c', opacity: 0.7,
    letterSpacing: '1px', textTransform: 'uppercase',
  },

  geometryBadge: (dark) => ({
    width: '60px', height: '60px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: dark ? 'rgba(10, 13, 20, 0.8)' : 'rgba(246, 241, 231, 0.8)',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(139, 111, 76, 0.2)'}`,
    backdropFilter: 'blur(12px)',
  }),

  heritageWatermark: (dark) => ({
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(60px, 10vw, 120px)',
    fontFamily: "'Cormorant Garamond', serif",
    color: dark ? 'rgba(201, 168, 76, 0.04)' : 'rgba(139, 111, 76, 0.04)',
    pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 0,
  }),

  categorySection: {
    position: 'relative', zIndex: 2,
    padding: '0 48px', maxWidth: '1360px', margin: '0 auto 60px',
  },

  categoryScroll: {
    display: 'flex', gap: '10px', overflowX: 'auto',
    paddingBottom: '12px', scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  },

  categoryPill: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '10px 20px', borderRadius: '100px',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(139, 111, 76, 0.15)'}`,
    background: 'transparent',
    color: dark ? '#a89873' : '#6c5a3a',
    fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 500,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
  }),

  categoryPillActive: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '10px 20px', borderRadius: '100px',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.4)' : 'rgba(139, 111, 76, 0.4)'}`,
    background: dark ? 'rgba(201, 168, 76, 0.12)' : 'rgba(201, 168, 76, 0.15)',
    color: dark ? '#c9a84c' : '#3d2208',
    fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
    boxShadow: `0 0 20px ${dark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(201, 168, 76, 0.1)'}`,
  }),

  section: {
    position: 'relative', zIndex: 1,
    padding: '80px 48px', maxWidth: '1360px', margin: '0 auto',
  },

  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: '48px',
  },

  sectionEyebrow: (dark) => ({
    fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 600,
    letterSpacing: '2px', textTransform: 'uppercase',
    color: dark ? '#a89873' : '#8b6f4c',
    display: 'block', marginBottom: '8px',
  }),

  sectionTitle: (dark) => ({
    fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400,
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    color: dark ? '#e8d9b5' : '#3d2208', margin: 0,
    display: 'flex', alignItems: 'center', gap: '12px',
  }),

  sectionBadge: { fontSize: '24px', opacity: 0.5, fontWeight: 300 },

  viewAll: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none',
    color: dark ? '#c9a84c' : '#8b6f4c',
    fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 500,
    cursor: 'pointer', padding: '8px 0',
    borderBottom: `1px solid ${dark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(139, 111, 76, 0.2)'}`,
    transition: 'all 0.3s ease',
  }),

  scholarsScroll: {
    overflowX: 'auto', paddingBottom: '20px',
    scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch',
  },

  scholarsTrack: {
    display: 'flex', gap: '24px', minWidth: 'min-content',
  },

  scholarCard: (dark) => ({
    minWidth: '300px', maxWidth: '340px', borderRadius: '4px',
    overflow: 'hidden', flexShrink: 0,
    background: dark
      ? 'linear-gradient(180deg, rgba(20,24,32,0.9), rgba(16,18,24,0.95))'
      : 'linear-gradient(180deg, rgba(255,252,245,0.9), rgba(246,241,231,0.95))',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(139, 111, 76, 0.1)'}`,
    cursor: 'pointer',
    boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(139, 111, 76, 0.06)',
    willChange: 'transform',
  }),

  scholarImageWrap: {
    position: 'relative', width: '100%', height: '220px', overflow: 'hidden',
  },

  scholarImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },

  scholarImgOverlay: (dark) => ({
    position: 'absolute', inset: 0,
    background: dark
      ? 'linear-gradient(180deg, transparent 40%, rgba(10,13,20,0.8) 100%)'
      : 'linear-gradient(180deg, transparent 40%, rgba(246,241,231,0.8) 100%)',
  }),

  scholarField: (dark) => ({
    position: 'absolute', top: '12px', left: '12px',
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: dark ? 'rgba(10,13,20,0.7)' : 'rgba(246,241,231,0.8)',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(139, 111, 76, 0.15)'}`,
  }),

  scholarContent: { padding: '20px' },

  scholarHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },

  scholarName: (dark) => ({
    fontSize: '20px', fontWeight: 500,
    fontFamily: "'Cormorant Garamond', serif",
    color: dark ? '#e8d9b5' : '#3d2208', margin: '0 0 4px',
  }),

  saveBtn: (saved, dark) => ({
    background: 'none', border: 'none', cursor: 'pointer',
    color: saved ? '#d4607a' : (dark ? '#a89873' : '#8b6f4c'),
    padding: '4px', transition: 'all 0.3s ease',
  }),

  scholarPeriod: (dark) => ({
    fontSize: '11px', fontFamily: "'Inter', sans-serif",
    color: dark ? '#8a7a5a' : '#8b6f4c', letterSpacing: '0.5px',
  }),

  scholarTitle: (dark) => ({
    fontSize: '13px', color: dark ? '#c9a84c' : '#6c5a3a',
    fontWeight: 500, margin: '8px 0', fontFamily: "'Inter', sans-serif",
  }),

  scholarDesc: (dark) => ({
    fontSize: '12px', lineHeight: '1.6',
    color: dark ? '#8a7a5a' : '#8b6f4c',
    fontFamily: "'Inter', sans-serif", fontWeight: 300,
    margin: '0 0 12px',
  }),

  exploreLink: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 500,
    color: dark ? '#c9a84c' : '#8b6f4c',
    textTransform: 'uppercase', letterSpacing: '1px',
    borderBottom: `1px solid ${dark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(139, 111, 76, 0.2)'}`,
    paddingBottom: '2px',
  }),

  ideasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },

  ideaCard: (dark, color) => ({
    padding: '32px 28px', borderRadius: '4px',
    position: 'relative', overflow: 'hidden',
    background: dark
      ? 'linear-gradient(135deg, rgba(20,24,32,0.8), rgba(16,18,24,0.9))'
      : 'linear-gradient(135deg, rgba(255,252,245,0.8), rgba(246,241,231,0.9))',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.06)' : 'rgba(139, 111, 76, 0.08)'}`,
    cursor: 'default', transition: 'all 0.4s ease',
  }),

  ideaSanskrit: (dark) => ({
    fontSize: '28px', fontFamily: "'Cormorant Garamond', serif",
    color: dark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(139, 111, 76, 0.12)',
    marginBottom: '16px', lineHeight: 1,
  }),

  ideaTitle: (dark) => ({
    fontSize: '22px', fontWeight: 500,
    fontFamily: "'Cormorant Garamond', serif",
    color: dark ? '#e8d9b5' : '#3d2208', margin: '0 0 4px',
  }),

  ideaSub: (dark) => ({
    fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 500,
    color: dark ? '#c9a84c' : '#8b6f4c',
    letterSpacing: '1.5px', textTransform: 'uppercase',
    display: 'block', marginBottom: '12px',
  }),

  ideaDesc: (dark) => ({
    fontSize: '13px', lineHeight: '1.7',
    color: dark ? '#8a7a5a' : '#6c5a3a',
    fontFamily: "'Inter', sans-serif", fontWeight: 300,
    margin: 0,
  }),

  ideaGlow: (dark, color) => ({
    position: 'absolute', top: '-50%', right: '-30%',
    width: '120px', height: '120px', borderRadius: '50%',
    background: dark
      ? `radial-gradient(circle, ${color}15 0%, transparent 70%)`
      : `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
    pointerEvents: 'none',
  }),

  curiosityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },

  curiosityCard: (dark, color) => ({
    padding: '36px 32px', borderRadius: '4px',
    position: 'relative', overflow: 'hidden', cursor: 'pointer',
    background: dark
      ? 'linear-gradient(135deg, rgba(20,24,32,0.85), rgba(16,18,24,0.95))'
      : 'linear-gradient(135deg, rgba(255,252,245,0.85), rgba(246,241,231,0.95))',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.06)' : 'rgba(139, 111, 76, 0.08)'}`,
    transition: 'all 0.4s ease',
    willChange: 'transform',
  }),

  curiosityTag: (dark, color) => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: '2px',
    fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 500,
    letterSpacing: '0.5px', textTransform: 'uppercase',
    color: dark ? '#c9a84c' : '#8b6f4c',
    background: dark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(201, 168, 76, 0.1)',
    marginBottom: '16px',
  }),

  curiosityTitle: (dark) => ({
    fontSize: '18px', fontWeight: 500,
    fontFamily: "'Cormorant Garamond', serif",
    color: dark ? '#e8d9b5' : '#3d2208', margin: '0 0 12px', lineHeight: '1.3',
  }),

  curiosityDesc: (dark) => ({
    fontSize: '13px', lineHeight: '1.7',
    color: dark ? '#8a7a5a' : '#6c5a3a',
    fontFamily: "'Inter', sans-serif", fontWeight: 300,
    margin: '0 0 20px',
  }),

  curiosityFooter: { display: 'flex', justifyContent: 'flex-end' },

  curiosityReadMore: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontSize: '11px', fontFamily: "'Inter', sans-serif",
    color: dark ? '#c9a84c' : '#8b6f4c',
    borderBottom: `1px solid ${dark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(139, 111, 76, 0.2)'}`,
    paddingBottom: '2px', cursor: 'pointer', transition: 'all 0.3s ease',
  }),

  // ── OVERLAY & STORY MODAL ──
  overlay: (dark) => ({
    position: 'fixed', inset: 0, zIndex: 9999,
    background: dark ? 'rgba(0,0,0,0.75)' : 'rgba(30,20,8,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  }),

  storyModal: (dark) => ({
    maxWidth: '720px', width: '100%',
    maxHeight: '85vh', overflowY: 'auto',
    borderRadius: '4px',
    background: dark ? '#12161e' : '#faf6ee',
    border: `1px solid ${dark ? 'rgba(201, 168, 76, 0.12)' : 'rgba(139, 111, 76, 0.12)'}`,
    boxShadow: dark
      ? '0 32px 80px rgba(0,0,0,0.6)'
      : '0 32px 80px rgba(30,20,8,0.2)',
    scrollbarWidth: 'thin',
  }),

  storyHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px 0',
  },

  storyBadge: (dark) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '6px 14px', borderRadius: '2px',
    background: dark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(201, 168, 76, 0.1)',
    color: dark ? '#c9a84c' : '#8b6f4c',
  }),

  storyClose: (dark) => ({
    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    border: 'none', cursor: 'pointer',
    color: dark ? '#a89873' : '#6c5a3a',
    width: '36px', height: '36px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease',
  }),

  storyContent: { padding: '24px 32px 20px' },

  storyTitle: (dark) => ({
    fontSize: '24px', fontWeight: 400, lineHeight: '1.3',
    fontFamily: "'Cormorant Garamond', serif",
    color: dark ? '#e8d9b5' : '#3d2208',
    margin: '0 0 16px',
  }),

  storyDivider: (dark) => ({
    width: '40px', height: '1px',
    background: dark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(139, 111, 76, 0.2)',
    marginBottom: '20px',
  }),

  storyParagraph: (dark) => ({
    fontSize: '14px', lineHeight: '1.8',
    color: dark ? '#a89873' : '#6c5a3a',
    fontFamily: "'Inter', sans-serif", fontWeight: 300,
    margin: '0 0 16px',
    '&:last-child': { marginBottom: 0 },
  }),

  storyFooter: (dark) => ({
    padding: '16px 32px 24px',
    borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
    color: dark ? '#8a7a5a' : '#8b6f4c',
    fontFamily: "'Inter', sans-serif",
  }),

  footer: (dark) => ({
    position: 'relative', zIndex: 1,
    padding: '80px 48px', textAlign: 'center',
  }),

  footerContent: { maxWidth: '600px', margin: '0 auto' },

  footerDivider: (dark) => ({
    width: '40px', height: '1px',
    background: dark ? 'rgba(201, 168, 76, 0.3)' : 'rgba(139, 111, 76, 0.3)',
    margin: '0 auto 40px',
  }),

  footerQuote: (dark) => ({
    fontSize: '28px', fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic', color: dark ? '#c9a84c' : '#8b6f4c',
    margin: '0 0 16px', lineHeight: '1.4',
  }),

  footerSub: (dark) => ({
    fontSize: '14px', color: dark ? '#8a7a5a' : '#6c5a3a',
    fontFamily: "'Inter', sans-serif", fontWeight: 300,
    margin: '0 0 24px',
  }),

  footerTagline: (dark) => ({
    fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 500,
    color: dark ? '#a89873' : '#8b6f4c',
    letterSpacing: '2px', textTransform: 'uppercase',
  }),
}

export default Heritage

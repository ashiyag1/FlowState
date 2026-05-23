// ── STORAGE ──────────────────────────────────
export const Store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem('fwa_' + key); return v ? JSON.parse(v) : fallback }
    catch { return fallback }
  },
  set(key, val) {
    try { localStorage.setItem('fwa_' + key, JSON.stringify(val)); return true }
    catch { return false }
  },
  del(key) { localStorage.removeItem('fwa_' + key) },
}

// ── DATES ─────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10)

export const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
}

export const fmtTime = () => {
  const d = new Date()
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
}

export const getLast7Days = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (6 - i))
  return d.toISOString().slice(0, 10)
})

// ── WISDOM QUOTES ─────────────────────────────
export const QUOTES_BANK = [
  { text: "आत्मनो मोक्षार्थं जगद्धिताय च।", translation: "For one's own liberation and for the welfare of the world.", author: "Rig Veda", category: "dharma", source: "Rig Veda" },
  { text: "You cannot teach a man anything; you can only help him find it within himself.", author: "Swami Vivekananda", category: "wisdom", source: "Vivekananda" },
  { text: "योगः कर्मसु कौशलम्", translation: "Yoga is skill in action.", author: "Bhagavad Gita 2.50", category: "yoga", source: "Bhagavad Gita" },
  { text: "Take up one idea. Make that one idea your life — think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body, be full of that idea, and just leave every other idea alone. This is the way to success.", author: "Swami Vivekananda", category: "motivation", source: "Vivekananda" },
  { text: "Before you start some work, always ask yourself three questions — Why am I doing it? What the results might be? Will I be successful? Only when you think deeply and find satisfactory answers, go ahead.", author: "Chanakya Neeti", category: "wisdom", source: "Chanakya" },
  { text: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत", translation: "Whenever righteousness declines, I manifest myself.", author: "Bhagavad Gita 4.7", category: "dharma", source: "Bhagavad Gita" },
  { text: "Water is the basis of all existence. Health flows from purity of water and purity of mind.", author: "Charaka Samhita", category: "ayurveda", source: "Ayurveda" },
  { text: "The greatest religion is to be true to your own nature. Have faith in yourselves.", author: "Swami Vivekananda", category: "wisdom", source: "Vivekananda" },
  { text: "A person who is not disturbed by the incessant flow of desires can alone achieve peace.", translation: "Bhagavad Gita 2.70", author: "Krishna", category: "mindfulness", source: "Bhagavad Gita" },
  { text: "Education is the manifestation of the perfection already in man.", author: "Swami Vivekananda", category: "wisdom", source: "Vivekananda" },
  { text: "As is the atom, so is the universe. As is the human body, so is the cosmic body.", author: "Yajurveda", category: "cosmos", source: "Yajurveda" },
  { text: "नहि ज्ञानेन सदृशं पवित्रमिह विद्यते", translation: "Nothing in this world purifies like spiritual wisdom.", author: "Krishna", category: "wisdom", source: "Bhagavad Gita 4.38" },
  { text: "He who has health has hope; and he who has hope has everything. Tend the body as a temple.", author: "Chanakya Neeti", category: "health", source: "Chanakya" },
  { text: "सर्वे भवन्तु सुखिनः", translation: "May all beings be happy. May all be free from suffering.", author: "Brihadaranyaka Upanishad", category: "compassion", source: "Upanishads" },
  { text: "Arise, awake, and stop not till the goal is reached.", author: "Swami Vivekananda", category: "motivation", source: "Vivekananda" },
  { text: "योगश्चित्तवृत्तिनिरोधः", translation: "Yoga is the cessation of the fluctuations of the mind.", author: "Patanjali", category: "yoga", source: "Yoga Sutras 1.2" },
  { text: "The mind is like water — when calm, it reflects the stars.", author: "Vedantic Teaching", category: "mindfulness", source: "Vedanta" },
  { text: "The one who conquers the mind conquers the world. Begin with one small promise kept.", author: "Chanakya Neeti", category: "wisdom", source: "Chanakya" },
  { text: "जलमेव जीवनम्", translation: "Water alone is life. Honor it in your body every day.", author: "Atharva Veda", category: "health", source: "Atharva Veda" },
  { text: "अहिंसा परमो धर्मः", translation: "Non-violence is the highest virtue. Be gentle with yourself first.", author: "Mahabharata", category: "dharma", source: "Mahabharata" },
  { text: "The body is your temple. Keep it pure and clean for the soul to reside in.", author: "B.K.S. Iyengar", category: "yoga", source: "Yoga Tradition" },
  { text: "Small daily disciplines, sustained with devotion, create the extraordinary life.", author: "Ancient Gurukul Teaching", category: "habits", source: "Gurukul Tradition" },
  { text: "Dheere dheere re mana, dheere sab kuch hoye — Slowly, slowly, O mind, everything in its own time.", author: "Kabir Das", category: "mindfulness", source: "Kabir Dohe" },
  { text: "ਕਲ੍ਹ ਕਰੇ ਸੋ ਆਜ ਕਰ — Do tomorrow's work today, do today's work now.", author: "Kabir Das", category: "habits", source: "Kabir Dohe" },
  { text: "Naam jaap is not just repetition. It is the art of dissolving the self into the divine, drop by drop.", author: "Premanand Ji Maharaj", category: "mindfulness", source: "Satsang" },
  { text: "The body is a temple. Treating it with water, sleep, and purity is itself a form of worship.", author: "Premanand Ji Maharaj", category: "health", source: "Satsang" },
  { text: "Bhakti without discipline is like a river without banks — beautiful but aimless.", author: "Premanand Ji Maharaj", category: "habits", source: "Pravachan" },
  { text: "The earth is not flat, not a bowl. It is a sphere that pulls all things to its centre.", author: "Bhaskaracharya", category: "cosmos", source: "Siddhanta Shiromani, 1150 CE" },
  { text: "Numbers have no boundary. Just as the sky has no end, so counting of stars knows no limit.", author: "Bhaskaracharya", category: "cosmos", source: "Lilavati" },
  { text: "सत्यमेव जयते", translation: "Truth alone triumphs. Not untruth. Truth conquers all.", author: "Mundaka Upanishad", category: "dharma", source: "Upanishads" },
]

export const getDailyQuote = () => {
  const day = Math.floor(Date.now() / 86400000)
  return QUOTES_BANK[day % QUOTES_BANK.length]
}

export const fetchAIQuote = async () => getDailyQuote()

// ── HELPERS ───────────────────────────────────
export const clamp = (val, min, max) => Math.min(max, Math.max(min, val))
export const pct   = (val, max)      => Math.round(clamp(val / max * 100, 0, 100))
export const uid   = ()              => Math.random().toString(36).slice(2, 9)

// ── INDIA GREATNESS DATA ──────────────────────
export const INDIA_LEGACY = [
  {
    icon: '🏛️',
    title: 'Nalanda & Takshashila',
    subtitle: "World's First Universities",
    desc: "Long before Oxford existed, Nalanda hosted 10,000 scholars from across Asia. Takshashila (700 BCE) taught medicine, mathematics, astronomy, and philosophy to students of all nations.",
  },
  {
    icon: '🌿',
    title: 'Ayurveda',
    subtitle: 'The Science of Life',
    desc: 'Over 5,000 years old, Ayurveda identified 700+ medicinal herbs, understood the mind-body connection, and gave the world pulse diagnosis, herbal surgery, and the science of longevity.',
  },
  {
    icon: '🧘',
    title: 'Yoga & Meditation',
    subtitle: 'Union of Body & Soul',
    desc: "Codified by Maharishi Patanjali 2,500 years ago, yoga is India's gift to human wellness. From the Rig Veda's breath practices to today's global movement — it began here.",
  },
  {
    icon: '🔢',
    title: 'Mathematics & Zero',
    subtitle: 'The Number That Changed the World',
    desc: 'Aryabhata calculated π accurately in 499 CE. Brahmagupta formalized zero. Madhava discovered infinite series 200 years before Newton. India invented the numerals the world now uses.',
  },
  {
    icon: '📜',
    title: 'Vedas & Upanishads',
    subtitle: "Humanity's Oldest Texts",
    desc: 'The Rigveda (1500 BCE) contains hymns of extraordinary philosophy. The Upanishads explore consciousness, self, and cosmos in ways that still astonish modern scientists.',
  },
  {
    icon: '⭐',
    title: 'Ancient Astronomy',
    subtitle: 'Mapping the Cosmos',
    desc: "Bhaskaracharya calculated Earth's rotation in the 12th century. Indian astronomers mapped planetary motion, eclipses, and star charts with stunning accuracy centuries before Europe.",
  },
]

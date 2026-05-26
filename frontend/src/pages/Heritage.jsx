import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import { useSoundEffects } from '../hooks/useSoundEffects'
import {
  ChevronRight, ArrowUpRight, Sparkles,
  Heart, X, BookOpen, Bookmark, ArrowRight, Play, Pause
} from 'lucide-react'

// Image imports
import heroDark from '../assets/heritage/heritage_hero_dark.webp'
import heroLight from '../assets/heritage/heritage_hero_light.webp'
import heritageBg from '../assets/heritage/heritage_bg.webp'
import aryabhataPortrait from '../assets/heritage/aryabhata_portrait.webp'
import bhaskaraPortrait from '../assets/heritage/bhaskara_portrait.webp'
import lilavatiPortrait from '../assets/heritage/lilavati_portrait.webp'
import charakaPortrait from '../assets/heritage/charaka_portrait.webp'
import paniniPortrait from '../assets/heritage/panini_portrait.webp'
import sushrutaPortrait from '../assets/heritage/sushruta_portrait.webp'
import brahmaguptaPortrait from '../assets/heritage/brahmagupta_portrait.webp'
import madhavaPortrait from '../assets/heritage/madhava_portrait.webp'
import chanakyaPortrait from '../assets/heritage/chanakya_portrait.webp'
import patanjaliPortrait from '../assets/heritage/patanjali_portrait.webp'
import kanadaPortrait from '../assets/heritage/kanada_portrait.webp'
import gargiPortrait from '../assets/heritage/gargi_portrait.webp'
import khanaPortrait from '../assets/heritage/khana_portrait.webp'

const CONCEPT_STORIES = [
  {
    title: "2,000 Years Before Computers, a Poet Invented Binary Code",
    source: "Pingala's Chandah Sutra, ~200 BCE",
    tag: "binary code",
    paragraphs: [
      "Pingala wasn't an engineer. He was a poet studying Sanskrit rhythm — how short and long syllables combine to create meter. To map every possible pattern, he invented a system of 0s and 1s, assigning light syllables as laghu (0) and heavy ones as guru (1). Binary, in verse, 2,000 years before the first computer.",
      "He also discovered what we now call the Fibonacci sequence — a pattern where each number is the sum of the two before it — long before Fibonacci was born. The rhythm of poetry led him to the mathematics that powers modern computing."
    ]
  },
  {
    title: "Chess Wasn't Invented for Kings. It Was Invented to Simulate War.",
    source: "Chaturanga, 6th Century CE",
    tag: "chess origins",
    paragraphs: [
      "1,500 years ago in India, a game called Chaturanga appeared — meaning 'four limbs of the army.' It had infantry, cavalry, elephants, and chariots: exactly what a real battlefield looked like. The goal wasn't to win. It was to out-think your enemy.",
      "Chaturanga spread to Persia (where it became Shatranj), then to Europe, where it evolved into modern chess. The queen — the most powerful piece on the board — was added later. But the DNA of every chess match ever played was written in ancient India."
    ]
  },
  {
    title: "The World's First Campus Had 10,000 Students. And a Library That Burned for Months.",
    source: "Nalanda University, 5th–12th Century CE",
    tag: "ancient university",
    paragraphs: [
      "Before Oxford, before Cambridge, before any European university existed, there was Nalanda — a residential campus with 10,000 students and 2,000 teachers. Students came from Tibet, China, Korea, Japan, Persia. They studied astronomy, medicine, logic, philosophy, and mathematics.",
      "The library, called Dharmaganja, had hundreds of thousands of manuscripts across nine stories. When it was burned by invaders in 1193, the fire reportedly raged for months. The knowledge lost would have filled centuries. Nalanda wasn't just a university. It was humanity's first global brain."
    ]
  },
  {
    title: "India Was Making Pure Zinc 500 Years Before Europe Cracked the Formula",
    source: "Zawar Mines, Rajasthan, 12th Century CE",
    tag: "lost metallurgy",
    paragraphs: [
      "Zinc is tricky to produce. It boils at 907°C — right when it's being smelted — so it vaporizes before it can be collected. Europe couldn't figure this out until the 18th century. India had it figured in the 12th century — at the Zawar mines in Rajasthan.",
      "They built vertical retort furnaces that condensed zinc vapor into liquid metal. The process was so efficient and so complex that when the site was rediscovered, modern engineers were baffled by its sophistication. Ancient metallurgists were running industrial chemistry 800 years ahead of the curve."
    ]
  },
  {
    title: "The Way You Write Numbers Changed the World — and It Came From Here",
    source: "Ancient Indian Mathematics, 5th Century CE",
    tag: "decimal system",
    paragraphs: [
      "The number 365 means three hundreds, six tens, and five ones. This feels so natural you probably never think about it. But someone had to invent the idea that a digit's value depends on where it sits. That breakthrough — the decimal place-value system — was developed in India.",
      "Without it, there is no accounting, no engineering, no modern science, no computers. The Romans had number systems so clunky they needed specialists just to do multiplication. India's system was so elegant it spread across the world and became universal. You use it every second of every day."
    ]
  },
  {
    title: "Ancient Indians Had Names for Numbers Up to 10^53. Why? Because They Could.",
    source: "Vedic Mathematics, Circa 1000 BCE",
    tag: "cosmic numbers",
    paragraphs: [
      "Most ancient cultures stopped naming numbers at a few thousand. Rome had 'mille' (thousand) and 'deciens' (ten thousand) — then they ran out of words. Ancient India had names for numbers up to 10^53 — a 1 followed by 53 zeros. They called it asankhyeya: 'the countless.'",
      "They needed these numbers for cosmology — they measured time in cycles of 4.32 billion years called Kalpas. They calculated the speed of light. The age of the universe. They thought in cosmic scales because they understood that the universe itself thinks in cosmic scales."
    ]
  }
]

const CURIOSITY_STORIES = [
  {
    title: "Why Do Indian Kids Learn More About British Kings Than Their Own Emperors?",
    source: "Macaulay's Education System, 1835",
    tag: "the education question",
    group: "colonial-hangover",
    paragraphs: [
      "Most Indian schoolchildren can name all six wives of Henry VIII. Ask them about the Gupta Empire or the Chola dynasty — silence. This isn't an accident. Macaulay's 1835 education system was designed to create Indians who admired British rule. Clerks who would serve the empire, not citizens who would question it.",
      "The curriculum prioritized English literature and British history. Indian mathematics, astronomy, medicine — barely mentioned. The system wasn't designed to make us proud. It was designed to make us grateful. Two centuries later, we're still using the same blueprint. When do we rewrite it?"
    ]
  },
  {
    title: "4,500 Years Ago, Someone Invented the Flush Toilet. Then the World Forgot How.",
    source: "Harappa & Mohenjo-Daro, Indus Valley",
    tag: "reset button",
    group: "flexes",
    paragraphs: [
      "Every single house in Mohenjo-Daro had a private bathroom with a flushing toilet connected to an underground sewer system. Covered brick channels. Manholes for cleaning. This was 4,500 years ago. Then the civilization declined, and the world forgot. London didn't get proper sewers until the 19th century.",
      "Think about that. Humans once had something, lost it, and took 4,000 years to get it back. That's not a story about plumbing. That's a story about how fragile knowledge really is. One generation builds. The next forgets. The one after that has to rediscover everything from scratch. What else have we forgotten?"
    ]
  },
  {
    title: "The 'Fairness' Obsession: How Colonialism Changed What Beauty Means in India",
    source: "The Skin Deep Wound",
    tag: "internalized hierarchy",
    group: "colonial-hangover",
    paragraphs: [
      "Walk into any Indian pharmacy and you'll see shelves of fairness creams. Billboards promise lighter skin as the shortcut to success. This didn't come from nowhere. British colonialism created a hierarchy where lighter skin meant power, access, respect. The darker you were, the further you were from the rulers. A hundred and fifty years later, that hierarchy still runs in our heads.",
      "We've turned the color of colonization into a multi-billion rupee industry. We lighten our skin for job interviews, for weddings, for confidence. We absorb the idea that lighter is better without asking where that idea came from. Decolonizing isn't just about politics. It's about looking in the mirror and unlearning what we were taught to see."
    ]
  },
  {
    title: "The Exam That Decides Everything: A System Designed to Produce Clerks",
    source: "British-Era Education Architecture",
    tag: "the education trap",
    group: "colonial-hangover",
    paragraphs: [
      "Every year, millions of Indian teenagers sit for exams that decide their entire future — JEE, NEET, UPSC. The pressure destroys childhoods, mental health, and creativity. We've normalized this. But this system wasn't designed by Indians for Indians. It was inherited from the British, who created exams to train obedient civil servants — not thinkers, not innovators, not people who ask why.",
      "Rote learning. Memorization. Competition over curiosity. We've turned a colonial bureaucracy test into the gatekeeper of dreams. The system produces excellent clerks. But does it produce fulfilled humans? 200 years later, we're still studying for someone else's exam. What would an Indian education system look like if we designed it for ourselves?"
    ]
  },
  {
    title: "A Hollywood Movie About Mars Cost More Than India's Actual Trip to Mars",
    source: "Mangalyaan, ISRO, 2013",
    tag: "the ultimate flex",
    group: "flexes",
    paragraphs: [
      "India's Mangalyaan mission to Mars had a budget of $74 million. The movie 'The Martian' cost $108 million to make. A Hollywood film about going to Mars cost more than India actually going to Mars. And here's the craziest part: India made it on the first attempt — something no other nation had ever done before.",
      "The mission was built with off-the-shelf components, improvised engineering, and a budget that NASA spends on coffee. While the world laughed at the idea of a developing country reaching Mars, ISRO just… did it. For less than the cost of a Hollywood blockbuster. That's not just smart. That's a country saying: we don't need your budget. We need your belief."
    ]
  },
  {
    title: "A God Dancing at the Edge of Physics",
    source: "Nataraja, The Cosmic Dance of Shiva",
    tag: "when myth meets math",
    group: "pop-culture",
    paragraphs: [
      "Look at a statue of Nataraja — Shiva dancing within a ring of fire. One hand holds a drum (creation). Another holds fire (destruction). One foot is raised (liberation). The other crushes a demon (ignorance). The dance never stops. It is the rhythm of the universe — birth, death, rebirth, over and over.",
      "When physicists at CERN saw the Nataraja, they didn't see mythology. They saw a metaphor for what they observe in particle accelerators — subatomic particles appearing and vanishing, matter and energy constantly exchanging form. Feynman said the dance of Shiva was the best description of the quantum world he'd ever seen. Sometimes the deepest truths arrive not in equations but in stories, carved in stone, waiting centuries for science to catch up."
    ]
  },
  {
    title: "The Matrix Wasn't Inspired by the Future. It Was Inspired by a 5,000-Year-Old Text.",
    source: "The Bhagavad Gita meets The Matrix",
    tag: "pop culture & philosophy",
    group: "pop-culture",
    paragraphs: [
      "The Wachowskis wanted Neo to feel like a reluctant hero. So they gave him the same dilemma Arjuna faced in the Bhagavad Gita — a warrior who doesn't want to fight but must see through the illusion of the world to find his purpose. The red pill isn't just a plot device. It's the concept of Maya: reality as we perceive it is a veil, and truth lies beyond it.",
      "Keanu Reeves has said the Gita shaped his entire approach to the role. 'There is no spoon' isn't just a cool line — it's the philosophy that the physical world is a construct and the mind is what's real. One of the most influential films of the 21st century didn't look to the future for inspiration. It looked 5,000 years into the past."
    ]
  },
  {
    title: "The Man Who Ended Worlds Found His Words in an Ancient Indian Scripture",
    source: "Oppenheimer & The Bhagavad Gita",
    tag: "history meets ancient wisdom",
    group: "pop-culture",
    paragraphs: [
      "When Robert Oppenheimer watched the first nuclear bomb explode over New Mexico, a line from the Bhagavad Gita flashed through his mind: 'Now I am become Death, the destroyer of worlds.' He had learned Sanskrit to read the Gita in its original language. In the most defining moment of modern history, he reached for an ancient Indian text to make sense of it.",
      "He wasn't being dramatic. He genuinely believed the Gita contained the deepest truths about creation and destruction. When the 20th century needed words big enough for the atomic age, it found them in a book written thousands of years before."
    ]
  },
  {
    title: "The Beatles Went to an Indian Ashram and Changed Music Forever",
    source: "Rishikesh, 1968",
    tag: "when the west tuned in",
    group: "pop-culture",
    paragraphs: [
      "In 1968, The Beatles traveled to Rishikesh to study Transcendental Meditation with Maharishi Mahesh Yogi. They stayed in a simple ashram, woke up at 3 AM for meditation, and wrote 48 songs — nearly half of which ended up on the White Album. Something about the silence of the Himalayas unlocked a creative surge that the noise of London never could.",
      "That trip didn't just change The Beatles. It changed music. George Harrison brought the sitar into Western pop. The idea of meditation entered the mainstream. 60,000 people a year started making the same pilgrimage to Rishikesh. A generation raised on rock 'n' roll discovered that the most profound sound they'd ever heard wasn't a guitar riff — it was silence."
    ]
  },
  {
    title: "Doctor Strange Walks Through a Multiverse That Ancient India Mapped Centuries Ago",
    source: "Marvel Meets Vedanta",
    tag: "the original multiverse",
    group: "pop-culture",
    paragraphs: [
      "Doctor Strange travels through astral planes, bends reality, and opens a third eye to see beyond the physical world. Marvel calls it fiction. Ancient India called it Vedanta. The concept of multiple universes — lokas — has existed in Hindu cosmology for thousands of years. Astral projection, the third eye, the idea that reality is a construct shaped by consciousness — none of this is new.",
      "The Ancient One tells Strange that 'we never lose our demons — we only learn to live above them.' That's not a superhero pep talk. That's the entire philosophy of the Bhagavad Gita. The multiverse isn't a Marvel invention. It's a very old Indian idea dressed in a cape. Strange didn't discover the multiverse. He just reminded us how much we forgot."
    ]
  },
  {
    title: "Before Paris or Milan, India Ruled Global Fashion for 2,000 Years",
    source: "India's Textile Empire",
    tag: "forgotten history",
    group: "flexes",
    paragraphs: [
      "Roman emperors paid fortunes for Indian muslin so fine it was called 'woven air.' A single bolt of Dhaka muslin could be pulled through a wedding ring. Indian cotton, silk, and calico dominated global markets from Rome to China. Long before Paris or Milan, the world's fashion capital was Bengal, Gujarat, and Tamil Nadu.",
      "Then colonial policies systematically dismantled the industry — tariffs, forced raw cotton exports, factory-made cloth flooding Indian markets. Millions of weavers lost their livelihoods. An entire global industry was erased so thoroughly that the world forgot India was once the center of everything we wear. But the threads are still there, woven into the fabric of fashion history."
    ]
  },
  {
    title: "The Most Powerful Weapon Colonizers Used Wasn't a Gun. It Was a Classroom.",
    source: "Macaulay's Minute on Education, 1835",
    tag: "the colonized mind",
    group: "colonial-hangover",
    paragraphs: [
      "In 1835, Thomas Macaulay declared that 'a single shelf of a good European library was worth the whole native literature of India and Arabia.' This wasn't an opinion — it became British policy. English was made the language of power. Sanskrit, Persian, Hindi, Tamil — all pushed aside. Generations were taught their own languages weren't good enough for science or philosophy.",
      "That's the deepest scar of colonization — not the wealth stolen, but the identity erased. When you're raised believing your language is backward, your culture is primitive, your history is unimportant, you start believing it. The British left nearly 80 years ago. But the voice that says 'ours isn't good enough'? That voice takes generations to silence. Recognizing it is the first step."
    ]
  },
  {
    title: "The Language You Speak Decides How Much the World Respects You",
    source: "The English Class Divide",
    tag: "the accent of power",
    group: "colonial-hangover",
    paragraphs: [
      "India has more English speakers than the entire population of the UK. But here's the uncomfortable truth: the ones who speak it with a 'native' accent get called for the job interview. The ones who speak it with an Indian accent get told 'we'll keep your resume on file.' We've built a country where your mother tongue can determine your ceiling before you even start.",
      "Macaulay wanted a class of interpreters — Indians who would bridge the gap between the rulers and the ruled. He created exactly that. Two centuries later, we still measure intelligence by fluency in a language we inherited, not one we chose. The irony? Sanskrit, Tamil, and Telugu are older than English will ever be. But colonialism taught us to hear our own languages as inferior."
    ]
  },
  {
    title: "In 10,000 Years of Civilization, India Never Invaded a Single Country",
    source: "A History Without Conquest",
    tag: "the quiet giant",
    group: "flexes",
    paragraphs: [
      "Name one country India invaded to colonize. You can't. Because it never happened. In 10,000 years of continuous civilization, India never launched a war of aggression to take someone else's land. Its ideas — Buddhism, mathematics, philosophy — spread across Asia through teachers and traders, not soldiers and swords.",
      "Think about how rare that is. Almost every great civilization — Rome, Britain, Persia, Mongolia, China — built itself through conquest. India built itself through absorption. It welcomed invaders, absorbed their cultures, and outlasted them all. That's not weakness. That's a different kind of strength. The kind that doesn't need to dominate to matter."
    ]
  },
  {
    title: "The World's Persecuted Found a Home in India. Every Single Time.",
    source: "India's Legacy of Refuge",
    tag: "the open door",
    group: "flexes",
    paragraphs: [
      "When Jews fled persecution 2,000 years ago, India welcomed them. They still live here peacefully. When the first Christians arrived with Thomas, India gave them space. When Parsees escaped religious genocide in Persia, India said: stay. When Tibetans fled China, India opened its borders. When Sri Lankans, Burmese, and Bangladeshis fled war, India didn't turn them away.",
      "There is no other country on Earth that can tell this story. India has been absorbing the world's refugees for millennia — not because it had to, but because its culture never learned to say no. The guest is God. Atithi Devo Bhava. That's not just a saying. It's the quietest, most beautiful revolution in human history."
    ]
  }
]

const CURIOSITY_GROUPS = [
  { id: 'colonial-hangover', label: 'the colonial hangover', emoji: '🧠', desc: 'How 200 years of colonization rewired what we learn, how we see ourselves, and what success means.' },
  { id: 'flexes', label: 'flexes that go hard', emoji: '🔥', desc: 'Mars missions on a shoestring, inventing the flush toilet millennia ahead of schedule — India didn\'t just show up, it showed out.' },
  { id: 'pop-culture', label: 'pop culture rabbit holes', emoji: '🎬', desc: 'The Matrix, Oppenheimer, CERN — turns out the coolest modern references are all footnotes to ancient Indian texts.' },
]

const SCHOLARS = [
  {
    id: 1, name: 'Aryabhata', period: '476 – 550 CE',
    title: 'He saw a spinning Earth when everyone believed the sky was a ceiling.',
    desc: 'At 23, he calculated π, mapped the solar year, and proved the Earth rotates — not because he was told, but because he asked the night sky better questions.',
    img: aryabhataPortrait,
    field: 'mathematics', color: '#c9a84c',
    story: {
      title: "Aryabhata: The Young Man Who Refused to Believe What Everyone Believed",
      source: "Aryabhatiya, 499 CE",
      paragraphs: [
        "At 23, while the world saw a flat Earth under a domed sky, Aryabhata watched the stars and saw something else: a sphere, spinning in an infinite void. He called it Bhugola. He realized the stars weren't moving — we were. Like watching the shore drift backward from a boat. He was describing relativity, 1,400 years before Einstein.",
        "He calculated the solar year to minutes of accuracy, found π to four decimals, and proved eclipses were shadows — not demons. No telescope. No permission. Just a young mind asking: what if everything we know is wrong? The bravest thing you can do is trust your own eyes when the whole world tells you you're seeing things. Aryabhata did that at 23."
      ]
    }
  },
  {
    id: 2, name: 'Bhaskaracharya', period: '1114 – 1185 CE',
    title: 'He felt gravity\'s pull 500 years before Newton.',
    desc: 'While the world saw apples fall, Bhaskaracharya saw a universal force. He wrote equations of attraction, motion, and the infinite — long before calculus had a name.',
    img: bhaskaraPortrait,
    field: 'astronomy', color: '#8b6f4c',
    story: {
      title: "Bhaskaracharya: The Man Who Saw the Invisible Force Holding Everything Together",
      source: "Siddhanta Shiromani, 1150 CE",
      paragraphs: [
        "500 years before Newton, Bhaskaracharya wrote that objects fall because the Earth pulls them — a universal force of attraction. He was describing gravity and the gravitational field in the 12th century. Europe wouldn't catch up for another 500 years.",
        "He also wrote that dividing by zero yields infinity. He calculated a planet's instantaneous speed by breaking motion into infinitely small pieces — the foundational idea of calculus. He wasn't ahead of his time. He was operating in a time that hadn't arrived yet. Genius doesn't wait for permission. It just sees what others don't."
      ]
    }
  },
  {
    id: 3, name: 'Lilavati', period: 'by Bhaskaracharya',
    title: 'Mathematics, written like a love letter.',
    desc: 'A father\'s grief turned into poetry. Bhaskaracharya named his greatest work after his daughter, creating a book where numbers told stories and equations felt like lullabies.',
    img: lilavatiPortrait,
    field: 'mathematics', color: '#d4a82a',
    story: {
      title: "Līlāvatī: When a Father Turned His Grief Into the Most Beautiful Math Book Ever Written",
      source: "Līlāvatī of Bhāskara II, 12th Century CE",
      paragraphs: [
        "Most math textbooks are dry and forgettable. The Līlāvatī is a conversation — a father teaching his daughter through riddles and poems. Bhaskaracharya named it after Līlāvatī, 'one who plays,' because he wanted math to feel like play.",
        "\"Beautiful Līlāvatī, tell me — how many flavor combinations can you make with six tastes?\" The problems are stories, the equations are verses. Arithmetic, geometry, algebra, early calculus — all wrapped in a father's love. Not the most advanced math book ever written. Just the most human. Because math, at its best, is just a way of saying: I love you."
      ]
    }
  },
  {
    id: 4, name: 'Charaka', period: 'circa 300 BCE',
    title: 'He believed healing begins with balance, not medicine.',
    desc: 'Charaka saw health as harmony — between body, mind, and nature. He mapped the human body from the inside out, and reminded us that true medicine treats the person, not the symptom.',
    img: charakaPortrait,
    field: 'medicine', color: '#4a7c59',
    story: {
      title: "Charaka: The Physician Who Saw Health as Harmony",
      source: "Charaka Samhita, circa 300 BCE",
      paragraphs: [
        "Long before medicine became prescriptions and lab reports, Charaka understood that health is balance — between body, mind, and nature. He mapped the human body like a continent, describing the heart as a central hub connected to ten channels carrying energy and consciousness.",
        "He wrote an oath for physicians — centuries before Hippocrates — demanding they treat the poor for free, keep confidentiality, and serve with absolute dedication. Charaka didn't just practice medicine. He defined what it means to care for another human being. Long before it was a profession, he knew healing was an act of love."
      ]
    }
  },
  {
    id: 5, name: 'Panini', period: 'circa 400 BCE',
    title: 'He built the world\'s first programming language — 2,400 years ago.',
    desc: 'Panini didn\'t just write grammar. He invented an algorithmic system of 3,996 rules so precise that modern computer scientists recognized it as the ancestor of all programming languages.',
    img: paniniPortrait,
    field: 'literature', color: '#7c6b4a',
    story: {
      title: "Panini: The Grammarian Who Accidentally Invented Computer Science",
      source: "Ashtadhyayi, circa 400 BCE",
      paragraphs: [
        "Panini created 3,996 rules that don't just describe Sanskrit — they generate it. Input a root, apply the rules in order, and the perfect word emerges. Variables, recursion, conditionals — all in verse. It was the world's first compiler, 2,400 years before the first computer.",
        "When John Backus designed BNF for programming languages, he unknowingly replicated Panini's logic. Every line of code you write traces back to a man who saw language as pure, structured mathematics. He proved that language itself is code — and cracked it 24 centuries before anyone else. Before there was a language for computers, there was a computer for language. Built entirely in the mind."
      ]
    }
  },
  {
    id: 6, name: 'Sushruta', period: 'circa 600 BCE',
    title: 'He performed plastic surgery in 600 BCE. With hands, not machines.',
    desc: 'Sushruta believed the human body deserved understanding, precision, and care. He designed 120 surgical tools, rebuilt faces, and wrote the first surgical manual — all before the West had a word for surgery.',
    img: sushrutaPortrait,
    field: 'medicine', color: '#a33b3b',
    story: {
      title: "Sushruta: The Surgeon Who Rebuilt Faces 2,600 Years Ago",
      source: "Sushruta Samhita, circa 600 BCE",
      paragraphs: [
        "In Varanasi, 2,600 years ago, Sushruta taught students to practice incisions on gourds before touching a human body. He designed 120 surgical instruments shaped like birds and animals to fit the hand naturally. He invented rhinoplasty — rebuilding a severed nose with a skin flap from the cheek. Plastic surgery, millennia before the term existed.",
        "His Samhita describes 300 procedures — cataract removal, bone setting, wound sterilization with herbs. Every principle he laid down — preparation, sanitation, precision — is still the foundation of surgery today. Every time a surgeon washes their hands before an operation, they're following a rule written 2,600 years ago by a man who believed cleanliness was next to reverence."
      ]
    }
  },
  {
    id: 7, name: 'Brahmagupta', period: '598 – 668 CE',
    title: 'He gave nothingness a name — and changed the world.',
    desc: 'Before Brahmagupta, zero was just a gap. He made it a number. He defined its rules, and in doing so, unlocked algebra, calculus, and the logic behind every computer on Earth.',
    img: brahmaguptaPortrait,
    field: 'mathematics', color: '#c9a84c',
    story: {
      title: "Brahmagupta: The Man Who Looked at Nothing and Saw Everything",
      source: "Brahmasphuta Siddhanta, 628 CE",
      paragraphs: [
        "Before 628 CE, zero was just a blank space. Brahmagupta gave emptiness a name — Shunya — and wrote its laws: a number minus itself is zero, zero times anything is zero, adding zero changes nothing. He completed the number system by treating nothing as something.",
        "He also introduced negatives as 'debts' and positives as 'fortunes.' Every quadratic equation, every spreadsheet, every computer traces back to this one act of intellectual courage. Brahmagupta proved that nothing matters — literally. And in doing so, made nothing the most important number in existence."
      ]
    }
  },
  {
    id: 8, name: 'Madhava', period: '1340 – 1425 CE',
    title: 'He saw infinity — and made it calculate.',
    desc: 'On the shores of Kerala, Madhava discovered infinite series 300 years before Newton. He understood that some patterns never end — and used that infinity to find π with astonishing precision.',
    img: madhavaPortrait,
    field: 'mathematics', color: '#b8924a',
    story: {
      title: "Madhava of Sangamagrama: The Man Who Calculated With Infinity",
      source: "Kerala School of Mathematics, circa 1400 CE",
      paragraphs: [
        "On the coast of Kerala, in the 14th century, Madhava discovered infinite series for sine, cosine, and tangent — formulas that add up forever but converge to exact values. This is the heart of calculus, and Madhava reached it 300 years before Europe.",
        "He used these series to calculate π to 11 decimal places — a world record that stood for centuries. His work was preserved on palm-leaf manuscripts by his students. Three centuries later, Newton and Leibniz would independently rediscover what Madhava had already mapped. One person, on a coast, chasing infinity — and winning. While the world waited for calculus, Madhava was already there, alone with his palm leaves, having conversations with the infinite."
      ]
    }
  },
  {
    id: 9, name: 'Chanakya', period: '375 – 283 BCE',
    title: 'He knew that power is nothing without wisdom.',
    desc: 'Chanakya understood something timeless: emotions can destroy kingdoms faster than armies ever could. His Arthashastra is not about war — it\'s about the art of staying human while holding power.',
    img: chanakyaPortrait,
    field: 'literature', color: '#7c6b4a',
    story: {
      title: "Chanakya: The Strategist Who Understood Power and Human Nature Better Than Anyone",
      source: "Arthashastra, circa 300 BCE",
      paragraphs: [
        "Chanakya understood something few strategists grasp: emotions destroy kingdoms faster than enemies. His Arthashastra covers economics, diplomacy, taxes, intelligence — but beneath every rule is a deep understanding of human psychology. Greed, fear, pride — those are the real forces shaping history.",
        "He outlined four methods of diplomacy — Sama (persuasion), Bheda (division), Danda (force) — and advised trying peace first. His ideas are still studied in military academies and business schools. Chanakya didn't just write about power. He wrote about the human heart, because that's where all power really lives. The hardest battle isn't against an enemy. It's against your own ego."
      ]
    }
  },
  {
    id: 10, name: 'Patanjali', period: 'circa 150 BCE',
    title: 'He mapped the mind before psychology existed.',
    desc: 'Patanjali didn\'t invent yoga — he gave it structure. 196 sutras, 8 limbs, one goal: to quiet the endless noise of the mind. He was the original psychologist, prescribing breath as medicine.',
    img: patanjaliPortrait,
    field: 'literature', color: '#8b6f4c',
    story: {
      title: "Patanjali: The Psychologist Who Discovered the Architecture of the Mind",
      source: "Yoga Sutras of Patanjali, circa 150 BCE",
      paragraphs: [
        "Before therapy, before neuroscience, Patanjali looked at the human mind and saw its restlessness — the chattering, the looping thoughts, the anxieties. He wrote a manual for quieting it. He called it the Yoga Sutras.",
        "His definition of yoga: 'Chitta Vritti Nirodha' — stopping the fluctuations of the mind. Eight limbs: ethics, breath, concentration, meditation. Not mysticism — a systematic psychological technology for inner peace. He understood 2,000 years ago that the breath is a bridge between body and mind. Peace is a skill you can cultivate. And like any skill, it takes practice."
      ]
    }
  },
  {
    id: 11, name: 'Kanada', period: 'circa 600 BCE',
    title: 'He saw the invisible — atoms, force, and motion.',
    desc: '2,600 years ago, Kanada declared that matter is made of tiny, indestructible particles. He called them paramanu. He was naming atoms before telescopes or microscopes — using nothing but logic.',
    img: kanadaPortrait,
    field: 'mathematics', color: '#4a7c59',
    story: {
      title: "Kanada: The Philosopher Who Saw Atoms With Pure Reason",
      source: "Vaisheshika Sutra, circa 600 BCE",
      paragraphs: [
        "2,600 years ago, before microscopes or particle accelerators, Kanada asked: what is the world made of? His answer: Paramanu — tiny, indestructible particles that combine to form everything. He was describing atoms through pure logic, without a single instrument.",
        "He wrote that atoms are eternal, that they pair and triplet into molecules, that heat and light cause chemical change. It took the world 2,000 years and a particle accelerator to confirm what Kanada reasoned with nothing but his mind. Sometimes the greatest instrument of discovery isn't a microscope. It's a sharp brain and the courage to ask: what is this really made of?"
      ]
    }
  },
  {
    id: 12, name: 'Gargi', period: 'circa 700 BCE',
    title: 'She asked questions no one dared to ask.',
    desc: 'In a court of kings and sages, Gargi stood up and challenged the universe itself. She didn\'t ask about rituals — she asked what holds the stars in place. Her questions still echo through time.',
    img: gargiPortrait,
    field: 'literature', color: '#d4a82a',
    story: {
      title: "Gargi: The Woman Who Questioned the Universe and Silenced Kings",
      source: "Brihadaranyaka Upanishad, circa 700 BCE",
      paragraphs: [
        "In King Janaka's court, the greatest minds had gathered. A thousand gold-horned cows awaited the wisest scholar. While men debated rituals, a woman rose and changed the conversation. Her name was Gargi.",
        "She didn't ask about offerings. She asked: 'What is the earth woven on? Water. What is water woven on? Air. And air?' She pushed through space, through stars, to the edge of existence. Her questions were so profound the entire assembly fell silent. She proved that intellectual courage has no gender — and her questions are still ours today. She stood in a room full of men who thought they knew everything and asked: but do you really?"
      ]
    }
  },
  {
    id: 13, name: 'Khana', period: 'circa 800 – 1200 CE',
    title: 'She read the stars to feed the earth.',
    desc: 'Khana turned astronomy into agriculture. Her simple rhymes predicted rain, drought, and harvests. While court astronomers calculated for kings, Khana calculated for farmers — science in service of life.',
    img: khanaPortrait,
    field: 'astronomy', color: '#b8924a',
    story: {
      title: "Khana: The Woman Who Made Astronomy a Tool for the People",
      source: "Khana's Bachan (Maxims of Khana), Medieval Era",
      paragraphs: [
        "While court astronomers calculated for kings, a woman in Bengal used the same stars to help farmers plant rice. Khana translated astronomy into simple rhyming verses — when the moon is in this phase, plant now. When the wind blows this way, drought is coming.",
        "Her predictions were so accurate that farmers trusted her over royal astronomers. Her maxims are still quoted in Bengal today. She represents science that doesn't stay in towers — it goes into fields, into homes, into survival. While court astronomers studied the stars for wonder, Khana studied them for life. That's a choice. And it matters."
      ]
    }
  }
]

const CATEGORIES = [
  { id: 'all', label: 'all', icon: <Sparkles size={13} /> },
  { id: 'mathematics', label: 'mathematics', icon: <span style={{fontSize: '14px', lineHeight: 1, fontFamily: 'serif', fontWeight: 'bold'}}>π</span> },
  { id: 'astronomy', label: 'astronomy', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="6"/><path d="M4 16c2-3 8-7 14-8"/></svg> },
  { id: 'medicine', label: 'medicine', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'literature', label: 'literature', icon: <BookOpen size={13} /> }
]

function OrnateCorners({ dark }) {
  const color = dark ? "rgba(201, 168, 76, 0.45)" : "rgba(139, 111, 76, 0.45)";
  return (
    <>
      <svg style={{ position: 'absolute', top: '8px', left: '8px', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M0 0h16v2H2v14H0V0z" fill={color} />
        <circle cx="5" cy="5" r="1.5" fill={color} />
      </svg>
      <svg style={{ position: 'absolute', top: '8px', right: '8px', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M16 0H0v2h14v14h2V0z" fill={color} />
        <circle cx="11" cy="5" r="1.5" fill={color} />
      </svg>
      <svg style={{ position: 'absolute', bottom: '8px', left: '8px', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M0 16h16v-2H2V0H0v16z" fill={color} />
        <circle cx="5" cy="11" r="1.5" fill={color} />
      </svg>
      <svg style={{ position: 'absolute', bottom: '8px', right: '8px', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M16 16H0v-2h14V0h2v16z" fill={color} />
        <circle cx="11" cy="11" r="1.5" fill={color} />
      </svg>
    </>
  )
}

function Heritage() {
  const { dark } = useTheme()
  const { startWisdomAmbience, stopWisdomAmbience, isMuted } = useSoundEffects()
  const [activeCategory, setActiveCategory] = useState('all')
  const [savedScholars, setSavedScholars] = useState([])
  const [modalData, setModalData] = useState(null)
  const [showAllGrid, setShowAllGrid] = useState(false)
  const [introOpen, setIntroOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState(['colonial-hangover'])
  const scrollRef = useRef(null)
  const [isPlayingSound, setIsPlayingSound] = useState(false)

  const toggleGroup = (id) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleWatchIntro = () => {
    setIntroOpen(true)
    startWisdomAmbience('tibetanBowl')
  }

  const handleCloseIntro = () => {
    setIntroOpen(false)
    stopWisdomAmbience()
  }

  const togglePlaySound = () => {
    if (isPlayingSound) {
      stopWisdomAmbience()
      setIsPlayingSound(false)
    } else {
      startWisdomAmbience('sitarBgm')
      setIsPlayingSound(true)
    }
  }

  // Ensure sound stops if page is unmounted
  useEffect(() => {
    return () => {
      stopWisdomAmbience()
    }
  }, [stopWisdomAmbience])

  const toggleSave = (id, e) => {
    e.stopPropagation()
    setSavedScholars(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const scrollSlider = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const offset = clientWidth * 0.6
      const scrollTo = direction === 'left' ? scrollLeft - offset : scrollLeft + offset
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const handleViewAllScholars = (e) => {
    e.preventDefault()
    setActiveCategory('all')
    setShowAllGrid(true)
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      }
    }, 50)
  }

  const filteredScholars = activeCategory === 'all'
    ? SCHOLARS
    : SCHOLARS.filter(s => s.field === activeCategory)

  return (
    <div className={`heritage-page-container ${dark ? 'dark-theme' : 'light-theme'}`}>
      {/* Load Fonts and Upgraded Ornate CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@200;300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=Cinzel:wght@500;700&display=swap');

        /* Theme Color Tokens */
        .heritage-page-container {
          --heritage-bg: #fdfaf4;
          --heritage-bg-rgb: 253, 250, 244;
          --heritage-text: #2b1b0c;
          --heritage-muted: #6e6255;
          --heritage-gold: #8b6f4c;
          --heritage-gold-rgb: 139, 111, 76;
          --heritage-gold-hover: #735a3c;
          --heritage-card-bg: rgba(255, 252, 245, 0.95);
          --heritage-card-border: rgba(139, 111, 76, 0.16);
          --heritage-header-bg: rgba(253, 250, 244, 0.85);
          --heritage-header-border: rgba(139, 111, 76, 0.08);
          --heritage-category-bg: #ffffff;
          --heritage-category-border: rgba(139, 111, 76, 0.15);
          --heritage-category-active: #8b6f4c;
          --heritage-category-active-text: #ffffff;
          --heritage-footer-bg: #faf6ee;
          --heritage-footer-border: rgba(139, 111, 76, 0.12);
        }

        .heritage-page-container.dark-theme {
          --heritage-bg: #120a05;
          --heritage-bg-rgb: 18, 10, 5;
          --heritage-text: #f2ebd9;
          --heritage-muted: #9a8f82;
          --heritage-gold: #c9a84c;
          --heritage-gold-rgb: 201, 168, 76;
          --heritage-gold-hover: #e8c46a;
          --heritage-card-bg: rgba(26, 16, 8, 0.92);
          --heritage-card-border: rgba(201, 168, 76, 0.16);
          --heritage-header-bg: rgba(18, 10, 5, 0.88);
          --heritage-header-border: rgba(201, 168, 76, 0.08);
          --heritage-category-bg: #1c1008;
          --heritage-category-border: rgba(201, 168, 76, 0.16);
          --heritage-category-active: #c9a84c;
          --heritage-category-active-text: #120a05;
          --heritage-footer-bg: #0d0703;
          --heritage-footer-border: rgba(201, 168, 76, 0.1);
        }

        /* Basic Styles with background image texture blending */
        .heritage-page-container {
          min-height: 100vh;
          background: 
            linear-gradient(rgba(var(--heritage-bg-rgb), 0.94), rgba(var(--heritage-bg-rgb), 0.94)),
            url(${heritageBg}) repeat;
          background-color: var(--heritage-bg);
          color: var(--heritage-text);
          font-family: 'Outfit', sans-serif;
          transition: background-color 0.4s ease, color 0.4s ease;
          overflow-x: hidden;
          position: relative;
        }

        .heritage-body-content {
          position: relative;
          z-index: 10;
        }

        /* Background Art / Grid Overlays */
        .heritage-bg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(var(--heritage-gold-rgb), 0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.8;
          z-index: 1;
        }

        .heritage-bg-glow {
          position: absolute;
          top: -200px;
          right: -200px;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(var(--heritage-gold-rgb), 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* Hero Section fixed to spread full bleed */
        /* Hero Section full bleed below navbar */
        .hero-section {
          position: relative;
          z-index: 10;
          min-height: 95vh;
          min-height: 95dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
          padding-top: 110px; /* Leave space for the floating navbar */
          padding-bottom: 60px;
          --hero-bg-shift: 90px;
        }

        .hero-bg {
          position: absolute;
          top: 0; /* Start backdrop container at the top of the viewport */
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 0;
          overflow: hidden;
        }

        .hero-bg-img {
          position: absolute;
          top: var(--hero-bg-shift);
          left: 0;
          width: 100%;
          height: calc(100% - var(--hero-bg-shift));
          object-fit: cover;
          display: block;
          object-position: center top; /* Align top of image with top of its shifted box */
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 50% 50%, rgba(var(--heritage-bg-rgb), 0.25) 0%, rgba(var(--heritage-bg-rgb), 0.1) 50%, rgba(var(--heritage-bg-rgb), 0) 85%),
            linear-gradient(
              360deg,
              var(--heritage-bg) 0%,
              rgba(var(--heritage-bg-rgb), 0.85) 15%,
              transparent 45%
            );
          pointer-events: none;
        }

        .dark-theme .hero-bg-overlay {
          background: 
            radial-gradient(circle at 50% 50%, rgba(var(--heritage-bg-rgb), 0.3) 0%, rgba(var(--heritage-bg-rgb), 0.15) 50%, rgba(var(--heritage-bg-rgb), 0) 85%),
            linear-gradient(
              360deg,
              var(--heritage-bg) 0%,
              rgba(var(--heritage-bg-rgb), 0.85) 15%,
              transparent 45%
            );
        }

        .hero-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 48px;
          box-sizing: border-box;
        }

        .hero-content {
          background: rgba(255, 252, 245, 0.4);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.14);
          border-radius: 28px;
          padding: 36px 40px;
          max-width: 480px; /* Constrain card to sit perfectly between Buddha and Lilavati */
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 
            0 16px 40px rgba(var(--heritage-gold-rgb), 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          box-sizing: border-box;
        }

        .dark-theme .hero-content {
          background: rgba(18, 10, 5, 0.5);
          border-color: rgba(201, 168, 76, 0.14);
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: var(--heritage-gold);
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5.2vw, 4rem);
          font-weight: 300;
          line-height: 1.15;
          margin: 0 0 18px;
          letter-spacing: -0.01em;
          color: var(--heritage-text);
          text-shadow: 0 2px 10px rgba(var(--heritage-gold-rgb), 0.12);
        }

        .dark-theme .hero-title {
          color: #FDF6E3;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .hero-title .italic-gold {
          color: var(--heritage-gold);
          font-style: italic;
          font-weight: 400;
        }

        .hero-subtext {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--heritage-muted);
          margin: 0 0 24px;
          font-weight: 300;
          max-width: 520px;
        }

        .dark-theme .hero-subtext {
          color: rgba(253, 246, 227, 0.85);
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .hero-hindi-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.35);
          background-color: rgba(var(--heritage-gold-rgb), 0.08);
          padding: 8px 20px;
          border-radius: 99px;
          font-size: 0.95rem;
          color: var(--heritage-gold-hover);
          font-style: italic;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
        }

        .dark-theme .hero-hindi-badge {
          background-color: rgba(18, 10, 4, 0.5);
          color: #ffe8a0;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-explore {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--heritage-gold), #b89048);
          color: #1a1208;
          border: 1px solid #ffe8a0;
          padding: 13px 28px;
          border-radius: 99px;
          font-family: 'Cinzel', serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(139, 111, 76, 0.3), inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .btn-explore:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 111, 76, 0.45);
          filter: brightness(1.1);
        }

        .btn-watch {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(var(--heritage-gold-rgb), 0.05);
          border: 1.5px solid var(--heritage-gold);
          color: var(--heritage-text);
          padding: 13px 26px;
          border-radius: 99px;
          font-family: 'Cinzel', serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.25s;
        }

        .dark-theme .btn-watch {
          background: rgba(255,255,255,0.08);
          color: #fcf6e8;
        }

        .btn-watch:hover {
          background-color: rgba(var(--heritage-gold-rgb), 0.25);
          border-color: var(--heritage-gold);
          transform: translateY(-2px);
        }

        .play-icon-wrap {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Categories Section */
        .categories-section {
          padding: 0 48px 40px;
          position: relative;
          z-index: 10;
        }

        .categories-bar {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--heritage-category-bg);
          border: 1px solid var(--heritage-category-border);
          border-radius: 99px;
          padding: 8px 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          transition: background-color 0.3s, border-color 0.3s;
        }

        .categories-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .categories-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 99px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--heritage-text);
          opacity: 0.7;
          transition: all 0.25s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .category-pill:hover {
          opacity: 1;
          background-color: rgba(var(--heritage-gold-rgb), 0.08);
        }

        .category-pill.active {
          opacity: 1;
          background-color: var(--heritage-category-active);
          color: var(--heritage-category-active-text);
          box-shadow: 0 4px 12px rgba(var(--heritage-gold-rgb), 0.25);
        }

        /* Generic Section Headers */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: var(--heritage-gold);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: var(--heritage-gold);
          font-size: 0.84rem;
          font-weight: 600;
          transition: color 0.2s;
          border-bottom: 1.5px solid transparent;
          padding-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .view-all-link:hover {
          color: var(--heritage-gold-hover);
          border-color: var(--heritage-gold-hover);
        }

        /* Minds Section and Slider */
        .minds-section {
          padding: 60px 48px;
          position: relative;
          z-index: 10;
        }

        .minds-header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          max-width: 1280px;
          margin: 0 auto 40px;
        }

        .slider-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .slider-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--heritage-card-border);
          background-color: var(--heritage-card-bg);
          color: var(--heritage-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .slider-btn:hover {
          background-color: var(--heritage-gold);
          color: var(--heritage-bg);
          border-color: var(--heritage-gold);
        }

        .slider-track-wrap {
          max-width: 1280px;
          margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 8px 0 24px;
        }

        .slider-track-wrap::-webkit-scrollbar {
          display: none;
        }

        .slider-track {
          display: flex;
          gap: 24px;
          min-width: min-content;
        }

        /* Scholar Card Upgraded to Arched Glass style */
        .scholar-card {
          width: 310px;
          background-color: var(--heritage-card-bg);
          border: 1px solid var(--heritage-card-border);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
        }

        .dark-theme .scholar-card {
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
        }

        .scholar-card::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px dashed rgba(var(--heritage-gold-rgb), 0.2);
          border-radius: 18px;
          pointer-events: none;
          z-index: 2;
        }

        .scholar-card:hover {
          transform: translateY(-6px);
          border-color: var(--heritage-gold);
          box-shadow: 0 16px 40px rgba(var(--heritage-gold-rgb), 0.15);
        }

        .card-bookmark {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.15);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          color: #ffe8a0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
        }

        .card-bookmark:hover {
          transform: scale(1.1);
          background: rgba(0,0,0,0.6);
        }

        .card-bookmark.saved {
          color: #d4607a;
          border-color: rgba(212, 96, 122, 0.3);
        }

        .card-image-wrap {
          width: calc(100% - 24px);
          height: 280px;
          margin: 12px 12px 0;
          overflow: hidden;
          position: relative;
          border-radius: 16px 16px 4px 4px;
          clip-path: ellipse(90% 100% at 50% 100%);
          border: 1.5px solid rgba(var(--heritage-gold-rgb), 0.3);
          background-color: rgba(var(--heritage-gold-rgb), 0.05);
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scholar-card:hover .card-image-wrap img {
          transform: scale(1.04);
        }

        .card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(var(--heritage-gold-rgb), 0.12) 100%);
        }

        .card-info {
          padding: 20px 24px 24px;
          position: relative;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .scholar-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          margin: 0 0 2px;
          color: var(--heritage-text);
        }

        .scholar-period {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--heritage-gold);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .scholar-desc-text {
          font-family: 'Lora', serif;
          font-size: 0.8rem;
          line-height: 1.55;
          opacity: 0.78;
          margin: 0 0 16px;
        }

        .card-circle-arrow {
          position: absolute;
          bottom: 24px;
          right: 24px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.4);
          background: none;
          color: var(--heritage-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
        }

        .scholar-card:hover .card-circle-arrow {
          background: var(--heritage-gold);
          color: var(--heritage-bg);
          border-color: var(--heritage-gold);
          transform: translateX(2px);
        }

        /* Ideas section responsive layout */
        .ideas-section {
          padding: 60px 48px;
          position: relative;
          z-index: 10;
        }

        .ideas-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.32fr 0.68fr;
          gap: 40px;
        }

        .ideas-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .ideas-left-desc {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          line-height: 1.65;
          opacity: 0.8;
          margin-bottom: 28px;
        }

        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        /* Upgraded Idea Card - Sandstone Tablet look */
        .idea-grid-card, .curiosity-grid-card {
          padding: 28px 24px;
          border-radius: 20px;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          height: 100%;
          position: relative;
          background: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E"),
            linear-gradient(155deg, #f7ebd3 0%, #edd89a 100%);
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.35);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .dark-theme .idea-grid-card, .dark-theme .curiosity-grid-card {
          background: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E"),
            linear-gradient(155deg, #1d140a 0%, #120b04 100%);
          border-color: rgba(var(--heritage-gold-rgb), 0.22);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .idea-grid-card:hover, .curiosity-grid-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 35px rgba(var(--heritage-gold-rgb), 0.15);
          border-color: var(--heritage-gold);
        }
        .dark-theme .idea-grid-card:hover, .dark-theme .curiosity-grid-card:hover {
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.55);
        }

        .idea-icon-wrap {
          color: var(--heritage-gold);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--heritage-gold-rgb), 0.08);
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.15);
          z-index: 2;
        }

        .idea-sanskrit {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 2px;
          color: var(--heritage-text);
          z-index: 2;
        }

        .idea-sanskrit-sub {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          font-weight: 700;
          opacity: 0.7;
          letter-spacing: 1px;
          margin-bottom: 12px;
          color: var(--heritage-gold);
          text-transform: uppercase;
          z-index: 2;
        }

        .idea-description {
          font-family: 'Lora', serif;
          font-size: 0.8rem;
          line-height: 1.55;
          opacity: 0.8;
          margin: 0;
          z-index: 2;
        }

        .idea-card-arrow {
          position: absolute;
          bottom: 24px;
          right: 24px;
          color: var(--heritage-gold);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.25s;
          z-index: 2;
        }

        .idea-grid-card:hover .idea-card-arrow {
          opacity: 0.85;
          transform: translateX(0);
        }

        /* Late Night Curiosity Section layout */
        .curiosity-section {
          padding: 60px 48px 120px;
          position: relative;
          z-index: 10;
        }

        .curiosity-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Header row — eyebrow + title on left, button on right, same as ideas-section */
        .curiosity-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .curiosity-header-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .curiosity-left-desc {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          line-height: 1.65;
          opacity: 0.8;
          margin-bottom: 0;
          max-width: 560px;
        }

        .curiosity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        /* Curiosity card title inside the accordion cards */
        .curiosity-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          line-height: 1.45;
          margin: 0 0 auto;
          color: var(--heritage-text);
          font-style: italic;
          z-index: 2;
          flex: 1;
        }

        /* Tag line beneath the title */
        .curiosity-card-tag {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--heritage-gold);
          opacity: 0.85;
          margin-bottom: 10px;
          z-index: 2;
        }

        .curiosity-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          z-index: 2;
        }

        .curiosity-card-read {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--heritage-gold);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .curiosity-grid-card:hover .curiosity-card-read {
          opacity: 1;
        }

        .curiosity-card-btn {
          background: rgba(var(--heritage-gold-rgb), 0.1);
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.2);
          color: var(--heritage-gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          transition: all 0.25s;
          z-index: 2;
          flex-shrink: 0;
        }

        .curiosity-grid-card:hover .curiosity-card-btn {
          background-color: var(--heritage-gold);
          color: var(--heritage-bg);
          border-color: var(--heritage-gold);
          transform: translateX(3px);
        }

        /* Collapsible Curiosity Groups */
        .curiosity-groups {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .curiosity-group {
          border-radius: 18px;
          border: 1px solid var(--heritage-card-border);
          background: var(--heritage-card-bg);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .curiosity-group:hover {
          border-color: rgba(var(--heritage-gold-rgb), 0.35);
          box-shadow: 0 4px 20px rgba(var(--heritage-gold-rgb), 0.08);
        }

        .curiosity-group-header {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 18px 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--heritage-text);
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: left;
          transition: background 0.2s;
        }

        .curiosity-group-header:hover {
          background: rgba(var(--heritage-gold-rgb), 0.05);
        }

        .curiosity-group-emoji {
          font-size: 1.2rem;
          line-height: 1;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--heritage-gold-rgb), 0.08);
          border-radius: 8px;
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.15);
        }

        .curiosity-group-label {
          flex: 1;
          font-size: 0.92rem;
        }

        .curiosity-group-count {
          font-size: 0.68rem;
          font-weight: 600;
          opacity: 0.5;
          white-space: nowrap;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.5px;
          margin-right: 6px;
          background: rgba(var(--heritage-gold-rgb), 0.08);
          padding: 2px 8px;
          border-radius: 99px;
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.12);
        }

        .curiosity-group-arrow {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          color: var(--heritage-gold);
          flex-shrink: 0;
          background: rgba(var(--heritage-gold-rgb), 0.06);
        }

        .curiosity-group-arrow.open {
          transform: rotate(90deg);
        }

        .curiosity-group-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
          opacity: 0;
          overflow: hidden;
        }
        .curiosity-group-content.open {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        .curiosity-group-content-inner {
          min-height: 0;
        }

        .curiosity-group-desc {
          font-family: 'Lora', serif;
          font-size: 0.8rem;
          line-height: 1.6;
          opacity: 0.65;
          padding: 0 20px 14px;
          margin: 0;
          border-bottom: 1px solid rgba(var(--heritage-gold-rgb), 0.08);
          margin-bottom: 4px;
        }

        .curiosity-group-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
          padding: 14px 16px 16px;
        }

        /* Override curiosity-grid-card inside accordion to be smaller/tighter */
        .curiosity-group-grid .curiosity-grid-card {
          padding: 20px 18px;
          border-radius: 14px;
          min-height: 140px;
          display: flex;
          flex-direction: column;
        }

        .curiosity-media-footer {
          margin-top: 12px;
        }

        /* Press Play Media Card */
        .curiosity-grid-card.media-card {
          background: linear-gradient(135deg, rgba(var(--heritage-gold-rgb), 0.12) 0%, rgba(var(--heritage-gold-rgb), 0.04) 100%);
          border-color: rgba(var(--heritage-gold-rgb), 0.3);
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          justify-content: flex-start;
          padding: 24px;
        }

        .media-card:hover {
          border-color: var(--heritage-gold);
        }

        .play-btn-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--heritage-gold), #b89048);
          color: #1a1208;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid #ffe8a0;
          box-shadow: 0 4px 12px rgba(var(--heritage-gold-rgb), 0.3);
          flex-shrink: 0;
        }

        .play-btn-circle:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 16px rgba(var(--heritage-gold-rgb), 0.45);
        }

        .media-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .media-title {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--heritage-gold);
        }

        .media-subtitle {
          font-family: 'Lora', serif;
          font-size: 0.88rem;
          font-style: italic;
          opacity: 0.8;
          line-height: 1.35;
          margin: 0;
        }

        /* Sound wave animation */
        .sound-wave-container {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 12px;
          margin-top: 6px;
        }

        .sound-wave-bar {
          width: 2px;
          background-color: var(--heritage-gold);
          border-radius: 1px;
          animation: wave 1.2s ease-in-out infinite alternate;
        }

        .sound-wave-bar:nth-child(2) { animation-delay: 0.15s; }
        .sound-wave-bar:nth-child(3) { animation-delay: 0.3s; }
        .sound-wave-bar:nth-child(4) { animation-delay: 0.45s; }
        .sound-wave-bar:nth-child(5) { animation-delay: 0.6s; }

        @keyframes wave {
          0% { height: 3px; }
          100% { height: 12px; }
        }

        /* Story Modal Overlay & Tactile Manuscript Box */
        .story-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background-color: rgba(6, 4, 2, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .story-modal-box {
          max-width: 620px;
          width: 100%;
          max-height: 85vh;
          background: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E"),
            linear-gradient(to right, #ebd7b3 0%, #f7ebd3 8%, #fbf5e6 50%, #f7ebd3 92%, #e5cfaa 100%);
          border: 3px double #8a5a2b;
          border-radius: 12px;
          box-shadow: 
            0 25px 60px rgba(0, 0, 0, 0.55),
            inset 0 0 40px rgba(139, 94, 30, 0.18);
          display: flex;
          flex-direction: column;
          color: #3d2e1a;
          font-family: 'Lora', serif;
          position: relative;
          animation: modalAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .story-modal-header {
          padding: 24px 36px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1.5px solid rgba(139, 94, 30, 0.14);
        }

        .story-modal-tag {
          font-family: 'Cinzel', serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8a5a2b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-modal-close {
          background: rgba(139, 94, 30, 0.08);
          border: 1px solid rgba(139, 94, 30, 0.18);
          color: #573512;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-close:hover {
          background-color: #8a5a2b;
          color: #f7ebd3;
          transform: scale(1.05);
        }

        .story-modal-body {
          padding: 36px 40px;
          overflow-y: auto;
          background-image: linear-gradient(rgba(139, 94, 30, 0.075) 1px, transparent 1px);
          background-size: 100% 28px;
          line-height: 28px;
        }

        .story-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.85rem;
          line-height: 1.35;
          font-weight: 600;
          margin: 0 0 20px;
          color: #573512;
          font-style: italic;
        }

        .story-modal-paragraph {
          font-size: 0.95rem;
          line-height: 28px;
          color: #3d2e1a;
          margin: 0 0 28px;
          text-indent: 15px;
        }

        .story-modal-paragraph:last-child {
          margin-bottom: 0;
        }

        .story-modal-footer {
          padding: 16px 36px 24px;
          font-size: 0.72rem;
          color: rgba(87, 53, 18, 0.75);
          border-top: 1.5px solid rgba(139, 94, 30, 0.1);
          font-style: italic;
          display: flex;
          justify-content: space-between;
        }

        /* Responsiveness Styling */
        @media (max-width: 1024px) {
          .hero-container {
            text-align: center;
          }
          .hero-content {
            align-items: center;
          }
          .ideas-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .ideas-left {
            align-items: center;
            text-align: center;
          }
          .curiosity-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            margin-top: 60px; /* Offset for smaller floating navbar on mobile */
            padding: 40px 0;
            min-height: 70vh;
            min-height: 70dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            --hero-bg-shift: 0px;
          }
          .hero-container {
            padding: 0 20px;
          }
          .hero-content {
            padding: 32px 24px;
            border-radius: 20px;
          }
          .categories-section {
            padding: 0 24px 30px;
          }
          .minds-section {
            padding: 40px 24px;
          }
          .ideas-section {
            padding: 40px 24px;
          }
          .ideas-grid {
            grid-template-columns: 1fr;
          }
          .curiosity-section {
            padding: 40px 24px 80px;
          }
          .curiosity-group-grid {
            grid-template-columns: 1fr;
          }
          .categories-bar {
            border-radius: 20px;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }
        }

        /* Ornate details & buttons */
        .btn-ideas-more {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--heritage-gold) 0%, rgba(var(--heritage-gold-rgb), 0.7) 100%);
          color: var(--heritage-bg);
          border: 2px double var(--heritage-gold-hover);
          padding: 10px 22px;
          border-radius: 99px;
          font-family: 'Cinzel', serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(var(--heritage-gold-rgb), 0.15);
        }
        .btn-ideas-more:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(var(--heritage-gold-rgb), 0.3);
          filter: brightness(1.1);
        }

        /* Manuscript scroll styling */
        .scroll-top-roller {
          height: 18px;
          background: linear-gradient(90deg, #3d220a 0%, #6e421c 25%, #8c582f 50%, #6e421c 75%, #3d220a 100%);
          border-radius: 6px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          margin: -24px -36px 16px;
          position: relative;
          z-index: 15;
          border: 1px solid #221204;
        }
        .scroll-top-roller::before, .scroll-top-roller::after {
          content: '';
          position: absolute;
          top: -3px;
          width: 10px;
          height: 24px;
          background: linear-gradient(to bottom, #d4a72a, #8b6e22, #d4a72a);
          border: 1px solid #5c4511;
          border-radius: 2px;
        }
        .scroll-top-roller::before { left: -10px; }
        .scroll-top-roller::after { right: -10px; }

        .scroll-bottom-roller {
          height: 18px;
          background: linear-gradient(90deg, #3d220a 0%, #6e421c 25%, #8c582f 50%, #6e421c 75%, #3d220a 100%);
          border-radius: 6px;
          box-shadow: 0 -4px 8px rgba(0,0,0,0.3);
          margin: 16px -36px -24px;
          position: relative;
          z-index: 15;
          border: 1px solid #221204;
        }
        .scroll-bottom-roller::before, .scroll-bottom-roller::after {
          content: '';
          position: absolute;
          top: -3px;
          width: 10px;
          height: 24px;
          background: linear-gradient(to bottom, #d4a72a, #8b6e22, #d4a72a);
          border: 1px solid #5c4511;
          border-radius: 2px;
        }
        .scroll-bottom-roller::before { left: -10px; }
        .scroll-bottom-roller::after { right: -10px; }

        .story-modal-body {
          padding: 36px 48px;
          overflow-y: auto;
          background: 
            linear-gradient(rgba(139, 94, 30, 0.075) 1px, transparent 1px) 0 0 / 100% 28px,
            linear-gradient(90deg, transparent 40px, #a33b3b 40px, #a33b3b 41px, transparent 42px, transparent calc(100% - 42px), #a33b3b calc(100% - 42px), #a33b3b calc(100% - 41px), transparent calc(100% - 40px));
          line-height: 28px;
          position: relative;
        }

        .story-drop-cap {
          float: left;
          font-family: 'Cinzel', serif;
          font-size: 3.2rem;
          font-weight: 700;
          line-height: 0.85;
          color: #a33b3b;
          margin-right: 12px;
          margin-top: 4px;
          padding: 6px 10px;
          border: 1px double #8a5a2b;
          background: rgba(139, 94, 30, 0.08);
          border-radius: 4px;
          box-shadow: inset 0 0 8px rgba(139, 94, 30, 0.15);
        }

        /* Scholars Grid Modal Overlay */
        .scholars-grid-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: rgba(12, 7, 3, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .scholars-grid-container {
          max-width: 1100px;
          width: 100%;
          max-height: 90vh;
          background-color: var(--heritage-bg);
          border: 1px solid var(--heritage-card-border);
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .scholars-grid-header {
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--heritage-card-border);
          background-color: rgba(var(--heritage-gold-rgb), 0.03);
        }

        .scholars-grid-title {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem;
          color: var(--heritage-gold);
          margin: 0;
          letter-spacing: 1px;
        }

        .scholars-grid-close {
          background: rgba(var(--heritage-gold-rgb), 0.08);
          border: 1px solid var(--heritage-card-border);
          color: var(--heritage-text);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scholars-grid-close:hover {
          background-color: var(--heritage-gold);
          color: var(--heritage-bg);
          transform: scale(1.05);
        }

        .scholars-grid-body {
          padding: 40px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
          justify-items: center;
        }
      `}</style>

      {/* Grid and Glow Overlays */}
      <div className="heritage-bg-grid" />
      <div className="heritage-bg-glow" />

      {/* ─── HERO SECTION (Spread and Full-Bleed) ─── */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src={dark ? heroDark : heroLight} alt="Indian Heritage Backdrop" className="hero-bg-img" />
          <div className="hero-bg-overlay" />
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span>OUR HERITAGE</span>
              <span className="badge-star">✦</span>
            </div>
            <h1 className="hero-title">
              minds that<br />
              <span className="italic-gold">never really left.</span>
            </h1>
            <p className="hero-subtext">
              They were not gods. They were humans —<br />
              curious, restless, brilliant. Their questions still echo in everything we build today.
            </p>
            <div className="hero-hindi-badge">
              <span>जिज्ञासा ही ज्ञान का पहला द्वार है।</span>
              <span className="badge-star">✦</span>
            </div>
            <div className="hero-actions">
              <button className="btn-explore" onClick={() => document.getElementById('scholars')?.scrollIntoView({ behavior: 'smooth' })}>
                explore our heritage <ArrowRight size={14} className="arrow-icon" />
              </button>
              <button className="btn-watch" onClick={handleWatchIntro}>
                <span className="play-icon-wrap"><Play size={10} fill="currentColor" /></span>
                <span>watch intro</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARCHMENT BODY CONTENT WRAPPER ─── */}
      <div className="heritage-body-content">
        {/* ─── CATEGORY SECTION ─── */}
        <section className="categories-section">
          <div className="categories-bar">
            <div className="categories-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MINDS THAT SHAPED TIME ─── */}
        <section id="scholars" className="minds-section">
          <div className="minds-header-wrap">
            <div className="section-title-wrap">
              <span className="section-eyebrow">minds that shaped time <Sparkles size={11} /></span>
              <h2 className="section-title">The Great Scholars</h2>
            </div>
            <div className="slider-controls">
              <a href="#" className="view-all-link" onClick={handleViewAllScholars}>
                view all <ArrowUpRight size={13} />
              </a>
              <button className="slider-btn prev-btn" onClick={() => scrollSlider('left')} aria-label="Scroll left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className="slider-btn next-btn" onClick={() => scrollSlider('right')} aria-label="Scroll right">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div className="slider-track-wrap" ref={scrollRef}>
            <div className="slider-track">
              <AnimatePresence mode="popLayout">
                {filteredScholars.map((scholar) => (
                  <motion.div
                    key={scholar.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="scholar-card"
                    onClick={() => setModalData({
                      title: scholar.story.title,
                      source: scholar.story.source,
                      paragraphs: scholar.story.paragraphs,
                      tag: `${scholar.name} manuscript`
                    })}
                  >
                    <button
                      className={`card-bookmark ${savedScholars.includes(scholar.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSave(scholar.id, e)}
                      aria-label="Save scholar"
                    >
                      <Heart size={15} fill={savedScholars.includes(scholar.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="card-image-wrap">
                      <img src={scholar.img} alt={`Portrait of ${scholar.name}`} />
                      <div className="card-gradient-overlay" />
                    </div>
                    <div className="card-info">
                      <h3 className="scholar-name">{scholar.name}</h3>
                      <span className="scholar-period">{scholar.period}</span>
                      <p className="scholar-desc-text">{scholar.title}</p>
                      <button className="card-circle-arrow" aria-label="Read more">
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ─── IDEAS THAT CHANGED EVERYTHING ─── */}
        <section className="ideas-section">
          <div className="ideas-container">
            <div className="ideas-left">
              <span className="section-eyebrow">first. by centuries. <span style={{fontSize: '11px'}}>∞</span></span>
              <h2 className="section-title" style={{marginBottom: '20px'}}>Things the Rest of the World Discovered Later</h2>
              <p className="ideas-left-desc">Binary code. Chess. The decimal system. Pure zinc. A university with 10,000 students — 1,500 years ago. These aren't the stories you already know. Click. Let your jaw drop.</p>
              <button className="btn-ideas-more" onClick={() => document.getElementById('curiosity')?.scrollIntoView({ behavior: 'smooth' })}>
                explore more <ArrowRight size={13} />
              </button>
            </div>
            
            <div className="ideas-grid">
              {/* Card 1: Binary (Pingala) */}
              <div 
                className="idea-grid-card fs-sandstone-tablet fs-gold-corner-card" 
                style={{position: 'relative'}}
                onClick={() => setModalData({
                  title: CONCEPT_STORIES[0].title,
                  source: CONCEPT_STORIES[0].source,
                  paragraphs: CONCEPT_STORIES[0].paragraphs,
                  tag: CONCEPT_STORIES[0].tag
                })}
              >
                <OrnateCorners dark={dark} />
                <div className="idea-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="6" width="6" height="12" rx="1" />
                    <rect x="14" y="6" width="6" height="12" rx="1" />
                    <text x="5" y="15" fontSize="8" fontWeight="bold" fill="currentColor">0</text>
                    <text x="15" y="15" fontSize="8" fontWeight="bold" fill="currentColor">1</text>
                  </svg>
                </div>
                <h3 className="idea-sanskrit">द्वि-आधारी</h3>
                <span className="idea-sanskrit-sub">pingala's binary code</span>
                <p className="idea-description">2,000 years before computers, a poet mapped Sanskrit rhythms with 0s and 1s. Binary wasn't born in a lab — it was born in verse.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 2: Chess (Chaturanga) */}
              <div 
                className="idea-grid-card fs-sandstone-tablet fs-gold-corner-card" 
                style={{position: 'relative'}}
                onClick={() => setModalData({
                  title: CONCEPT_STORIES[1].title,
                  source: CONCEPT_STORIES[1].source,
                  paragraphs: CONCEPT_STORIES[1].paragraphs,
                  tag: CONCEPT_STORIES[1].tag
                })}
              >
                <OrnateCorners dark={dark} />
                <div className="idea-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                    <line x1="6" y1="10" x2="18" y2="10" />
                    <line x1="6" y1="14" x2="18" y2="14" />
                    <line x1="10" y1="6" x2="10" y2="18" />
                    <line x1="14" y1="6" x2="14" y2="18" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">चतुरङ्ग</h3>
                <span className="idea-sanskrit-sub">the birth of chess</span>
                <p className="idea-description">1,500 years ago, a battlefield simulation became the world's greatest strategy game. Every chess match begins in ancient India.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 3: Nalanda University */}
              <div 
                className="idea-grid-card fs-sandstone-tablet fs-gold-corner-card" 
                style={{position: 'relative'}}
                onClick={() => setModalData({
                  title: CONCEPT_STORIES[2].title,
                  source: CONCEPT_STORIES[2].source,
                  paragraphs: CONCEPT_STORIES[2].paragraphs,
                  tag: CONCEPT_STORIES[2].tag
                })}
              >
                <OrnateCorners dark={dark} />
                <div className="idea-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="5" y="8" width="14" height="12" rx="2" />
                    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">नालन्दा</h3>
                <span className="idea-sanskrit-sub">the first great university</span>
                <p className="idea-description">10,000 students from across Asia. 2,000 teachers. 9 stories of manuscripts. Oxford is 800 years old. Nalanda was 1,600.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 4: Zinc */}
              <div 
                className="idea-grid-card fs-sandstone-tablet fs-gold-corner-card" 
                style={{position: 'relative'}}
                onClick={() => setModalData({
                  title: CONCEPT_STORIES[3].title,
                  source: CONCEPT_STORIES[3].source,
                  paragraphs: CONCEPT_STORIES[3].paragraphs,
                  tag: CONCEPT_STORIES[3].tag
                })}
              >
                <OrnateCorners dark={dark} />
                <div className="idea-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 20L10 8h8l4 12" />
                    <path d="M8 16h8" />
                    <circle cx="14" cy="5" r="2" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">यशद</h3>
                <span className="idea-sanskrit-sub">pure zinc distillation</span>
                <p className="idea-description">India was producing pure zinc 500 years before Europe cracked it. The process was so advanced it became a lost art — then rediscovered.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 5: Decimal System */}
              <div 
                className="idea-grid-card fs-sandstone-tablet fs-gold-corner-card" 
                style={{position: 'relative'}}
                onClick={() => setModalData({
                  title: CONCEPT_STORIES[4].title,
                  source: CONCEPT_STORIES[4].source,
                  paragraphs: CONCEPT_STORIES[4].paragraphs,
                  tag: CONCEPT_STORIES[4].tag
                })}
              >
                <OrnateCorners dark={dark} />
                <div className="idea-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <text x="5" y="16" fontSize="12" fontWeight="bold" fill="currentColor">1</text>
                    <text x="11" y="16" fontSize="12" fontWeight="bold" fill="currentColor">0</text>
                    <text x="9" y="8" fontSize="8" fill="currentColor" opacity="0.6">1</text>
                    <text x="9" y="20" fontSize="8" fill="currentColor" opacity="0.6">0</text>
                  </svg>
                </div>
                <h3 className="idea-sanskrit">दशमलव</h3>
                <span className="idea-sanskrit-sub">the decimal system</span>
                <p className="idea-description">The way you write numbers — ones, tens, hundreds — was an Indian breakthrough. Before this, multiplication needed specialists. Now you just move a dot.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 6: Cosmic Numbers */}
              <div 
                className="idea-grid-card fs-sandstone-tablet fs-gold-corner-card" 
                style={{position: 'relative'}}
                onClick={() => setModalData({
                  title: CONCEPT_STORIES[5].title,
                  source: CONCEPT_STORIES[5].source,
                  paragraphs: CONCEPT_STORIES[5].paragraphs,
                  tag: CONCEPT_STORIES[5].tag
                })}
              >
                <OrnateCorners dark={dark} />
                <div className="idea-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" opacity="0.3" />
                    <path d="M12 2c3 3 3 9 3 12s0 9-3 12" />
                    <path d="M12 2c-3 3-3 9-3 12s0 9 3 12" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">असङ्ख्य</h3>
                <span className="idea-sanskrit-sub">naming the countless</span>
                <p className="idea-description">Ancient Indians named numbers up to 10^53 — a 1 with 53 zeros. They measured time in billions of years when everyone else counted in thousands.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── LATE NIGHT CURIOSITY SECTION ─── */}
        <section id="curiosity" className="curiosity-section">
          <div className="curiosity-container">

            {/* Section header — full width, matching ideas-section style */}
            <div className="curiosity-header-row">
              <div className="curiosity-header-left">
                <span className="section-eyebrow">sit with this. 🌙</span>
                <h2 className="section-title" style={{marginBottom: '12px'}}>Things That Don't Feel Real</h2>
                <p className="curiosity-left-desc">Not history. Not facts. Just quiet mind-bending moments from a past that feels impossibly ahead of itself. Click any story to sit with it.</p>
              </div>
              <button className="btn-ideas-more" style={{flexShrink: 0}} onClick={() => setModalData({
                title: CURIOSITY_STORIES[0].title,
                source: CURIOSITY_STORIES[0].source,
                paragraphs: CURIOSITY_STORIES[0].paragraphs,
                tag: CURIOSITY_STORIES[0].tag
              })}>read a story <ArrowRight size={13} /></button>
            </div>

            {/* Accordion groups — full width */}
            <div className="curiosity-groups">
              {CURIOSITY_GROUPS.map(group => {
                const isOpen = expandedGroups.includes(group.id)
                const stories = CURIOSITY_STORIES.filter(s => s.group === group.id)
                return (
                  <div key={group.id} className="curiosity-group">
                    <button className="curiosity-group-header" onClick={() => toggleGroup(group.id)}>
                      <span className="curiosity-group-emoji">{group.emoji}</span>
                      <span className="curiosity-group-label">{group.label}</span>
                      <span className="curiosity-group-count">{stories.length} {stories.length === 1 ? 'story' : 'stories'}</span>
                      <span className={`curiosity-group-arrow ${isOpen ? 'open' : ''}`}>
                        <ChevronRight size={14} />
                      </span>
                    </button>
                    <div className={`curiosity-group-content ${isOpen ? 'open' : ''}`}>
                      <div className="curiosity-group-content-inner">
                        <p className="curiosity-group-desc">{group.desc}</p>
                        <div className="curiosity-group-grid">
                          {stories.map((story, i) => (
                            <div
                              key={i}
                              className="curiosity-grid-card fs-gold-corner-card fs-sandstone-tablet"
                              onClick={() => setModalData({
                                title: story.title,
                                source: story.source,
                                paragraphs: story.paragraphs,
                                tag: story.tag
                              })}
                            >
                              <span className="curiosity-card-tag">{story.tag}</span>
                              <h3 className="curiosity-card-title">{story.title}</h3>
                              <div className="curiosity-card-footer">
                                <span className="curiosity-card-read">read story</span>
                                <button className="curiosity-card-btn" aria-label="Read story">
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Reading Aid Meditative BGM Card */}
              <div className="curiosity-grid-card media-card fs-gold-corner-card fs-sandstone-tablet curiosity-media-footer">
                <button className="play-btn-circle" onClick={togglePlaySound} aria-label={isPlayingSound ? "Pause sound" : "Play sound"}>
                  {isPlayingSound ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{transform: 'translateX(2px)'}} />}
                </button>
                <div className="media-text-wrap">
                  <span className="media-title">Contemplation Reading Aid BGM</span>
                  <h3 className="media-subtitle">{isPlayingSound ? "Playing Sitar & Tanpura..." : "play ambient sitar for focused reading"}</h3>
                  {isPlayingSound && (
                    <div className="sound-wave-container">
                      <div className="sound-wave-bar" />
                      <div className="sound-wave-bar" />
                      <div className="sound-wave-bar" />
                      <div className="sound-wave-bar" />
                      <div className="sound-wave-bar" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ImmersiveFooter />
      </div>

      {/* ─── INTRO SANCTUARY MODAL ─── */}
      <AnimatePresence>
        {introOpen && (
          <div className="story-modal-overlay" onClick={handleCloseIntro}>
            <div className="story-modal-box" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
              <div className="story-modal-header">
                <div className="story-modal-tag">
                  <Sparkles size={14} />
                  <span>Sanctuary Intro</span>
                </div>
                <button className="btn-modal-close" onClick={handleCloseIntro} aria-label="Close modal">
                  <X size={16} />
                </button>
              </div>
              <div className="story-modal-body" style={{ textAlign: 'center', background: 'none' }}>
                <span className="text-3xl mb-4 block">🕉️</span>
                <h3 className="story-modal-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', color: '#573512' }}>
                  Flowstate Heritage Sanctuary
                </h3>
                <p className="story-modal-paragraph font-serif italic text-base leading-relaxed" style={{ textIndent: 0 }}>
                  "जिज्ञासा ही ज्ञान का पहला द्वार है।"
                </p>
                <p className="story-modal-paragraph text-sm opacity-85 leading-relaxed" style={{ textIndent: 0 }}>
                  This is not a history lesson. It is a meeting — with minds who lived centuries before us, but whose questions still shape our world. Step quietly. Think deeply.
                </p>
                <p className="story-modal-paragraph text-sm opacity-85 leading-relaxed" style={{ textIndent: 0 }}>
                  Tibetan singing bowl tones are active, creating space for quiet reflection as you journey through time.
                </p>
                <button
                  onClick={handleCloseIntro}
                  className="btn-explore mt-4"
                  style={{ display: 'inline-flex' }}
                >
                  Enter Sanctuary
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SCHOLARS VIEW ALL GRID MODAL ─── */}
      <AnimatePresence>
        {showAllGrid && (
          <div className="scholars-grid-overlay" onClick={() => setShowAllGrid(false)}>
            <div className="scholars-grid-container" onClick={(e) => e.stopPropagation()}>
              <div className="scholars-grid-header">
                <h2 className="scholars-grid-title">All Minds, One Conversation</h2>
                <button className="scholars-grid-close" onClick={() => setShowAllGrid(false)} aria-label="Close grid modal">
                  <X size={18} />
                </button>
              </div>
              <div className="scholars-grid-body">
                {SCHOLARS.map((scholar) => (
                  <div
                    key={scholar.id}
                    className="scholar-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setModalData({
                        title: scholar.story.title,
                        source: scholar.story.source,
                        paragraphs: scholar.story.paragraphs,
                        tag: `${scholar.name} manuscript`
                      })
                      setShowAllGrid(false)
                    }}
                  >
                    <button
                      className={`card-bookmark ${savedScholars.includes(scholar.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSave(scholar.id, e)}
                      aria-label="Save scholar"
                    >
                      <Heart size={15} fill={savedScholars.includes(scholar.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="card-image-wrap">
                      <img src={scholar.img} alt={`Portrait of ${scholar.name}`} />
                      <div className="card-gradient-overlay" />
                    </div>
                    <div className="card-info">
                      <h3 className="scholar-name">{scholar.name}</h3>
                      <span className="scholar-period">{scholar.period}</span>
                      <p className="scholar-desc-text">{scholar.title}</p>
                      <button className="card-circle-arrow" aria-label="Read more">
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── STORY MODAL (Manuscript Lined Parchment Style) ─── */}
      <AnimatePresence>
        {modalData && (
          <div className="story-modal-overlay" onClick={() => setModalData(null)}>
            <div className="story-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="scroll-top-roller" />
              <div className="story-modal-header">
                <div className="story-modal-tag">
                  <BookOpen size={14} />
                  <span>{modalData.tag || 'ancient manuscript'}</span>
                </div>
                <button className="btn-modal-close" onClick={() => setModalData(null)} aria-label="Close modal">
                  <X size={16} />
                </button>
              </div>

              <div className="story-modal-body">
                {/* Small Sanskrit design decoration */}
                <div className="text-center opacity-40 text-xs mb-3 font-serif">ॐ · ✦ · ॐ</div>
                <h2 className="story-modal-title">
                  {modalData.title}
                </h2>
                <div style={{ width: '60px', height: '1px', backgroundColor: '#8a5a2b', margin: '0 auto 28px' }} />
                {modalData.paragraphs.map((p, i) => (
                  <p key={i} className="story-modal-paragraph">
                    {i === 0 ? (
                      <span className="story-drop-cap">
                        {p.charAt(0)}
                      </span>
                    ) : null}
                    {i === 0 ? p.slice(1) : p}
                  </p>
                ))}
              </div>

              <div className="story-modal-footer">
                <span>Source: {modalData.source}</span>
                <span className="opacity-60">Flowstate Archive</span>
              </div>
              <div className="scroll-bottom-roller" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Heritage

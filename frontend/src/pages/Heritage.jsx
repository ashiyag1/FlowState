import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import {
  ChevronRight, ArrowUpRight, Sparkles,
  Heart, X, BookOpen, Bookmark, ArrowRight, Play, Pause
} from 'lucide-react'

// Image imports
import heroDark from '../assets/heritage/heritage_hero_dark.png'
import heroLight from '../assets/heritage/heritage_hero_light.png'
import heritageBg from '../assets/heritage/heritage_bg.jpg'
import aryabhataPortrait from '../assets/heritage/aryabhata_portrait.png'
import bhaskaraPortrait from '../assets/heritage/bhaskara_portrait.png'
import lilavatiPortrait from '../assets/heritage/lilavati_portrait.png'
import charakaPortrait from '../assets/heritage/charaka_portrait.png'
import paniniPortrait from '../assets/heritage/panini_portrait.png'
import sushrutaPortrait from '../assets/heritage/sushruta_portrait.png'
import brahmaguptaPortrait from '../assets/heritage/brahmagupta_portrait.png'
import madhavaPortrait from '../assets/heritage/madhava_portrait.png'
import chanakyaPortrait from '../assets/heritage/chanakya_portrait.png'
import patanjaliPortrait from '../assets/heritage/patanjali_portrait.png'
import kanadaPortrait from '../assets/heritage/kanada_portrait.png'
import gargiPortrait from '../assets/heritage/gargi_portrait.png'
import khanaPortrait from '../assets/heritage/khana_portrait.png'

function FlowSymbol({ size = 32, dark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="flow-symbol-svg">
      <path d="M16 1 L31 16 L16 31 L1 16 Z" stroke="url(#sg-heritage)" strokeWidth="0.9" fill="none"/>
      <path d="M16 4.5 L27.5 16 L16 27.5 L4.5 16 Z" stroke="url(#sg-heritage)" strokeWidth="0.55" fill="none" opacity="0.45"/>
      {[0,45,90,135,180,225,270,315].map(d => (
        <ellipse key={d} cx="16" cy="9.5" rx="1.6" ry="5.2"
          fill="url(#sg-heritage)" opacity="0.55" transform={`rotate(${d} 16 16)`}/>
      ))}
      <circle cx="16" cy="16" r="5.5" stroke="url(#sg-heritage)" strokeWidth="0.55" fill="none" opacity="0.5"/>
      <circle cx="16" cy="16" r="2.2" fill="url(#sg-heritage)" opacity="0.95"/>
      <circle cx="16" cy="16" r="0.9" fill="white" opacity="0.9"/>
      {[['16','1'],['31','16'],['16','31'],['1','16']].map(([cx,cy]) => (
        <circle key={cx+cy} cx={cx} cy={cy} r="0.9" fill="url(#sg-heritage)" opacity="0.7"/>
      ))}
      <defs>
        <linearGradient id="sg-heritage" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor={dark ? "#e8c46a" : "#8a5a12"}/>
          <stop offset="50%" stopColor={dark ? "#d4a82a" : "#c4911e"}/>
          <stop offset="100%" stopColor={dark ? "#c8921a" : "#906211"}/>
        </linearGradient>
      </defs>
    </svg>
  )
}

const CONCEPT_STORIES = [
  {
    title: "The Magic of Shunya: How Zero Unlocked the Universe",
    source: "Brahmasphuta Siddhanta, 628 CE",
    tag: "mathematical breakthrough",
    paragraphs: [
      "In ancient Greece and Rome, people had no symbol for nothing. They used blank spaces, but their mathematical systems made complex multiplication and division incredibly hard. Everything changed when Indian mathematicians, led by Brahmagupta, treated Shunya (Zero) as a number in its own right.",
      "Brahmagupta wrote down the algebraic rules of Zero: a number minus itself is zero, zero multiplied by any number is zero, and zero added to a number leaves it unchanged. He even defined negative numbers to represent debts, creating a complete mathematical system.",
      "This simple concept unlocked the decimal place-value system. Without Zero, we would not have algebra, trigonometry, or calculus. And because computers run on binary code (ones and zeros), modern digital technology is directly built on this ancient Indian breakthrough."
    ]
  },
  {
    title: "Aryabhata's Spherical Earth: Science Without Borders",
    source: "Aryabhatiya, 499 CE",
    tag: "astronomical discovery",
    paragraphs: [
      "Long before Galileo or Copernicus, the 23-year-old mathematician Aryabhata was studying the heavens from his observatory in Kusumapura. He realized that the Earth is not flat; it is a sphere floating in space, which he called Bhugola (earth-ball).",
      "Aryabhata wrote that the apparent rotation of the stars is an illusion, caused by the actual rotation of the Earth on its axis. He compared it to a person in a moving boat who sees the trees on the banks moving backward.",
      "He also calculated the Earth's circumference to be 24,835 miles (off by only 0.2% from the actual 24,901 miles) and explained that eclipses are caused by the shadows of the Earth and the Moon, discarding the old mythological stories of demons swallowing the sun."
    ]
  },
  {
    title: "The Seeds of Calculus: Finding Speed in the 12th Century",
    source: "Siddhanta Shiromani, 1150 CE",
    tag: "calculus seeds",
    paragraphs: [
      "We are taught that calculus was invented in Europe in the 17th century by Newton and Leibniz. But the seeds of calculus were planted in India five centuries earlier. Bhaskaracharya was trying to calculate the instantaneous speed of planets.",
      "He realized that to find a planet's speed at a single moment, he had to divide its motion into infinite, tiny intervals of time. He wrote formulas that are equivalent to the modern derivative of sine and cosine functions.",
      "Later, in the 14th century, Madhava of the Kerala School discovered infinite series for trigonometric values, which is the core of advanced calculus. They were thinking about limits, derivatives, and integration long before Europe began its scientific revolution."
    ]
  },
  {
    title: "Mapping the Stars with Mathematics",
    source: "Surya Siddhanta, 4th–6th Century CE",
    tag: "cosmology and math",
    paragraphs: [
      "How do you map the stars without a telescope? Ancient Indian astronomers used Khagola (spherical astronomy) and pure mathematics. The Surya Siddhanta, written in the 4th century CE, contains calculations of planetary cycles with shocking accuracy.",
      "They calculated the length of the solar year as 365.258 days, and the distance to the moon. They used sine and cosine tables (which they invented) to calculate the angles of planets and stars in the night sky.",
      "Indian astronomers built metal and stone devices to observe stars, but their main tool was geometry. Their mathematical models of the solar system were heliocentric (sun-centered) and elliptic, centuries ahead of global astronomy."
    ]
  },
  {
    title: "Panini's Grammar: The World's First Programming Language",
    source: "Ashtadhyayi, ~400 BCE",
    tag: "algorithmic language",
    paragraphs: [
      "In the 4th century BCE, the scholar Panini set out to standardize the Sanskrit language. He created the Ashtadhyayi, a system of 3,996 rules that can generate every grammatically correct Sanskrit word from basic roots.",
      "What makes this brilliant is that the Ashtadhyayi is a formal, rule-based system. It uses variables, condition statements, and context-free grammar structures. It is, in essence, the world's first programming language compiler.",
      "Modern computer scientists, including John Backus, discovered that Panini's rules map directly to the Backus-Naur Form (BNF) used to define computer programming languages like Fortran and Algol. Panini built the logic of computer code, thousands of years ago."
    ]
  },
  {
    title: "Sushruta Samhita: The World's First Surgical Manual",
    source: "Sushruta Samhita, 600 BCE",
    tag: "ancient surgical art",
    paragraphs: [
      "Ancient India was the birthplace of surgery. In 600 BCE, in Varanasi, a wise physician named Sushruta was teaching his students how to operate. He had them practice incisions on gourds, cucumbers, and watermelons before operating on humans.",
      "Sushruta designed over 120 surgical instruments, including scalpels, needles, forceps, and probes, many styled after the shapes of birds and animals to fit the human hand. He is most famous for inventing rhinoplasty (rebuilding a severed nose using a flap of skin from the cheek).",
      "His book, the Sushruta Samhita, details how to sterilize wounds, use wine as an anesthetic, set complex bone fractures, and remove cataracts using curved needles. He was a master of reconstructive surgery, laying down principles that surgeons follow today."
    ]
  }
]

const CURIOSITY_STORIES = [
  {
    title: "Delhi's Rust-Free Iron Pillar: A 1600-Year-Old Chemistry Miracle",
    source: "Ancient Metallurgical Treatise",
    tag: "metallurgical wonder",
    paragraphs: [
      "Imagine a massive iron pillar, weighing over six tons, standing completely open to the elements for over sixteen hundred years. In any other part of the world, such iron would have crumbled into rust centuries ago. But in Delhi, India, the famous Iron Pillar of Chandragupta II remains pristine, clean, and completely rust-free.",
      "For centuries, modern scientists and metallurgists were baffled by this phenomenon. How could ancient Indian blacksmiths achieve what modern factories still struggle with? The answer lies in their advanced knowledge of chemistry. Ancient Indian metallurgists intentionally used a high amount of phosphorus while smelting the iron.",
      "This phosphorus reacted with the air to create a thin, protective layer called 'misawite' on the surface of the pillar. This self-healing micro-layer shields the iron from moisture and oxygen, keeping it rust-free. Instead of corroding, the pillar actually becomes stronger with time!",
      "This is a shining testament to India's ancient mastery over metallurgy. Long before the Industrial Revolution, Indian blacksmiths were producing ultra-pure, high-phosphorus iron that defies time. When you look at it, you can't help but say, 'Wow, this is my India!'"
    ]
  },
  {
    title: "4500 Years Ago, Harappa Had Flushing Toilets and Under-Grid Sanitation",
    source: "Archaeological Survey of India",
    tag: "civil engineering marvel",
    paragraphs: [
      "Over four thousand five hundred years ago, in the cities of Harappa and Mohenjo-Daro, people lived in planned cities that would rival many modern towns today. Streets were laid out in a perfect grid system, matching a compass, and houses were built with uniform, kiln-baked clay bricks.",
      "But the most astonishing feature was their sanitation. Almost every household had a private bathing area and a flushing toilet that drained into a main street sewage line. These sewage lines were not open trenches; they were covered underground brick channels with regular manholes for inspection!",
      "They also engineered the world's first urban water systems, including reservoirs and public baths like the Great Bath of Mohenjo-Daro, lined with natural bitumen to make it waterproof. The cities had separate residential and commercial zones, public granaries, and specialized dockyards for sea trade.",
      "At a time when most civilizations were in their infancy, ancient India was executing master-class civil engineering and hygiene. It shows a society that valued cleanliness, civic order, and scientific layout above all. Truly, a heritage to be proud of!"
    ]
  },
  {
    title: "Wootz Steel: The Ancient Indian Metallurgy That Made Global History",
    source: "Metallurgical History Archives",
    tag: "ancient wootz steel",
    paragraphs: [
      "In the ancient world, there was one steel that every empire coveted above all else. Roman emperors paid fortunes for it, and Crusaders in the Middle Ages told stories of legendary swords that could cut a shield in two or slice a falling silk scarf in mid-air. This was Damascus steel—but it was born in South India as Wootz steel.",
      "Starting from 300 BCE, Indian metallurgists in Tamil Nadu, Karnataka, and Andhra Pradesh developed a high-carbon steel-making process. They placed high-purity iron, wood, and carbon-rich leaves inside sealed clay crucibles and heated them in high-temperature furnaces using bellows.",
      "This crucible smelting method gave the steel a unique carbon structure containing microscopic carbon nanotubes and carbide bands. When forged, these swords showed a beautiful, wavy water-like pattern. They were incredibly flexible, yet sharp enough to maintain their edge through fierce battles.",
      "Wootz steel was one of India's greatest exports, traded across Persia, Rome, and China. It represents the pinnacle of ancient material science, proving that Indian blacksmiths were the premier steel-makers of the world for over a thousand years. Wow!"
    ]
  },
  {
    title: "Jantar Mantar: Massive Stone Calculators That Tracked the Heavens",
    source: "Maharaja Jai Singh II Archives",
    tag: "astronomical computer",
    paragraphs: [
      "In an era before computers and digital telescopes, how did astronomers track the movement of planets, measure the exact altitude of the sun, and predict eclipses with absolute precision? They built Jantar Mantar—a collection of nineteen architectural astronomical instruments made of stone and marble.",
      "Built by Maharaja Sawai Jai Singh II in Jaipur, Delhi, and other cities, these are not just statues; they are massive scientific calculators. The Vrihat Samrat Yantra is the world's largest stone sundial, standing 27 meters high. Its shadow moves at a speed of four centimeters per minute, letting us tell local time to within two seconds!",
      "These stone instruments were designed to prevent the errors that occurred with smaller metal instruments. By using local stone and plaster, Jai Singh created structures that resisted thermal expansion and remained perfectly calibrated for centuries, tracking solar declination and stellar coordinates.",
      "Walking through Jantar Mantar feels like walking inside a giant mechanical computer. It showcases a beautiful union of art, architecture, and advanced astronomy, proving that Indian science was bold, large-scale, and incredibly precise."
    ]
  }
]

const SCHOLARS = [
  {
    id: 1, name: 'Aryabhata', period: '476 – 550 CE',
    title: 'Pioneer of Earth\'s rotation, eclipses, and mathematical π.',
    desc: 'Calculated π to 4 decimal places, proved the Earth rotates on its axis to cause day and night, and explained solar and lunar eclipses scientifically.',
    img: aryabhataPortrait,
    field: 'mathematics', color: '#c9a84c',
    story: {
      title: "Aryabhata: The Astronomer Who Mapped the Earth and Stars",
      source: "Aryabhatiya, 499 CE",
      paragraphs: [
        "In the year 499 CE, a young genius named Aryabhata sat in his observatory in Kusumapura, modern Patna. At just twenty-three years old, he wrote the Aryabhatiya, a masterwork in mathematics and astronomy written in poetic verses.",
        "Aryabhata was the first in the world to suggest that the Earth is a sphere floating in space, and that it rotates on its own axis. He explained that this rotation is what makes the sun and stars appear to move across the sky, just as trees seem to run backward to someone in a moving boat.",
        "He calculated the length of the solar year as 365.258 days—off by only a few minutes from modern science. He calculated the value of Pi to four decimal places (3.1416) and called it an 'approximate' value, showing he understood that Pi is irrational.",
        "Furthermore, Aryabhata discarded the superstitious belief that eclipses are caused by demons swallowing the sun. He proved mathematically that solar and lunar eclipses are simply shadows cast by the Earth and the Moon. A true father of science!"
      ]
    }
  },
  {
    id: 2, name: 'Bhaskaracharya', period: '1114 – 1185 CE',
    title: 'Discovered gravity equations and conceived calculus.',
    desc: 'In Siddhanta Shiromani, Bhaskaracharya wrote that objects fall because the Earth attracts them. He calculated earth\'s orbit time and laid foundations for calculus.',
    img: bhaskaraPortrait,
    field: 'astronomy', color: '#8b6f4c',
    story: {
      title: "Bhaskaracharya: The Sage of Gravity and Motion",
      source: "Siddhanta Shiromani, 1150 CE",
      paragraphs: [
        "Five hundred years before Sir Isaac Newton watched an apple fall, Bhaskaracharya (also known as Bhaskara II) was calculating the force that holds our universe together. In his mathematical masterpiece, the Siddhanta Shiromani, he wrote down the fundamental law of gravity.",
        "Bhaskaracharya stated: 'Objects fall toward the earth because of a force of attraction. The earth, by its nature, attracts any massive object floating in space toward itself.' He understood that gravity is a universal pull, not a localized phenomenon.",
        "Bhaskaracharya also made remarkable breakthroughs in mathematics. He was the first to explain that dividing any number by zero results in infinity, and he wrote equations calculating the instantaneous speed of planets, anticipating calculus.",
        "His work on arithmetic, algebra, and geometry was so advanced that it laid the foundation for planetary coordinates used for centuries. He proved that ancient India was doing advanced calculus while Europe was still in the Dark Ages."
      ]
    }
  },
  {
    id: 3, name: 'Lilavati', period: 'by Bhaskaracharya',
    title: 'Mathematics written like poetry. Beauty, logic, and creativity.',
    desc: 'A poetic dialogue of mathematical problems solved by Bhaskara\'s daughter, representing a beautiful union of logic and emotion.',
    img: lilavatiPortrait,
    field: 'mathematics', color: '#d4a82a',
    story: {
      title: "Līlāvatī: A Father's Love Letter to Numbers",
      source: "Līlāvatī of Bhāskara II, 12th Century CE",
      paragraphs: [
        "In the 12th century, the mathematician Bhāskara II wrote a treatise that would change mathematics forever. But unlike the dry, formulaic textbooks we know today, the Līlāvatī was different. It was a conversation — a poetic dialogue between a father and his daughter.",
        "Līlāvatī, Bhāskara's daughter, was told that if she waited until a precise astrological moment to get married, her life would be blessed. But the moment passed — a pearl dropped into a cup went unnoticed. In consolation, Bhāskara named his greatest work after her, writing mathematical problems as stories for her to solve.",
        "\"Beautiful Līlāvatī, tell me, how many combinations of flavors can you make with six different tastes?\" — the problems were posed as riddles, as poems, as stories. The Līlāvatī covered arithmetic, geometry, algebra, and even early calculus concepts — all wrapped in the warmth of a father teaching his daughter.",
        "The manuscript opens with a benediction to the gods but reads like a lullaby of logic. It's why the Līlāvatī remains one of the most beloved mathematical texts in history — not because it was the most advanced, but because it was the most human."
      ]
    }
  },
  {
    id: 4, name: 'Charaka', period: 'circa 300 BCE',
    title: 'Father of Ayurvedic Medicine. Formulated holistic anatomy and bio-energies.',
    desc: 'Author of the Charaka Samhita. Mapped the human circulatory system, digestive system, and proposed that health is a balance of mind, body, and spirit.',
    img: charakaPortrait,
    field: 'medicine', color: '#4a7c59',
    story: {
      title: "Charaka: The Sage of Ayurvedic Medicine and Healing",
      source: "Charaka Samhita, circa 300 BCE",
      paragraphs: [
        "Long before modern medicine was born, the sage Charaka was walking across India, studying plants, observing patients, and compiling the world's most advanced ancient medical manual: the Charaka Samhita. He is remembered as the Father of Indian Medicine.",
        "Charaka believed that prevention is better than cure, and that health is not just the absence of disease. He defined health as a perfect balance of three biological energies, or Doshas: Vata (air/space), Pitta (fire), and Kapha (water/earth).",
        "The Charaka Samhita contains detailed descriptions of human anatomy, the circulatory system, and digestion. Charaka described the heart as the central hub of life, connected to ten main channels that carry nutrients and consciousness throughout the body.",
        "He also wrote an ethical oath for doctors, demanding that they serve patients with absolute dedication, charge no fee from the poor, and maintain complete confidentiality. This oath predates the western Hippocratic Oath by centuries, showcasing India's ancient wisdom."
      ]
    }
  },
  {
    id: 5, name: 'Panini', period: 'circa 400 BCE',
    title: 'Algebraic genius who built the first formal grammar compiler.',
    desc: 'Formulated a system of 3,996 rules for Sanskrit that predate modern programming compilers and Backus-Naur computer logic.',
    img: paniniPortrait,
    field: 'literature', color: '#7c6b4a',
    story: {
      title: "Panini: The Algebraic Genius of Language",
      source: "Ashtadhyayi, circa 400 BCE",
      paragraphs: [
        "In the 4th century BCE, a scholar named Panini achieved a feat of pure logic that continues to amaze modern computer scientists. He wrote the Ashtadhyayi, a book containing 3,996 rules that formalize the grammar and pronunciation of Sanskrit.",
        "Panini did not just write a list of grammar rules; he built a machine. His rules are algebraic formulas that use auxiliary symbols, context-sensitive markers, and recursive logic. You input a word root, apply the rules in order, and the correct grammatical form emerges.",
        "This was the world's first formal system, preceding the invention of computer programming by over two thousand years. Panini's rules map directly to Backus-Naur Form (BNF), the mathematical metalanguage used to define modern computer code languages today.",
        "Panini proved that language is a structured code. His logic inspired both modern linguistics and the architecture of computer compilers, making him a silent founding father of the digital age. Truly, a genius of the highest order."
      ]
    }
  },
  {
    id: 6, name: 'Sushruta', period: 'circa 600 BCE',
    title: 'Father of Surgery. Designed 120+ surgical tools and rhinoplasty.',
    desc: 'Operating in ancient Varanasi, Sushruta described skin grafts, bone setting, and plastic surgery procedures that are close to modern standards.',
    img: sushrutaPortrait,
    field: 'medicine', color: '#a33b3b',
    story: {
      title: "Sushruta: The First Surgeon of Human History",
      source: "Sushruta Samhita, circa 600 BCE",
      paragraphs: [
        "In the ancient city of Varanasi, on the banks of the sacred Ganges, the physician Sushruta was performing surgeries that sound impossible for his time. Operating in 600 BCE, he is universally recognized as the Father of Surgery.",
        "Sushruta Samhita, his surgical treatise, lists over 120 surgical instruments (including scalpels, forceps, needles, and catheters) and details 300 different operations. He had his students practice incisions on melons and gourds before operating.",
        "He is most famous for inventing rhinoplasty—the reconstruction of the nose. In ancient India, cutting off the nose was a common punishment. Sushruta would cut a flap of skin from the patient's cheek or forehead, rotate it, and suture it to form a new nose.",
        "He also detailed cataract operations using a curved needle to push the cloudy lens aside, and set complex bone fractures. Sushruta understood the importance of sterilization, advising that instruments be heated and wounds washed with antiseptic herbs. A true marvel!"
      ]
    }
  },
  {
    id: 7, name: 'Brahmagupta', period: '598 – 668 CE',
    title: 'First mathematician to define Zero as a real number and negative rules.',
    desc: 'Established that zero represents nothingness in math, and formulated laws for multiplying negative integers ("debts").',
    img: brahmaguptaPortrait,
    field: 'mathematics', color: '#c9a84c',
    story: {
      title: "Brahmagupta: The Man Who Defined Zero",
      source: "Brahmasphuta Siddhanta, 628 CE",
      paragraphs: [
        "While zero was sometimes used as a blank space in ancient civilizations, it was the Indian mathematician Brahmagupta who first defined Zero as a complete number in the year 628 CE. He gave zero its own name, Shunya, meaning empty.",
        "In his work Brahmasphuta Siddhanta, Brahmagupta wrote down the algebraic rules of Zero for the first time in history. He explained that subtracting a number from itself results in zero, and that any number multiplied by zero is zero.",
        "Brahmagupta also introduced the concept of negative numbers, calling them 'debts' (Rina) and positive numbers 'fortunes' (Dhana). He established rules like 'a debt multiplied by a debt is a fortune,' which is the mathematical law of minus times minus.",
        "By treating zero and negative numbers as real entities, Brahmagupta unlocked the door to modern algebra. His formulas for quadratic equations and geometry are still taught in schools today, making him a giant of world mathematics."
      ]
    }
  },
  {
    id: 8, name: 'Madhava', period: '1340 – 1425 CE',
    title: 'Pioneer of mathematical analysis and infinite series calculus.',
    desc: 'Discovered trigonometric series limits and calculated π to 11 decimal places 300 years before Newton and Leibniz.',
    img: madhavaPortrait,
    field: 'mathematics', color: '#b8924a',
    story: {
      title: "Madhava of Sangamagrama: The Pioneer of Infinite Series Calculus",
      source: "Kerala School of Mathematics, circa 1400 CE",
      paragraphs: [
        "Deep in the green land of Kerala, in the late 14th century, a brilliant mathematician named Madhava was solving mathematical problems that would not be solved in Europe for another three hundred years. He founded the Kerala School of Astronomy.",
        "Madhava discovered infinite series expansions for trigonometric functions like sine, cosine, and tangent. He used these series to calculate the value of Pi to eleven decimal places (3.14159265359), which was a world record for precision.",
        "His calculations of limits and infinite series laid the foundational stones of mathematical analysis and calculus, centuries before Isaac Newton and Gottfried Leibniz were even born. He understood that infinite addition can lead to a finite limit.",
        "Madhava's work was preserved by his students on palm leaf manuscripts. He represents a golden age of Indian mathematics, proving that advanced calculus was thriving on the Malabar coast long before the European scientific revolution. Wow!"
      ]
    }
  },
  {
    id: 9, name: 'Chanakya', period: '375 – 283 BCE',
    title: 'Master of Statecraft, Economics, and Political Strategy.',
    desc: 'Authored the Arthashastra, defining state planning, espionage, and taxation systems centuries before Machiavelli\'s Prince.',
    img: chanakyaPortrait,
    field: 'literature', color: '#7c6b4a',
    story: {
      title: "Chanakya: The Master of Strategy and Statecraft",
      source: "Arthashastra, circa 300 BCE",
      paragraphs: [
        "In the ancient university city of Taxila, a brilliant professor of political science and economics was quietly planning the unification of India. His name was Chanakya (also known as Kautilya or Vishnugupta). He would go on to help Chandragupta Maurya establish the Maurya Empire, one of the largest empires in Indian history.",
        "Chanakya compiled his wisdom in the Arthashastra, a monumental treatise on statecraft, economic policy, and military strategy. It covers everything from the duties of a king, foreign diplomacy, tax systems, and consumer protection to the management of forests, mines, and spy networks.",
        "Unlike many ancient texts, the Arthashastra is completely pragmatic and realistic. It explains how a state must protect its citizens, manage its treasury, and handle hostile neighbors using four methods of diplomacy: Sama (peace), Dama (concession), Bheda (division), and Danda (force).",
        "His ideas on governance, tax rates, and intelligence gathering are so advanced that they still align with modern administrative science. Chanakya proved that ancient India possessed a sophisticated, highly organized system of political theory long before similar works appeared in Europe. Wow!"
      ]
    }
  },
  {
    id: 10, name: 'Patanjali', period: 'circa 150 BCE',
    title: 'Father of Yoga Philosophy and Mind-Breath Science.',
    desc: 'Author of the Yoga Sutras, codifying the 8-limbed path (Ashtanga) to achieve mental calm and cosmic consciousness.',
    img: patanjaliPortrait,
    field: 'literature', color: '#8b6f4c',
    story: {
      title: "Patanjali: Codifying the Science of Mind and Breath",
      source: "Yoga Sutras of Patanjali, circa 150 BCE",
      paragraphs: [
        "For thousands of years, the practice of Yoga was scattered across various oral traditions in India. Around the 2nd century BCE, the sage Patanjali undertook the task of codifying this ancient wisdom into a structured, scientific system: the Yoga Sutras.",
        "Patanjali defined Yoga as 'Chitta Vritti Nirodha'—the cessation of the fluctuations of the mind. He outlined the Ashtanga Yoga, or the Eight-Limbed Path, which is a systematic guide for living a purposeful, disciplined, and spiritually fulfilled life.",
        "This eight-fold path ranges from moral codes (Yamas and Niyamas) and physical postures (Asanas) to breath control (Pranayama), sensory withdrawal (Pratyahara), concentration (Dharana), meditation (Dhyana), and ultimate absorption (Samadhi). It is not merely physical exercise, but a deep psychological science.",
        "Patanjali's work shows that ancient India understood the deep connection between breath, body, and mental peace. Today, millions of people worldwide practice yoga to find balance, but its roots lie in the profound psychological science codified by Patanjali. Truly a gift from India to the world!"
      ]
    }
  },
  {
    id: 11, name: 'Kanada', period: 'circa 600 BCE',
    title: 'Pioneer of Atomic Theory and Vaisheshika Physics.',
    desc: 'Formulated the concept of Paramanu (indivisible atoms) and laws of force and motion centuries before Dalton and Newton.',
    img: kanadaPortrait,
    field: 'mathematics', color: '#4a7c59',
    story: {
      title: "Sage Kanada: The Father of Atomic Theory",
      source: "Vaisheshika Sutra, circa 600 BCE",
      paragraphs: [
        "More than 2,000 years before John Dalton or Democritus, Sage Kanada formulated the concept that all matter is made of tiny, indivisible particles. He called these particles 'Paramanu' (atoms).",
        "Kanada wrote in the Vaisheshika Sutra that atoms are eternal and indestructible. He explained that atoms combine in pairs and triplets to form molecules, and that chemical changes occur due to heat and light energy.",
        "He also formulated early laws of force and motion, proving that ancient Indian science was mapping out the physical foundations of the universe using pure logic and empirical observation. Wow, this is my India!"
      ]
    }
  },
  {
    id: 12, name: 'Gargi', period: 'circa 700 BCE',
    title: 'Renowned Vedic Philosopher and Cosmologist.',
    desc: 'Challenged the greatest scholars of ancient India in debates on cosmology and the nature of reality in Upanishadic courts.',
    img: gargiPortrait,
    field: 'literature', color: '#d4a82a',
    story: {
      title: "Gargi Vachaknavi: The Philosopher Who Challenged Kings",
      source: "Brihadaranyaka Upanishad, circa 700 BCE",
      paragraphs: [
        "In the royal court of King Janaka of Videha, a grand gathering of the greatest minds of ancient India was taking place. The king had offered a prize of a thousand cows, their horns gold-plated, to the wisest scholar present. While male philosophers debated, a woman stood up to challenge the assembly: Gargi Vachaknavi.",
        "Gargi was a renowned philosopher, daughter of sage Vachaknu. She engaged in a legendary debate with the revered sage Yajnavalkya. Unlike others who asked simple ritualistic questions, Gargi questioned him on the origin of all existence and the structure of the cosmos.",
        "She asked: 'If all this earth is woven like warp and woof on water, what then is water woven on?' Yajnavalkya replied 'On air.' She pushed further and further, asking what air, space, the worlds of the sun, moon, and stars are woven on, tracing the universe back to its ultimate source, Brahman.",
        "Her questions were so profound and her logic so sharp that the entire assembly fell silent. Gargi proved that intellectual greatness in ancient India knew no boundaries of gender, and she remains a towering symbol of wisdom and courage. Wow, this is my India!"
      ]
    }
  },
  {
    id: 13, name: 'Khana', period: 'circa 800 – 1200 CE',
    title: 'Legendary Female Astronomer and Meteorologist.',
    desc: 'Composed mathematical maxims on agriculture, moon phases, and weather predictions that remain folklore in Bengal.',
    img: khanaPortrait,
    field: 'astronomy', color: '#b8924a',
    story: {
      title: "Khana: The Star-Gazer of Ancient Agriculture",
      source: "Khana's Bachan (Maxims of Khana), Medieval Era",
      paragraphs: [
        "In medieval India, a woman named Khana became famous across Bengal and eastern India for her astonishing ability to predict weather, rainfall, and crop yields. She was a master of astronomy and meteorology, and her sayings (known as 'Khana's Bachan') are still quoted by farmers today.",
        "Khana studied the movement of stars, the phases of the moon, and the behavior of wind currents to make accurate scientific predictions. She translated complex astronomical cycles into simple, rhythmic poetry that anyone could memorize and use.",
        "For example, she wrote exact formulas for when to plant rice based on the moon's position, how to forecast a drought by observing clouds, and how to measure wind direction. Her knowledge was so precise that it often surpassed the predictions of the royal court astronomers.",
        "Khana represents the beautiful integration of astronomy and practical science. She was a pioneer who used her mathematical genius to help ordinary people feed their families, proving that ancient Indian science was deeply rooted in the well-being of society."
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
  const scrollRef = useRef(null)
  const [isPlayingSound, setIsPlayingSound] = useState(false)

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
          --heritage-bg: #030e14;
          --heritage-bg-rgb: 3, 14, 20;
          --heritage-text: #f2ebd9;
          --heritage-muted: #8a969b;
          --heritage-gold: #c9a84c;
          --heritage-gold-rgb: 201, 168, 76;
          --heritage-gold-hover: #e8c46a;
          --heritage-card-bg: rgba(4, 20, 29, 0.85);
          --heritage-card-border: rgba(201, 168, 76, 0.14);
          --heritage-header-bg: rgba(3, 14, 20, 0.85);
          --heritage-header-border: rgba(201, 168, 76, 0.08);
          --heritage-category-bg: #05141e;
          --heritage-category-border: rgba(201, 168, 76, 0.15);
          --heritage-category-active: #c9a84c;
          --heritage-category-active-text: #030e14;
          --heritage-footer-bg: #020b10;
          --heritage-footer-border: rgba(201, 168, 76, 0.1);
        }

        /* Basic Styles with background image texture blending */
        .heritage-page-container {
          min-height: 100vh;
          background-color: var(--heritage-bg);
          color: var(--heritage-text);
          font-family: 'Outfit', sans-serif;
          transition: background-color 0.4s ease, color 0.4s ease;
          overflow-x: hidden;
          position: relative;
        }

        .heritage-body-content {
          background: 
            linear-gradient(rgba(var(--heritage-bg-rgb), 0.82), rgba(var(--heritage-bg-rgb), 0.82)),
            url(${heritageBg}) repeat;
          background-attachment: fixed;
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
        .hero-section {
          padding: 70px 0 0;
          position: relative;
          z-index: 10;
          min-height: 85vh;
          min-height: 85dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          background: var(--heritage-bg);
        }

        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          object-position: 50% 40%;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            var(--heritage-bg) 0%,
            var(--heritage-bg) 60px,
            rgba(var(--heritage-bg-rgb), 0.85) 80px,
            rgba(var(--heritage-bg-rgb), 0.3) 130px,
            rgba(var(--heritage-bg-rgb), 0.1) 180px,
            transparent 250px
          );
          pointer-events: none;
        }

        .dark-theme .hero-bg-overlay {
          background: linear-gradient(
            180deg,
            var(--heritage-bg) 0%,
            var(--heritage-bg) 60px,
            rgba(var(--heritage-bg-rgb), 0.85) 80px,
            rgba(var(--heritage-bg-rgb), 0.3) 130px,
            rgba(var(--heritage-bg-rgb), 0.1) 180px,
            transparent 250px
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
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: var(--heritage-gold);
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 4.8rem);
          font-weight: 300;
          line-height: 1.1;
          margin: 0 0 24px;
          letter-spacing: -0.01em;
          color: var(--heritage-text);
          text-shadow: 0 2px 10px rgba(var(--heritage-gold-rgb), 0.15);
        }

        .dark-theme .hero-title {
          color: #FDF6E3;
          text-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }

        .hero-title .italic-gold {
          color: var(--heritage-gold);
          font-style: italic;
          font-weight: 400;
        }

        .hero-subtext {
          font-size: 1.15rem;
          line-height: 1.65;
          color: var(--heritage-muted);
          margin: 0 0 32px;
          font-weight: 300;
          max-width: 600px;
        }

        .dark-theme .hero-subtext {
          color: rgba(253, 246, 227, 0.8);
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .hero-hindi-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(var(--heritage-gold-rgb), 0.4);
          background-color: rgba(var(--heritage-gold-rgb), 0.08);
          padding: 8px 20px;
          border-radius: 99px;
          font-size: 0.95rem;
          color: var(--heritage-gold-hover);
          font-style: italic;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 36px;
          backdrop-filter: blur(10px);
        }

        .dark-theme .hero-hindi-badge {
          background-color: rgba(18, 10, 4, 0.6);
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
          display: grid;
          grid-template-columns: 0.32fr 0.68fr;
          gap: 40px;
        }

        .curiosity-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .curiosity-left-desc {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          line-height: 1.65;
          opacity: 0.8;
          margin-bottom: 28px;
        }

        .curiosity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .curiosity-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 500;
          line-height: 1.4;
          margin: 0 0 16px;
          color: var(--heritage-text);
          font-style: italic;
          z-index: 2;
        }

        .curiosity-card-btn {
          align-self: flex-end;
          background: rgba(var(--heritage-gold-rgb), 0.1);
          border: none;
          color: var(--heritage-gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          transition: all 0.25s;
          z-index: 2;
        }

        .curiosity-grid-card:hover .curiosity-card-btn {
          background-color: var(--heritage-gold);
          color: var(--heritage-bg);
          transform: translateX(3px);
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

        /* Page Footer */
        .page-footer {
          background-color: var(--heritage-footer-bg);
          border-top: 1px solid var(--heritage-footer-border);
          padding: 80px 48px;
          position: relative;
          z-index: 10;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 60px;
        }

        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 320px;
        }

        .footer-tagline {
          font-size: 0.82rem;
          line-height: 1.6;
          opacity: 0.6;
          font-weight: 300;
        }

        .footer-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 440px;
        }

        .footer-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem;
          font-weight: 500;
          color: var(--heritage-gold);
          margin: 0 0 10px;
        }

        .footer-quote-translation {
          font-size: 0.88rem;
          opacity: 0.7;
          margin: 0;
          font-weight: 300;
        }

        .footer-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 20px;
        }

        .social-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .social-link {
          color: var(--heritage-text);
          opacity: 0.65;
          transition: opacity 0.2s, color 0.2s;
        }

        .social-link:hover {
          opacity: 1;
          color: var(--heritage-gold);
        }

        .footer-links-row {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .footer-links-row a {
          text-decoration: none;
          font-size: 0.78rem;
          color: var(--heritage-text);
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .footer-links-row a:hover {
          opacity: 1;
        }

        .footer-made-with {
          font-size: 0.72rem;
          opacity: 0.45;
          margin-top: 10px;
        }

        /* Responsiveness Styling */
        @media (max-width: 1024px) {
          .hero-container {
            text-align: center;
          }
          .hero-content {
            align-items: center;
          }
          .ideas-container, .curiosity-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .ideas-left, .curiosity-left {
            align-items: center;
            text-align: center;
          }
          .footer-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 40px;
          }
          .footer-right {
            align-items: center;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 70px 0 0;
            min-height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-container {
            padding: 0 24px;
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
          .ideas-grid, .curiosity-grid {
            grid-template-columns: 1fr;
          }
          .curiosity-section {
            padding: 40px 24px 80px;
          }
          .page-footer {
            padding: 60px 24px;
          }
          .footer-links-row {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
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
          background-color: rgba(3, 14, 20, 0.85);
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
              brilliance<br />
              from <span className="italic-gold">this land.</span>
            </h1>
            <p className="hero-subtext">
              The ideas. The minds.<br />
              The legacy that still shapes the future of modern science and thought.
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
              <span className="section-eyebrow">ideas that changed everything <span style={{fontSize: '11px'}}>∞</span></span>
              <h2 className="section-title" style={{marginBottom: '20px'}}>Concepts that Shifted Civilization</h2>
              <p className="ideas-left-desc">Ancient insights, eternal impact. Discovery of numerical matrices, circular astronomy, and human anatomy systems that defined the classical age.</p>
              <button className="btn-ideas-more" onClick={() => document.getElementById('curiosity')?.scrollIntoView({ behavior: 'smooth' })}>
                explore more <ArrowRight size={13} />
              </button>
            </div>
            
            <div className="ideas-grid">
              {/* Card 1: Zero */}
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
                    <path d="M12 12c-2-2.5-5.5-4-8.5-4S1 10.5 1 12s2.5 4 5.5 4 6.5-1.5 8.5-4zm0 0c2 2.5 5.5 4 8.5 4s5.5-2.5 5.5-4-2.5-4-5.5-4-6.5 1.5-8.5 4z" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">शून्य (zero)</h3>
                <span className="idea-sanskrit-sub">the concept of zero</span>
                <p className="idea-description">India transformed mathematics from mere counting to infinite potential by treating zero as a complete mathematical entity.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 2: Round Earth */}
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20M12 2v20" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">पृथ्वी गोल है</h3>
                <span className="idea-sanskrit-sub">the earth is round – Aryabhata</span>
                <p className="idea-description">Long before European explorers, Aryabhata calculated Earth's round shape, spherical rotation, and orbital axis.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 3: Calculus */}
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
                    <path d="M15 4c-2 0-3 1.5-3 3.5v9c0 2-1 3.5-3 3.5" />
                    <path d="M8 12h8" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">कलन (calculus)</h3>
                <span className="idea-sanskrit-sub">explored by Bhaskaracharya</span>
                <p className="idea-description">Bhaskaracharya laid foundations for derivatives and integration while calculating instantaneous motion of planets.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 4: Planet motion */}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
                    <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-15 12 12)" />
                    <ellipse cx="12" cy="12" rx="7" ry="2.2" transform="rotate(25 12 12)" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">ग्रहों की गति</h3>
                <span className="idea-sanskrit-sub">planetary movements</span>
                <p className="idea-description">Ancient calculations for orbits and eclipses with extremely accurate planetary coordinates, sans modern telescopes.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 5: Linguistics */}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="6" cy="6" r="2" />
                    <circle cx="18" cy="6" r="2" />
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    <line x1="12" y1="12" x2="6" y2="6" />
                    <line x1="12" y1="12" x2="18" y2="6" />
                    <line x1="12" y1="12" x2="6" y2="18" />
                    <line x1="12" y1="12" x2="18" y2="18" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">अष्टाध्यायी</h3>
                <span className="idea-sanskrit-sub">foundational text of linguistics</span>
                <p className="idea-description">Panini's 3,996 rule system mapping natural language structures, acting as the world's first formal algorithmic grammar.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>

              {/* Card 6: Surgery */}
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7c-2 0-3.5 1-4 3l-1.5 5.5c-.3 1 .5 1.5 1.2 1.2L12 15l4.3 1.7c.7.3 1.5-.2 1.2-1.2L16 10c-.5-2-2-3-4-3z" />
                    <path d="M8 18c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5" />
                    <circle cx="12" cy="5" r="0.5" fill="currentColor" />
                    <circle cx="12" cy="9" r="0.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="idea-sanskrit">शरीर विज्ञान</h3>
                <span className="idea-sanskrit-sub">knowledge of anatomy and surgery</span>
                <p className="idea-description">Sushruta's advanced tools and operating methods, detailing plastic surgery, rhinoplasty, and cataract removal in 600 BCE.</p>
                <ArrowRight size={14} className="idea-card-arrow" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── LATE NIGHT CURIOSITY SECTION ─── */}
        <section id="curiosity" className="curiosity-section">
          <div className="curiosity-container">
            <div className="curiosity-left">
              <span className="section-eyebrow">late night curiosity <span style={{fontSize: '11px'}}>🌙</span></span>
              <h2 className="section-title" style={{marginBottom: '20px'}}>Curated Wonders & Insights</h2>
              <p className="curiosity-left-desc">Bite-sized stories and lesser-known historical details from India's ancient mathematical and scientific legacy. Read, ponder, and play.</p>
              <button className="btn-ideas-more" onClick={() => setModalData({
                title: CURIOSITY_STORIES[0].title,
                source: CURIOSITY_STORIES[0].source,
                paragraphs: CURIOSITY_STORIES[0].paragraphs,
                tag: CURIOSITY_STORIES[0].tag
              })}>read stories <ArrowRight size={13} /></button>
            </div>
            
            <div className="curiosity-grid">
              {CURIOSITY_STORIES.map((story, i) => (
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
                  <h3 className="curiosity-card-title">{story.title}</h3>
                  <button className="curiosity-card-btn" aria-label="Read story">
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}

              {/* Reading Aid Meditative BGM Card */}
              <div className="curiosity-grid-card media-card fs-gold-corner-card fs-sandstone-tablet">
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

        {/* ─── ELEGANT FOOTER ─── */}
        <footer className="page-footer">
          <div className="footer-container">
            <div className="footer-left">
              <div className="logo-group">
                <FlowSymbol size={24} dark={dark} />
                <div className="logo-text">
                  <span className="logo-title">FLOWSTATE</span>
                  <span className="logo-subtitle">धीरे धीरे रे मना</span>
                </div>
              </div>
              <p className="footer-tagline">Tracing the intellectual systems, calculations, and holistic scripts that shaped human thought across time.</p>
            </div>

            <div className="footer-center">
              <p className="footer-quote">"विद्या विनयेन शोभते"</p>
              <p className="footer-quote-translation">Knowledge is beautiful when it brings humility.</p>
            </div>

            <div className="footer-right">
              <div className="social-row">
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Pinterest">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="20"/><path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.68 7.9 6.47 9.35-.08-.8-.16-2.03.03-2.9.18-.77 1.15-4.88 1.15-4.88s-.29-.59-.29-1.47c0-1.38.8-2.41 1.8-2.41.85 0 1.26.64 1.26 1.4 0 .85-.54 2.14-.82 3.32-.24 1 .5 1.8 1.48 1.8 1.77 0 3.13-1.87 3.13-4.57 0-2.39-1.72-4.06-4.17-4.06-2.84 0-4.51 2.13-4.51 4.33 0 .86.33 1.78.74 2.28a.3.3 0 0 1 .07.28c-.08.33-.26 1.07-.3 1.21-.05.21-.17.26-.39.15-1.46-.68-2.38-2.82-2.38-4.54 0-3.69 2.69-7.09 7.74-7.09 4.06 0 7.22 2.89 7.22 6.76 0 4.04-2.54 7.29-6.08 7.29-1.19 0-2.31-.62-2.69-1.35l-.73 2.8c-.27 1.02-1 2.3-1.49 3.09C10.08 21.91 11.02 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Spotify">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 11.5c2.5-1 5.5-1 8 0M9 15c2-.7 4-.7 6 0M7 8c3-1.5 7-1.5 10 0"/></svg>
                </a>
              </div>
              
              <div className="footer-links-row">
                <a href="/about">about</a>
                <a href="/blog">blog</a>
                <a href="/contact">contact</a>
                <a href="/careers">careers</a>
                <a href="/privacy">privacy</a>
              </div>
              
              <span className="footer-made-with">made with intention ♥</span>
            </div>
          </div>
        </footer>
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
                  Welcome to the Heritage Sanctuary. Here, we trace the logical scripts, mathematical proofs, and cosmological models designed by the great minds of ancient India.
                </p>
                <p className="story-modal-paragraph text-sm opacity-85 leading-relaxed" style={{ textIndent: 0 }}>
                  Resonant Tibetan singing bowl tones are active, creating a quiet space for contemplation as you explore.
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
                <h2 className="scholars-grid-title">Giants of Indian Wisdom</h2>
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

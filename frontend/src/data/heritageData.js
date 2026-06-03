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

export const CONCEPT_STORIES = [
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

export const CURIOSITY_STORIES = [
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

export const CURIOSITY_GROUPS = [
  { id: 'colonial-hangover', label: 'the colonial hangover', emoji: '🧠', desc: 'How 200 years of colonization rewired what we learn, how we see ourselves, and what success means.' },
  { id: 'flexes', label: 'flexes that go hard', emoji: '🔥', desc: 'Mars missions on a shoestring, inventing the flush toilet millennia ahead of schedule — India didn\'t just show up, it showed out.' },
  { id: 'pop-culture', label: 'pop culture rabbit holes', emoji: '🎬', desc: 'The Matrix, Oppenheimer, CERN — turns out the coolest modern references are all footnotes to ancient Indian texts.' },
]

export const SCHOLARS = [
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
        "In Varanasi, 2,600 years ago, Sushruta taught students to practice incisions on gourds before touching a human body. He designed 120 instruments shaped like birds and animals to fit the hand naturally. He invented rhinoplasty — rebuilding a severed nose with a cheek flap. Plastic surgery, millennia before the term existed.",
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


export const ALL_HERITAGE_STORIES = [
  ...SCHOLARS.map(s => ({
    label: s.field ? s.field.toUpperCase() : 'SCHOLAR',
    title: s.story.title,
    desc: s.desc,
    route: '/heritage',
    matchKey: s.story.title
  })),
  ...CONCEPT_STORIES.map(c => ({
    label: c.tag ? c.tag.toUpperCase() : 'CONCEPT',
    title: c.title,
    desc: c.paragraphs[0],
    route: '/heritage',
    matchKey: c.title
  })),
  ...CURIOSITY_STORIES.map(c => ({
    label: c.tag ? c.tag.toUpperCase() : 'CURIOSITY',
    title: c.title,
    desc: c.paragraphs[0],
    route: '/heritage',
    matchKey: c.title
  }))
]

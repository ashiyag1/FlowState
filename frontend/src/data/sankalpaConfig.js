import { getHinduDetails } from '../utils/hinduCalendar.js'

export const SANKALPAS = {
  calm: {
    msg: 'Calm chosen · breathing space and rest shape your day',
    emoji: '🧘',
    label: 'Calm',
    suggestedRituals: [
      {
        name: 'Bhramari Buzz (Humming Bee Breath)',
        time: '2',
        desc: 'Reset your vibe and quiet the mind. Cover your ears with your hands and make a steady humming sound as you exhale.'
      },
      {
        name: 'Vibe Check Breathwork (Nadi Shodhana)',
        time: '3',
        desc: 'Take 5 rounds of alternate nostril breathing to balance your energy, quiet chaos, and soothe your nervous system.'
      }
    ],
    wisdomOptions: [
      { wis: '"As a lamp in a windless place does not flicker, so is the mind of a yogi absorbed in the Self."', src: 'Bhagavad Gita', ref: '— on inner stillness' },
      { wis: '"When the five senses and the mind are still, and the intellect does not waver, that is the highest state."', src: 'Katha Upanishad', ref: '— on finding peace within' }
    ]
  },
  focus: {
    msg: 'Focus chosen · sharp intent and single tasks',
    emoji: '🎯',
    label: 'Focus',
    suggestedRituals: [
      {
        name: 'Deep Om Resonance (Mantra Japa)',
        time: '2',
        desc: 'Clear the clutter. Take a deep breath and chant a slow "A-U-M" to lock in focus and calm your thoughts.'
      },
      {
        name: 'Mandala Breath Trace (Prana Trace)',
        time: '2',
        desc: 'Trace a circle in the air with your finger. Inhale as you trace up, and exhale as you trace down to lock in focus.'
      }
    ],
    wisdomOptions: [
      { wis: '"Yoga is the calming of the fluctuations of the mind."', src: 'Patanjali Yoga Sutras', ref: '— on mental clarity' },
      { wis: '"By restraining the senses and focusing the mind, one gains supreme strength."', src: 'Bhagavad Gita', ref: '— on single-pointed awareness' }
    ]
  },
  heal: {
    msg: 'Heal chosen · gentle recovery and listening to the body',
    emoji: '🌿',
    label: 'Heal',
    suggestedRituals: [
      {
        name: 'Temple Rub (Karna Mardana)',
        time: '2',
        desc: 'Ground your energy. Gently massage your earlobes and temples for a minute to release sensory tension.'
      },
      {
        name: 'Warm Water Sip (Tambaa Sip)',
        time: '1',
        desc: 'Slowly sip warm water. Ayurveda calls warm water the first medicine to cleanse digestion and hydrate your cells.'
      }
    ],
    wisdomOptions: [
      { wis: '"Health is the state where the three doshas, tissues, and wastes are in balance, and the soul and mind are full of bliss."', src: 'Sushruta Samhita', ref: '— on holistic wellness' },
      { wis: '"When diet is correct, medicine is of no need. When diet is wrong, medicine is of no use."', src: 'Ayurvedic Proverb', ref: '— on natural recovery' }
    ]
  },
  grow: {
    msg: 'Grow chosen · seeking discomfort and rising stronger',
    emoji: '🌱',
    label: 'Grow',
    suggestedRituals: [
      {
        name: 'Sun Salutes (Tadasana Stretch)',
        time: '2',
        desc: 'Level up your posture. Interlock your fingers, flip your palms up, and stretch tall on your tiptoes to release physical tension.'
      },
      {
        name: 'Warrior Pose (Veerabhadrasana)',
        time: '2',
        desc: 'Hold a wide warrior stance for 5 deep breaths on each side to build daily full-body strength and posture.'
      }
    ],
    wisdomOptions: [
      { wis: '"You are what your deep, driving desire is. As your desire is, so is your deed; so is your destiny."', src: 'Brihadaranyaka Upanishad', ref: '— on purposeful growth' },
      { wis: '"Arise! Awake! Approach the great ones and learn from them."', src: 'Katha Upanishad', ref: '— on rising stronger' }
    ]
  },
  discipline: {
    msg: 'Discipline chosen · simple rules, repeated daily',
    emoji: '⚔️',
    label: 'Discipline',
    suggestedRituals: [
      {
        name: 'Face Splash (Sheetala Snana)',
        time: '1',
        desc: 'Snap out of brain fog. Splash cold water on your face and eyes 5 times to reboot your nervous system and build instant discipline.'
      },
      {
        name: 'Spine Align (Dandasana)',
        time: '2',
        desc: 'Sit straight on the floor with legs extended forward for 2 minutes to settle scattered thoughts and build core willpower.'
      }
    ],
    wisdomOptions: [
      { wis: '"Tapas (discipline) burns away impurities and unlocks the powers of body and mind."', src: 'Patanjali Yoga Sutras', ref: '— on willpower' },
      { wis: '"A person is disciplined when they have control over their senses and act with wisdom, not impulse."', src: 'Bhagavad Gita', ref: '— on consistency' }
    ]
  },
  gratitude: {
    msg: 'Gratitude chosen · acknowledging the abundance around you',
    emoji: '🌸',
    label: 'Gratitude',
    suggestedRituals: [
      {
        name: 'Contentment Smile (Santosha Smile)',
        time: '1',
        desc: 'Shift from FOMO to JOMO. Close your eyes, smile gently, and take 3 deep breaths while appreciating the present moment.'
      },
      {
        name: 'Earth Touch (Bhoomi Vandana)',
        time: '1',
        desc: 'Touch the ground with your palm to say thank you to the earth for carrying you and offering a safe foundation.'
      }
    ],
    wisdomOptions: [
      { wis: '"Contentment (Santosha) brings supreme joy and is the source of ultimate happiness."', src: 'Patanjali Yoga Sutras', ref: '— on contentment' },
      { wis: '"Let us be grateful to the earth that carries us, the water that sustains us, and the air that lets us breathe."', src: 'Rig Veda', ref: '— on appreciating abundance' }
    ]
  },
  jyoti: {
    key: 'jyoti',
    label: 'Jyoti (Clarity)',
    emoji: '🕯️',
    msg: 'Jyoti chosen · illumination, expansion, and positive action guide your waxing cycle.',
    suggestedRituals: [
      {
        name: 'Trataka Flame Focus',
        time: '3',
        desc: 'Stare at a single point or flame for 1 minute without blinking, then visualize it internally to build deep focus.'
      }
    ],
    wisdomOptions: [
      { wis: '"Lead me from darkness to light, from the unreal to the real."', src: 'Upanishads', ref: '— on seeking illumination' }
    ]
  },
  sadhana: {
    key: 'sadhana',
    label: 'Sadhana (Devotion)',
    emoji: '🕉️',
    msg: 'Sadhana chosen · structured daily devotion during the waxing moon.',
    suggestedRituals: [
      {
        name: 'Mantra Meditation',
        time: '3',
        desc: 'Silently repeat a sound that centers you (like Om or a positive word) 27 times, coordinating it gently with your breath.'
      }
    ],
    wisdomOptions: [
      { wis: '"Constant practice and detachment lead to the mastery of the mind."', src: 'Patanjali Yoga Sutras', ref: '— on discipline' }
    ]
  },
  visrama: {
    key: 'visrama',
    label: 'Visrama (Release)',
    emoji: '🍃',
    msg: 'Visrama chosen · gentle rest, release, and editing of mental clutter in the waning cycle.',
    suggestedRituals: [
      {
        name: 'Body Scan Savasana',
        time: '3',
        desc: 'Lie down or sit back. Move your attention slowly from your toes to the crown of your head, releasing tension.'
      }
    ],
    wisdomOptions: [
      { wis: '"By letting go, it all gets done. The world is won by those who let it go."', src: 'Ancient Wisdom', ref: '— on peaceful release' }
    ]
  },
  pratyahara: {
    key: 'pratyahara',
    label: 'Pratyahara (Inward)',
    emoji: '🕊️',
    msg: 'Pratyahara chosen · turning attention inward and quieting external noise.',
    suggestedRituals: [
      {
        name: 'Digital Detox Minute',
        time: '5',
        desc: 'Turn off all screens and put away all digital inputs. Spend 5 minutes listening to the quiet of your immediate environment.'
      }
    ],
    wisdomOptions: [
      { wis: '"When the senses are withdrawn from external objects, the mind rests in its source."', src: 'Upanishads', ref: '— on inner peace' }
    ]
  },
  purna: {
    key: 'purna',
    label: 'Purna (Abundance)',
    emoji: '🌕',
    msg: 'Purna chosen · peak lunar energy, celebration, and gratitude for abundance.',
    suggestedRituals: [
      {
        name: 'Gratitude Reflection',
        time: '2',
        desc: 'List three blessings in your life. Visualize them clearly and allow warmth to fill your heart.'
      }
    ],
    wisdomOptions: [
      { wis: '"This is whole, that is whole; from the whole, the whole arises. Take the whole from the whole, the whole remains."', src: 'Isha Upanishad', ref: '— on abundance' }
    ]
  },
  shunya: {
    key: 'shunya',
    label: 'Shunya (Reset)',
    emoji: '🌑',
    msg: 'Shunya chosen · cosmic reboot, silence, and letting go of all baggage.',
    suggestedRituals: [
      {
        name: 'Zero-pressure Breath',
        time: '3',
        desc: 'Sit quietly. Empty your mind of all goals or plans. Simply follow the natural flow of breath without attempting to control it.'
      }
    ],
    wisdomOptions: [
      { wis: '"In the center of the storm, there is a space of pure stillness and void. Rest there."', src: 'Vigyan Bhairav Tantra', ref: '— on pure awareness' }
    ]
  }
}

export function getLunarSankalpaSuggestions(date = new Date()) {
  const details = getHinduDetails(date)
  const { tithiNum, paksha, tithiName } = details
  const isShukla = paksha.includes('Shukla')
  
  if (tithiNum === 15) {
    if (isShukla) {
      return {
        suggestions: [SANKALPAS.purna, SANKALPAS.sadhana],
        context: `${tithiName} (${paksha})`
      }
    } else {
      return {
        suggestions: [SANKALPAS.shunya, SANKALPAS.visrama],
        context: `${tithiName} (${paksha})`
      }
    }
  }
  
  if (isShukla) {
    return {
      suggestions: [SANKALPAS.jyoti, SANKALPAS.sadhana],
      context: `${tithiName} (${paksha})`
    }
  } else {
    return {
      suggestions: [SANKALPAS.visrama, SANKALPAS.pratyahara],
      context: `${tithiName} (${paksha})`
    }
  }
}

export const getTodayRitual = (sankalpaObj) => {
  if (!sankalpaObj || !sankalpaObj.suggestedRituals) return null
  const day = new Date().getDate()
  const idx = day % sankalpaObj.suggestedRituals.length
  return sankalpaObj.suggestedRituals[idx]
}

export const DAILY_CHALLENGES = [
  { emoji: '✍️', text: 'Write 3 words that describe your mind right now', action: 'Open Journal' },
  { emoji: '💧', text: 'Drink a glass of water before your next thought spiral', action: 'Track Water' },
  { emoji: '🫁', text: 'Take 4 slow breaths — inhale for 4, exhale for 6', action: null },
  { emoji: '🌅', text: 'Name one thing that went right today, no matter how small', action: 'Open Journal' },
  { emoji: '📵', text: 'Put your phone face-down for the next 10 minutes', action: null },
  { emoji: '🪞', text: "Write one sentence you'd say to a friend who felt how you feel", action: 'Open Journal' },
  { emoji: '🌿', text: 'Step outside or open a window — just one minute of fresh air', action: null },
]

/**
 * Astronomical and Scientific Hindu Calendar (Panchang) Calculator
 * Matches Gregorian dates to Lunar Tithis, Nakshatras, and Moon Phases,
 * and provides scientific/astronomical explanations behind the calculations.
 */

// 14 Tithi Names for each Paksha (fortnight), plus Purnima & Amavasya
const TITHI_NAMES = [
  'Pratipada (1st)',
  'Dwitiya (2nd)',
  'Tritiya (3rd)',
  'Chaturthi (4th)',
  'Panchami (5th)',
  'Shashti (6th)',
  'Saptami (7th)',
  'Ashtami (8th)',
  'Navami (9th)',
  'Dashami (10th)',
  'Ekadashi (11th)',
  'Dwadashi (12th)',
  'Trayodashi (13th)',
  'Chaturdashi (14th)'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

/**
 * Calculates Tithi, Paksha, Nakshatra, and Moon details for a given date
 * @param {Date} date 
 */
export function getHinduDetails(date) {
  const d = new Date(date);
  
  // Astronomical baseline: Known New Moon (Amavasya End) on Jan 6, 2000 at 18:14 UTC
  const baseDate = new Date('2000-01-06T18:14:00Z');
  const diffMs = d.getTime() - baseDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  // Synodic Month (phase cycle): Average period is 29.530588853 days
  const synodicMonth = 29.530588853;
  const phaseValue = ((diffDays / synodicMonth) % 1 + 1) % 1; // Normalized 0-1 range
  
  // The 360° moon-sun longitudinal separation is divided into 30 Tithis of 12° each
  const rawTithi = phaseValue * 30;
  const tithiIndex = Math.floor(rawTithi) + 1; // 1 to 30
  
  const isShukla = tithiIndex <= 15;
  const paksha = isShukla ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)';
  
  // Get tithi number within fortnight (1 to 14, then 15 is either Purnima or Amavasya)
  const tithiNum = tithiIndex > 15 ? tithiIndex - 15 : tithiIndex;
  
  let tithiName = '';
  let tithiEmoji = '🪷';
  if (tithiNum === 15) {
    if (isShukla) {
      tithiName = 'Purnima (Full Moon)';
      tithiEmoji = '🌕';
    } else {
      tithiName = 'Amavasya (New Moon)';
      tithiEmoji = '🌑';
    }
  } else {
    tithiName = TITHI_NAMES[tithiNum - 1];
    tithiEmoji = isShukla ? '🌙' : '🌘';
  }
  
  // Sidereal Month (star cycle): Period relative to distant stars is ~27.321661 days
  const siderealMonth = 27.321661;
  const nakshatraValue = ((diffDays / siderealMonth) % 1 + 1) % 1;
  const nakshatraIndex = Math.floor(nakshatraValue * 27);
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Moon phase Unicode symbol
  let moonSymbol = '🌑';
  if (phaseValue < 0.02 || phaseValue > 0.98) moonSymbol = '🌑';
  else if (phaseValue < 0.23) moonSymbol = '🌒';
  else if (phaseValue < 0.27) moonSymbol = '🌓';
  else if (phaseValue < 0.48) moonSymbol = '🌔';
  else if (phaseValue < 0.52) moonSymbol = '🌕';
  else if (phaseValue < 0.73) moonSymbol = '🌖';
  else if (phaseValue < 0.77) moonSymbol = '🌗';
  else moonSymbol = '🌘';

  return {
    tithiIndex,
    tithiNum,
    tithiName,
    tithiEmoji,
    paksha,
    nakshatra,
    moonSymbol,
    phasePercent: Math.round(phaseValue * 100),
  };
}

/**
 * Returns Gen Z-coded mind-blowing lunar science facts that make you go "whoa"
 */
export function getScientificInsights() {
  return [
    {
      title: '🌙 The Moon Is Doing MATH Every Second',
      desc: 'A tithi isn\'t some ancient buzzword. It\'s literally the Moon moving exactly 12° away from the Sun — tracked across a perfect 360° celestial circle. Ancient Indians were basically running astronomical geometry before calculators existed. They turned the sky into a calendar.',
      icon: '🌙',
      stat: '12° precision',
      vibe: 'The sky had better algorithms than your favorite app.',
      tryThis: 'Step outside tonight. Look up. Ask: is this a build-up day or a release day for me?'
    },
    {
      title: '🌊 Your Body Is Literally Ocean Energy',
      desc: 'The Moon controls Earth\'s tides. You are ~60% water. That means YOU have lunar tides flowing through your cells every single day — affecting your mood, sleep, hunger, focus. Ancient calendars weren\'t being \"spiritual.\" They were tracking BIOLOGY.',
      icon: '🌊',
      stat: '60% water = moon-powered',
      vibe: 'Your chaotic energy days finally make sense.',
      tryThis: 'Feeling off? Don\'t force a hero routine. Match the moon\'s energy, not society\'s hustle.'
    },
    {
      title: '✨ There\'s a STAR MAP Hidden in Your Day',
      desc: 'Every day the Moon crosses one of 27 nakshatras — ancient star zones that were basically cosmic GPS coordinates. Farmers, travelers, and ritual-makers used them like we use Google Maps, but written in starlight.',
      icon: '✨',
      stat: '27 sky zones',
      vibe: 'People had a grid system in the sky before we had smartphones.',
      tryThis: 'Treat today\'s nakshatra like a subtle mood filter, not a strict destiny reading.'
    },
    {
      title: '🌓 Even the Moon Doesn\'t Grind 24/7',
      desc: 'Shukla Paksha (waxing) = growth mode: start things, feel clarity, expand energy. Krishna Paksha (waning) = edit mode: cut clutter, rest, release. Two weeks each. The universe literally built a brake pedal into time.',
      icon: '🌓',
      stat: '15 days ON / 15 days OFF',
      vibe: 'The Moon takes rest weeks. Why don\'t you?',
      tryThis: 'Waxing = start something new. Waning = delete something draining.'
    },
    {
      title: '🌕 Purnima Hits DIFFERENT and Science Knows Why',
      desc: 'Full moon = maximum brightness + maximum emotional charge. Humans across every culture sensed it: gathered, sang, prayed, stayed up late. The night feels ELECTRIC. Not a myth — just lunar physics affecting human vibe.',
      icon: '🌕',
      stat: 'Peak lunar energy',
      vibe: 'Main character energy, but make it sacred.',
      tryThis: 'On full moons: journal hard, speak your truth, release what you\'ve been holding in.'
    },
    {
      title: '🌑 Amavasya Is a FREE Reset Button',
      desc: 'New moon = the Moon is hiding next to the Sun, so we see nothing. Ancient wisdom said: good. Use this dark slot as a SYSTEM RESET. No performance. No pressure. Just clearing cache and listening to the quiet.',
      icon: '🌑',
      stat: 'Cosmic reboot',
      vibe: 'Sometimes the most productive thing is being unproductive.',
      tryThis: 'Delete one mental tab today: a grudge, a guilt, a "should." Just let it go.'
    },
    {
      title: '🕯️ You Have TWO Body Clocks, Not One',
      desc: 'You know circadian rhythm (your 24-hour cycle). But ancient calendars stacked another layer: the lunar rhythm (~29.5 days). Together they don\'t ask "why aren\'t you consistent?" They ask "WHAT CYCLE ARE YOU IN?"',
      icon: '🕯️',
      stat: 'Daily + monthly = dual rhythm',
      vibe: 'You\'re not broken. You\'re just in a different phase.',
      tryThis: 'Notice your patterns: which moon phase makes you social? sleepy? focused? reflective?'
    },
    {
      title: '🔥 Rituals Turn Time Into a FEELING',
      desc: 'Why do Ekadashi, Purnima, and daily sadhana work so well? Because repeating an action on a meaningful date makes time STICKY emotionally. Your brain remembers a ritual way better than a random Tuesday.',
      icon: '🔥',
      stat: 'Emotional time-stamping',
      vibe: 'A streak with a story hits way harder than a streak with just numbers.',
      tryThis: 'Link one habit to the moon: journal on Purnima, declutter on Amavasya, dream on new moon.'
    }
  ];
}

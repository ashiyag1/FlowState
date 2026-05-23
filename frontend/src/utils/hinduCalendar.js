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
 * Returns detailed insights explaining the genius of ancient Rishis in creating the Hindu Calendar
 */
export function getScientificInsights() {
  return [
    {
      title: 'Rishi Precision: The 12° Divine Measure',
      desc: 'Centuries before any telescope, the Rishis divided the Moon\'s path into 30 Tithis of exactly 12° each — a precision modern astronomy only confirmed after Kepler\'s laws. Using only naked-eye observation and pure mathematics, they calculated the synodic month to an accuracy of 29.530588 days, matching today\'s atomic-clock measurements. This was not guesswork — it was the fruit of deep yogic insight into the cosmic order.',
      icon: '🕉️'
    },
    {
      title: 'Yogic Gaze: The Rishis Knew the Body-Moon Connection',
      desc: 'Long before modern chronobiology discovered melatonin fluctuations with lunar phases, the Rishis prescribed Ekadashi fasting, Purnima meditations, and Amavasya rituals perfectly aligned with the Moon\'s gravitational cycle. They understood that a 60%-water human body dances with the tides just as the oceans do. The Panchang is not just a calendar — it is a manual for living in harmony with cosmic rhythms.',
      icon: '🧘'
    },
    {
      title: 'Nakshatras: The Rishis\' Celestial Map of Consciousness',
      desc: 'The Rishis mapped the night sky into 27 Nakshatras (13°20\' each), matching the Moon\'s 27.32-day sidereal orbit — a feat requiring generations of precise observation without any instrument. Each Nakshatra was given a name, a deity, and a quality that influences human consciousness. This shows the Rishis understood that the stars are not just distant suns but markers of energy that shape life on Earth.',
      icon: '🌟'
    },
    {
      title: 'Paksha: Nature\'s Breath as the Rishis Saw It',
      desc: 'The Rishis framed time as a living rhythm — Shukla (waxing) and Krishna (waning) are not just lunar phases but the inhalation and exhalation of the cosmos. They prescribed different rituals, foods, and practices for each Paksha, recognizing that the body\'s metabolism, mood, and spiritual receptivity shift with the lunar tide. This is not folk belief — it is an intuitive, experiential science verified by millennia of practice.',
      icon: '🌗'
    }
  ];
}

import morningBg from '../../assets/hero/morningBg.webp'
import afternoonBg from '../../assets/hero/afternoonBg.webp'
import eveningBg from '../../assets/hero/eveningBg.webp'
import nightBg from '../../assets/hero/nightBg.webp'

export function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'evening'
  return 'night'
}

export const TIME_CONFIG = {
  morning: {
    bgImage:       morningBg,
    skyGradient:   'linear-gradient(180deg, rgba(253,211,77,0.42) 0%, rgba(232,119,34,0.55) 28%, rgba(252,176,100,0.30) 60%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.48) 0%, rgba(232,119,34,0.22) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(12,5,1,0.65) 0%, transparent 100%)',
    tagline:       '✦ your morning sanctuary ✦',
    badge:         'जल ही जीवन है',
    petalColors:   ['#D4607A', '#E87722', '#c9a84c'],
    stars: false,
    birds: true,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#C9933A',
    heading1:      'the alarms can wait.',
    heading2:      'no performance here.',
    heading3:      'just take a breath.',
    subheading:    'Close the inbox, mute the notifications, and start the day at your own pace.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
  afternoon: {
    bgImage:       afternoonBg,
    skyGradient:   'linear-gradient(180deg, rgba(56,189,248,0.38) 0%, rgba(125,211,252,0.28) 35%, rgba(186,230,253,0.18) 65%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.48) 0%, rgba(232,119,34,0.22) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(8,30,50,0.45) 0%, transparent 100%)',
    tagline:       '✦ your afternoon pause ✦',
    badge:         'मन शांत, तन स्वस्थ',
    petalColors:   ['#60a5fa', '#e8c97a', '#7dd3fc'],
    stars: false,
    birds: false,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#E8B96A',
    heading1:      'unplug the screen.',
    heading2:      'hustle guilt is fake.',
    heading3:      'ground your thoughts.',
    subheading:    'You’ve been staring at that window for hours. Close the laptop lid, stretch, and let your brain reset.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
  evening: {
    bgImage:       eveningBg,
    skyGradient:   'linear-gradient(180deg, rgba(124,58,237,0.50) 0%, rgba(194,65,12,0.55) 30%, rgba(234,88,12,0.45) 55%, rgba(251,191,36,0.28) 80%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 5%, rgba(249,115,22,0.52) 0%, rgba(124,58,237,0.28) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(20,5,30,0.70) 0%, transparent 100%)',
    tagline:       '✦ your evening unwind ✦',
    badge:         'शाम का सुकून',
    petalColors:   ['#f472b6', '#fb923c', '#a78bfa'],
    stars: false,
    birds: true,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#E87722',
    heading1:      'the work day is over.',
    heading2:      'you did enough today.',
    heading3:      'drop the productivity guilt.',
    subheading:    'Log off. You are not defined by how much you got done. Just exist here for a moment.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
  night: {
    bgImage:       nightBg,
    skyGradient:   'linear-gradient(180deg, rgba(15,23,42,0.78) 0%, rgba(30,27,75,0.72) 40%, rgba(49,46,129,0.50) 70%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 3%, rgba(165,180,252,0.38) 0%, rgba(99,102,241,0.20) 30%, transparent 55%)',
    sideVignette:  'linear-gradient(90deg, rgba(5,2,20,0.80) 0%, transparent 100%)',
    tagline:       '✦ your night refuge ✦',
    badge:         'रात की शांति',
    petalColors:   ['#a78bfa', '#818cf8', '#c4b5fd'],
    stars: true,
    birds: false,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#818CF8',
    heading1:      'close the tabs.',
    heading2:      'burnout isn\'t worth it.',
    heading3:      'go offline.',
    subheading:    'Turn off the alarms for a second, ignore the deadlines, and rest. You can figure it out tomorrow.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
}

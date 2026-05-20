export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Lexend', 'sans-serif'],
        devanagari: ['"Noto Serif Devanagari"', 'serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg,#1B4FA8 0%,#2E69D6 50%,#6FA3F0 100%)',
        'sunrise-gradient': 'linear-gradient(135deg,#E8622A 0%,#F4925A 45%,#C9933A 100%)',
        'ivory-glow': 'radial-gradient(circle at top left,#fff8ef,#FBF6EE,#F2E9D8)',
        'heritage-pattern': "url('/patterns/mandala.svg')",
      },      
      colors: {
        saffron: { DEFAULT: '#E8622A', lt: '#F4925A', pale: '#FDF0E8', dark: '#B84A18' },
        gold:    { DEFAULT: '#C9933A', lt: '#E8B96A', pale: '#FBF4E4', dark: '#9A6E20' },
        royal:   { DEFAULT: '#1B4FA8', mid: '#2E69D6', lt: '#6FA3F0', pale: '#EAF0FB' },
        emerald: { DEFAULT: '#1A7A4E', mid: '#2DA06A', lt: '#6DC49A', pale: '#E8F7EF' },
        ivory:   { DEFAULT: '#FBF6EE', dark: '#F2E9D8', darker: '#E5D9C0' },
        ink:     { DEFAULT: '#1C1208', soft: '#3D2E1A' },
        ocean:   { DEFAULT: '#0C447C', lt: '#3a8ab5', pale: '#c8e0f0', dark: '#082a4a' },
        sand:    { DEFAULT: '#c9a87c', lt: '#e0c9a0', pale: '#f0e0c8', dark: '#8a6a40' },
        mist:    { DEFAULT: '#b8c8d8', dark: '#708090' },
      },
      animation: {
        'bob':       'bob 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'fade-up':   'fadeUp 0.65s ease forwards',
        'glow':      'glow 2s ease-in-out infinite',
      },
      keyframes: {
        bob:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        fadeUp:   { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'none' } },
        glow:     { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
      },
      boxShadow: {
        'soft':          '0 2px 12px rgba(28,18,8,0.07)',
        'card':          '0 6px 28px rgba(28,18,8,0.10)',
        'xl-soft':       '0 16px 56px rgba(28,18,8,0.14)',
        'glow-saffron':  '0 8px 32px rgba(232,98,42,0.28)',
        'glow-gold':     '0 8px 32px rgba(201,147,58,0.22)',
      },
      borderRadius: {
        '2xl': '20px', '3xl': '28px', '4xl': '40px',
      },
    },
  },
  plugins: [],
}

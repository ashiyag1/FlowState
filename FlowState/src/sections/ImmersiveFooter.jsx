import { useTheme } from '../context/ThemeContext'
import DiyaLamp from '../icons/DiyaLamp'

export default function ImmersiveFooter() {
  const { dark } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer style={{
      padding: '0.75rem 1.5rem',
      position: 'relative',
      textAlign: 'center',
      background: dark
        ? 'linear-gradient(180deg, rgba(26,18,8,0.96), rgba(36,26,12,0.99))'
        : 'linear-gradient(180deg, #D4B880, #C9AC70)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1rem', flexWrap: 'wrap',
        maxWidth: 800, margin: '0 auto',
      }}>
        <DiyaLamp size={24} />

        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.82rem', fontWeight: 500,
          color: 'var(--bark)', letterSpacing: '0.04em',
        }}>
          Tarang·FlowState
        </span>

        <span style={{
          width: 1, height: 14,
          background: 'rgba(139,105,20,0.15)',
        }} />

        <span style={{
          fontFamily: "'Lora', serif", fontStyle: 'italic',
          fontSize: '0.68rem', color: 'var(--bark-lt)',
        }}>
          Flow with Ashiya — Transform ancient wisdom into modern consistency
        </span>

        <span style={{
          width: 1, height: 14,
          background: 'rgba(139,105,20,0.15)',
        }} />

        <span style={{
          fontSize: '0.62rem', color: 'var(--gold-dim)',
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        }}>
          स्वस्थस्य स्वास्थ्यं
        </span>

        <span style={{
          width: 1, height: 14,
          background: 'rgba(139,105,20,0.15)',
        }} />

        <span style={{
          fontSize: '0.58rem', color: 'var(--bark-lt)',
          fontFamily: "'Lora', serif",
        }}>
          Made with <span style={{ color: 'var(--lotus)' }}>♥</span> by Ashiya
        </span>

        <span style={{
          width: 1, height: 14,
          background: 'rgba(139,105,20,0.15)',
        }} />

        <span style={{
          fontSize: '0.5rem', color: 'rgba(92,61,30,0.35)',
          fontFamily: "'Cinzel', serif", letterSpacing: '0.12em',
        }}>
          © {year} FLOWSTATE · MADE IN INDIA
        </span>
      </div>
    </footer>
  )
}

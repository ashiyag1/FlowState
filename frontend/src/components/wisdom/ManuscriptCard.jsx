import pageBg from '../../assets/page.webp'
import { useTheme } from '../../context/ThemeContext'

export default function ManuscriptCard({ children }) {
  const { dark } = useTheme()
  const accentColor = dark ? 'rgba(201, 168, 76, 0.45)' : 'rgba(139, 111, 76, 0.45)'

  return (
    <div className="w-full relative">
      <div 
        className="relative w-full rounded-2xl overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-center aspect-[2.5/1] sm:aspect-[4/1] md:aspect-[5/1]"
        style={{
          borderColor: dark ? 'rgba(201, 168, 76, 0.18)' : 'rgba(201, 168, 76, 0.10)',
        }}
      >
        {/* Parchment background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${pageBg})`,
            opacity: dark ? 0.85 : 1,
            filter: dark ? 'sepia(0.3) brightness(0.65) contrast(1.15)' : 'none',
          }}
        />
        
        {/* Inner dashed boundary box */}
        <div 
          className="absolute inset-2.5 sm:inset-3 border border-dashed rounded-xl pointer-events-none"
          style={{
            borderColor: dark ? 'rgba(201, 168, 76, 0.22)' : 'rgba(139, 111, 76, 0.25)',
          }}
        />

        {/* Ornate corner marks */}
        <svg style={{ position: 'absolute', top: '10px', left: '10px', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M0 0h16v2H2v14H0V0z" fill={accentColor} />
          <circle cx="5" cy="5" r="1.5" fill={accentColor} />
        </svg>
        <svg style={{ position: 'absolute', top: '10px', right: '10px', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M16 0H0v2h14v14h2V0z" fill={accentColor} />
          <circle cx="11" cy="5" r="1.5" fill={accentColor} />
        </svg>
        <svg style={{ position: 'absolute', bottom: '10px', left: '10px', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M0 16h16v-2H2V0H0v16z" fill={accentColor} />
          <circle cx="5" cy="11" r="1.5" fill={accentColor} />
        </svg>
        <svg style={{ position: 'absolute', bottom: '10px', right: '10px', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M16 16H0v-2h14V0h2v16z" fill={accentColor} />
          <circle cx="11" cy="11" r="1.5" fill={accentColor} />
        </svg>

        {/* Inner Content wrapper */}
        <div className="relative w-full h-full flex items-center justify-between px-6 sm:px-8 md:px-12 py-2 box-border gap-4 select-none">
          {children}
        </div>
      </div>
    </div>
  )
}
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider, useAuth }    from './context/AuthContext'
import { WellnessProvider } from './context/WellnessContext'
import { AchievementsProvider } from './context/AchievementsContext'
import { WisdomProvider } from './context/WisdomContext'
import { SoundEffectsProvider } from './context/SoundEffectsContext'
import { NotificationProvider } from './components/system/NotificationPopup'
import Navbar  from './components/ui/Navbar'
import BadgeModal from './components/achievements/BadgeModal'
import BadgeGallery from './components/achievements/BadgeGallery'
import BadgeToast from './components/achievements/BadgeToast'
import RetentionNudge from './components/system/RetentionNudge'
import PwaInstallBanner from './components/system/PwaInstallBanner'
import { motion } from 'framer-motion'
import PwaSplash from './pwa/PwaSplash'
import PwaNavbar from './pwa/PwaNavbar'
import './styles/globals.css'
import './styles/animations.css'
import './styles/dashboard.css'
import './styles/cards.css'
import './styles/wisdom.css'
import './pwa/pwa-layout.css'

/* Atmospheric fade-in loading state with a breathing golden lotus symbol */
function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(201,168,76,0.2)',
        animation: 'breatheLoader 3s ease-in-out infinite',
        position: 'relative'
      }}>
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2 L23 11 C26 15 26 21 21 26 C18 29 14 29 11 26 C6 21 6 15 9 11 Z" stroke="#c9933a" strokeWidth="0.8" fill="none"/>
          <path d="M16 6 L20 12 C22 15 22 19 19 22 C17 24 15 24 13 22 C10 19 10 15 12 12 Z" fill="#c9933a" opacity="0.6"/>
          <circle cx="16" cy="16" r="2.5" fill="#c9933a" />
        </svg>
      </div>
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '9px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#c9933a',
        opacity: 0.8
      }}>Returning to stillness...</div>
      <style>{`
        @keyframes breatheLoader {
          0%, 100% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </motion.div>
  )
}

const Home        = lazy(() => import('./pages/Home'))
const Habits      = lazy(() => import('./pages/Habits'))
const Journal     = lazy(() => import('./pages/Journal'))
const WisdomPage  = lazy(() => import('./pages/WisdomPage'))
const Heritage    = lazy(() => import('./pages/Heritage'))
const Login       = lazy(() => import('./pages/Login'))
const AIAssistant = lazy(() => import('./components/system/AIAssistant'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const Resources   = lazy(() => import('./pages/Resources'))


function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function AppContent() {
  const { loading } = useAuth()
  const [showPwaSplash, setShowPwaSplash] = useState(() => {
    const isMobileOrPwa = window.innerWidth < 768 || window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    return isMobileOrPwa && sessionStorage.getItem('pwa_splash_shown') !== 'true';
  })
  
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PageLoader />
      </div>
    )
  }

  if (showPwaSplash) {
    return (
      <PwaSplash
        onComplete={() => {
          sessionStorage.setItem('pwa_splash_shown', 'true')
          setShowPwaSplash(false)
        }}
      />
    )
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollReset />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/habits"  element={<Habits />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/quotes"  element={<WisdomPage />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*"        element={<Home />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}><AIAssistant /></Suspense>
      <PwaNavbar />
      <BadgeModal />
      <BadgeGallery />
      <BadgeToast />
      <RetentionNudge />
      <PwaInstallBanner />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <WellnessProvider>
            <WisdomProvider>
              <AchievementsProvider>
                <SoundEffectsProvider>
                  <AppContent />
                </SoundEffectsProvider>
              </AchievementsProvider>
            </WisdomProvider>
          </WellnessProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

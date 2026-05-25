import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider }    from './context/AuthContext'
import { WellnessProvider } from './context/WellnessContext'
import { AchievementsProvider } from './context/AchievementsContext'
import { SoundEffectsProvider } from './context/SoundEffectsContext'
import { NotificationProvider } from './components/NotificationPopup'
import Navbar  from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import BadgeModal from './components/achievements/BadgeModal'
import BadgeGallery from './components/achievements/BadgeGallery'
import BadgeToast from './components/achievements/BadgeToast'
import RetentionNudge from './components/RetentionNudge'
import './styles/globals.css'
import './styles/animations.css'
import './styles/dashboard.css'
import './styles/cards.css'
import './styles/wisdom.css'

/* Lightweight shimmer shown while a lazy page chunk is loading */
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2.5px solid rgba(201, 147, 58, 0.18)',
        borderTopColor: '#c9933a',
        animation: 'spin 0.7s linear infinite',
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const Home        = lazy(() => import('./pages/Home'))
const Water       = lazy(() => import('./pages/Water'))
const Habits      = lazy(() => import('./pages/Habits'))
const Journal     = lazy(() => import('./pages/Journal'))
const WisdomPage  = lazy(() => import('./pages/WisdomPage'))
const Heritage    = lazy(() => import('./pages/Heritage'))
const Community   = lazy(() => import('./pages/Community'))
const Login       = lazy(() => import('./pages/Login'))
const AIAssistant = lazy(() => import('./components/AIAssistant'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <WellnessProvider>
            <AchievementsProvider>
              <SoundEffectsProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <ScrollReset />
                  <Navbar />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/"        element={<Home />} />
                      <Route path="/water"   element={<Water />} />
                      <Route path="/habits"  element={<Habits />} />
                      <Route path="/journal" element={<Journal />} />
                      <Route path="/quotes"  element={<WisdomPage />} />
                      <Route path="/heritage" element={<Heritage />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/login"   element={<Login />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*"        element={<Home />} />
                    </Routes>
                  </Suspense>
                  <Suspense fallback={null}><AIAssistant /></Suspense>
                  <BadgeModal />
                  <BadgeGallery />
                  <BadgeToast />
                  <RetentionNudge />
                </BrowserRouter>
              </SoundEffectsProvider>
            </AchievementsProvider>
          </WellnessProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

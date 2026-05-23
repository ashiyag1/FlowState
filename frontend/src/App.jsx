import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ThemeProvider }   from './context/ThemeContext'
import { AuthProvider }    from './context/AuthContext'
import { WellnessProvider } from './context/WellnessContext'
import { SoundEffectsProvider } from './context/SoundEffectsContext'
import { NotificationProvider } from './components/NotificationPopup'
import Navbar  from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/globals.css'
import './styles/animations.css'
import './styles/dashboard.css'
import './styles/cards.css'
import './styles/wisdom.css'

const Home        = lazy(() => import('./pages/Home'))
const Water       = lazy(() => import('./pages/Water'))
const Habits      = lazy(() => import('./pages/Habits'))
const Journal     = lazy(() => import('./pages/Journal'))
const WisdomPage  = lazy(() => import('./pages/WisdomPage'))
const Heritage    = lazy(() => import('./pages/Heritage'))
const Community   = lazy(() => import('./pages/Community'))
const Login       = lazy(() => import('./pages/Login'))
const AIAssistant = lazy(() => import('./components/AIAssistant'))

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
            <SoundEffectsProvider>
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ScrollReset />
                <Navbar />
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/"        element={<Home />} />
                    <Route path="/water"   element={<Water />} />
                    <Route path="/habits"  element={<Habits />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/quotes"  element={<WisdomPage />} />
                    <Route path="/heritage" element={<Heritage />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/login"   element={<Login />} />
                    <Route path="*"        element={<Home />} />
                  </Routes>
                </Suspense>
                <Suspense fallback={null}><AIAssistant /></Suspense>
              </BrowserRouter>
            </SoundEffectsProvider>
          </WellnessProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider }   from './context/ThemeContext'
import { WellnessProvider } from './context/WellnessContext'
import { SoundEffectsProvider } from './context/SoundEffectsContext'
import { NotificationProvider } from './components/NotificationPopup'
import Navbar  from './components/Navbar'
import Home    from './pages/Home'
import Water   from './pages/Water'
import Habits  from './pages/Habits'
import Journal from './pages/Journal'
import WisdomPage from './pages/WisdomPage'
import Login   from './pages/Login'
import AIAssistant from './components/AIAssistant'
import './styles/globals.css'
import './styles/animations.css'
import './styles/dashboard.css'
import './styles/cards.css'
import './styles/wisdom.css'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WellnessProvider>
          <SoundEffectsProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollReset />
              <Navbar />
              <Routes>
                <Route path="/"        element={<Home />} />
                <Route path="/water"   element={<Water />} />
                <Route path="/habits"  element={<Habits />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/quotes"  element={<WisdomPage />} />
                <Route path="/login"   element={<Login />} />
                <Route path="*"        element={<Home />} />
              </Routes>
              <AIAssistant />
            </BrowserRouter>
          </SoundEffectsProvider>
        </WellnessProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

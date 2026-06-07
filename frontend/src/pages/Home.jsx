import React from 'react'
import PageLayout from '../components/ui/PageLayout'
import TopBorder from '../components/ui/TopBorder'
import HeroSection from '../sections/HeroSection'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import FounderLetterModal from '../components/ui/FounderLetterModal'

// Extracted Subcomponents
import SacredWatermark from '../components/dashboard/SacredWatermark'
import DailyPillars from '../components/dashboard/DailyPillars'
import ActiveSadhanaPlayer from '../components/dashboard/ActiveSadhanaPlayer'
import SankalpaSelector from '../components/dashboard/SankalpaSelector'
import SoundSanctuaryPanel from '../components/dashboard/SoundSanctuaryPanel'
import LevelUpModal from '../components/dashboard/LevelUpModal'
import FounderLetterCard from '../components/dashboard/FounderLetterCard'
import HeritageCard from '../components/dashboard/HeritageCard'
import WisdomScrollSection from '../components/dashboard/WisdomScrollSection'

import { useHomeData } from '../hooks/useHomeData'
import { useWellness } from '../context/WellnessContext'
import miniHeroSeeker from '../assets/mini_hero_seeker.png'
import miniHeroPractitioner from '../assets/mini_hero_practitioner.png'
import miniHeroHarmonist from '../assets/mini_hero_harmonist.png'
import miniHeroSage from '../assets/mini_hero_sage.png'
import miniHeroLiberated from '../assets/mini_hero_liberated.png'
import { computeArchetype } from '../utils/soulArchetype'
import { useTheme } from '../context/ThemeContext'
import NotificationsButton from '../components/system/NotificationsButton'

export default function Home() {
  const {
    dark,
    todayTotal,
    waterGoal,
    user,
    updateProfile,
    activeSound,
    soundPanelOpen,
    setSoundPanelOpen,
    handleToggleSound,
    isMuted,
    toggleMute,
    ritualDone,
    activePractice,
    timerSeconds,
    handleBeginActivePractice,
    handleCompleteActivePractice,
    cancelPractice,
    handleTogglePractice,
    userName,
    navigate,
    letterOpen,
    setLetterOpen,
    hasReadLetter,
    setHasReadLetter,
    sankalpaPanelOpen,
    setSankalpaPanelOpen,
    wisdomRead,
    selectedSankalpa,
    levelUpLevel,
    showLevelUp,
    setShowLevelUp,
    viewMode,
    isReflectionTime,
    reflection,
    isNight,
    waterGoalMet,
    habitStreak,
    journalToday,
    currentSankalpa,
    todayRitual,
    handleSetSankalpa,
    handleGenerateSankalpa,
    handleReadWisdom,
    handleLogWater,
    handleToggleJournal,
    handleToggleWisdom,
    dynamicBackgroundStyle,
    containerStyle,
    glassCardStyle,
    secLabelStyle
  } = useHomeData()

  const { getWaterStreak, getJournalStreak, getWisdomStreak, journal } = useWellness()
  const waterStreak = getWaterStreak ? getWaterStreak() : 0
  const journalStreak = getJournalStreak ? getJournalStreak() : 0
  const wisdomStreak = getWisdomStreak ? getWisdomStreak() : 0

  const { archetype } = React.useMemo(() => computeArchetype(journal), [journal])
  const archetypeLabel = archetype?.id || 'Seeker'

  const { dark: themeDark, toggle: toggleTheme } = useTheme()
  const pranaPoints = user?.pranaPoints || 0

  // Prana Tiers Configuration for Home Header (makes it brighter and dynamically colored)
  const pranaTier = React.useMemo(() => {
    const tiers = [
      { 
        threshold: 0, 
        title: "Seeker (Arambha)", 
        image: miniHeroSeeker,
        cardBgDark: '#2d1f0e',
        cardBgLight: '#fef8eb',
        gradientDark: 'linear-gradient(180deg, rgba(45, 31, 14, 0.1) 0%, rgba(45, 31, 14, 0.5) 100%)',
        gradientLight: 'linear-gradient(180deg, rgba(254, 248, 235, 0.05) 0%, rgba(254, 248, 235, 0.4) 100%)',
        opacity: 0.7 
      },
      { 
        threshold: 50, 
        title: "Practitioner (Sadhaka)", 
        image: miniHeroPractitioner,
        cardBgDark: '#3a1c0d',
        cardBgLight: '#fdf3e5',
        gradientDark: 'linear-gradient(180deg, rgba(232, 98, 42, 0.08) 0%, rgba(58, 28, 13, 0.5) 100%)',
        gradientLight: 'linear-gradient(180deg, rgba(253, 243, 229, 0.05) 0%, rgba(253, 243, 229, 0.4) 100%)',
        opacity: 0.75 
      },
      { 
        threshold: 100, 
        title: "Harmonist (Yogi/Yogini)", 
        image: miniHeroHarmonist,
        cardBgDark: '#0e2a1d',
        cardBgLight: '#f3fcf6',
        gradientDark: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 42, 29, 0.5) 100%)',
        gradientLight: 'linear-gradient(180deg, rgba(243, 252, 246, 0.05) 0%, rgba(243, 252, 246, 0.4) 100%)',
        opacity: 0.75 
      },
      { 
        threshold: 150, 
        title: "Visionary Sage (Rishi/Rishika)", 
        image: miniHeroSage,
        cardBgDark: '#200f35',
        cardBgLight: '#f9f4fc',
        gradientDark: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(32, 15, 53, 0.55) 100%)',
        gradientLight: 'linear-gradient(180deg, rgba(249, 244, 252, 0.05) 0%, rgba(249, 244, 252, 0.4) 100%)',
        opacity: 0.8 
      },
      { 
        threshold: 200, 
        title: "Liberated Spirit (Jivanmukta)", 
        image: miniHeroLiberated,
        cardBgDark: '#3a2505',
        cardBgLight: '#fffbf0',
        gradientDark: 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(58, 37, 5, 0.5) 100%)',
        gradientLight: 'linear-gradient(180deg, rgba(255, 251, 240, 0.05) 0%, rgba(255, 251, 240, 0.4) 100%)',
        opacity: 0.85 
      }
    ]
    let active = tiers[0]
    for (const t of tiers) {
      if (pranaPoints >= t.threshold) {
        active = t
      }
    }
    return active
  }, [pranaPoints])

  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 20 ? 'Good evening' : 'Good night'

  return (
    <>
      <HeroSection viewMode={viewMode} reflection={reflection} />
      <TopBorder />
      <PageLayout>
        <main style={{ position: 'relative', background: dynamicBackgroundStyle, minHeight: '100vh' }}>

          {/* Drifting Sacred Sparkles and Watermark */}
          <SacredWatermark dark={dark} isNight={isNight} />

          {/* Page Body Container */}
          <div className="dashboard-container" style={containerStyle}>
            
            {/* MOBILE PRODUCTIVITY DASHBOARD HEADER */}
            <div className="mobile-dashboard-header md:hidden" style={{
              position: 'relative',
              borderRadius: '0 0 24px 24px',
              overflow: 'hidden',
              padding: '16px 20px',
              marginBottom: '16px',
              boxShadow: themeDark ? '0 12px 32px rgba(0, 0, 0, 0.5)' : '0 12px 32px rgba(139, 105, 20, 0.12)',
              borderBottom: themeDark ? '1px solid rgba(200, 169, 110, 0.25)' : '1px solid rgba(200, 169, 110, 0.35)',
              background: themeDark ? pranaTier.cardBgDark : pranaTier.cardBgLight,
              height: '115px',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.3s ease',
            }}>
              {/* Authentic photographic India heritage background */}
              <img 
                src={pranaTier.image} 
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: pranaTier.opacity,
                  mixBlendMode: themeDark ? 'normal' : 'multiply',
                  transition: 'opacity 0.3s ease',
                }}
              />
              {/* Semi-transparent dark vignette layer with dynamic prana tier color */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: themeDark ? pranaTier.gradientDark : pranaTier.gradientLight,
                zIndex: 1,
                transition: 'background 0.3s ease',
              }} />
              
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                {/* Greeting text */}
                <div>
                  <p style={{
                    fontSize: '10px',
                    color: themeDark ? '#ffeab8' : '#8b5e2f',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: 0,
                    fontWeight: 700,
                    fontFamily: "'Lexend', sans-serif"
                  }}>
                    {greeting}
                  </p>
                  <h1 
                    onClick={() => navigate('/profile')}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '26px',
                      fontWeight: 700,
                      color: themeDark ? '#fffaf0' : '#3c2005',
                      margin: '3px 0 0 0',
                      textShadow: themeDark ? '0 2px 6px rgba(0,0,0,0.6)' : '0 1px 4px rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffeab8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = themeDark ? '#fffaf0' : '#3c2005'}
                    title="Click to view profile"
                  >
                    {userName || 'Seeker'}
                  </h1>
                  
                  {/* Archetype badge (Displaying Prana Tier) */}
                  <div 
                    onClick={() => navigate('/profile')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: themeDark ? 'rgba(200, 169, 110, 0.25)' : 'rgba(200, 169, 110, 0.15)',
                      border: themeDark ? '0.5px solid rgba(200, 169, 110, 0.45)' : '0.5px solid rgba(200, 169, 110, 0.35)',
                      borderRadius: '99px',
                      padding: '3px 8px',
                      fontSize: '9px',
                      color: themeDark ? '#ffeab8' : '#6b4c12',
                      marginTop: '8px',
                      fontFamily: "'Lexend', sans-serif",
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = themeDark ? 'rgba(200, 169, 110, 0.4)' : 'rgba(200, 169, 110, 0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = themeDark ? 'rgba(200, 169, 110, 0.25)' : 'rgba(200, 169, 110, 0.15)'}
                    title="Click to view profile"
                  >
                    <span>🪷</span>
                    <span>{pranaTier.title}</span>
                  </div>
                </div>
                
                {/* Stats Pills and Sound Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1px solid rgba(200, 169, 110, 0.45)',
                      borderRadius: '99px',
                      padding: '3px 10px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#8b5a12',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}>
                      <span>✨</span>
                      <span>{user?.xp || 0} XP</span>
                    </div>

                    {/* Theme Toggle Button */}
                    <button
                      onClick={toggleTheme}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: '1px solid rgba(200, 169, 110, 0.45)',
                        color: '#8b5a12',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      title={themeDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                      {themeDark ? (
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                      )}
                    </button>
                    
                    {/* Speaker mute control button (toggles mute state, unmuting plays default) */}
                    <button
                      onClick={() => {
                        if (isMuted) {
                          if (!activeSound) handleToggleSound('sitarBgm')
                          else toggleMute()
                        } else {
                          toggleMute()
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isMuted ? 'rgba(185, 28, 28, 0.15)' : 'rgba(255, 255, 255, 0.92)',
                        border: '1px solid rgba(200, 169, 110, 0.45)',
                        color: isMuted ? '#b91c1c' : '#8b5a12',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      title="Toggle ambient sounds mute"
                    >
                      {isMuted || !activeSound ? (
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                      )}
                    </button>

                    {/* Notifications settings button */}
                    <NotificationsButton />
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1px solid rgba(232, 98, 42, 0.45)',
                    borderRadius: '99px',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#e8622a',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    <span>🪷</span>
                    <span>{user?.pranaPoints || 0} Pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DAILY FLAME — Streak + Progress Tracker */}
            <DailyPillars
              dark={dark}
              habitStreak={habitStreak}
              ritualDone={ritualDone}
              waterGoalMet={waterGoalMet}
              journalToday={journalToday}
              wisdomRead={wisdomRead}
              todayTotal={todayTotal}
              waterGoal={waterGoal}
              onChange={handleTogglePractice}
              onLogWater={handleLogWater}
              onToggleJournal={handleToggleJournal}
              onToggleWisdom={handleToggleWisdom}
            />

            {/* Unified Sankalpa and Quote Card */}
            <div className="sankalpa-quote-unified-card">
              <SankalpaSelector
                dark={dark}
                selectedSankalpa={selectedSankalpa}
                currentSankalpa={currentSankalpa}
                sankalpaPanelOpen={sankalpaPanelOpen}
                onTogglePanel={() => setSankalpaPanelOpen(!sankalpaPanelOpen)}
                onSelectSankalpa={handleSetSankalpa}
                onGenerateSankalpa={handleGenerateSankalpa}
                isAuthenticated={!!user}
                isReflectionTime={isReflectionTime}
              />

              {/* Primary Action — Suggested Sadhana/Evening reflection */}
              <ActiveSadhanaPlayer
                dark={dark}
                activePractice={activePractice}
                timerSeconds={timerSeconds}
                viewMode={viewMode}
                isReflectionTime={isReflectionTime}
                todayRitual={todayRitual}
                userName={userName}
                selectedSankalpa={selectedSankalpa}
                onStartPractice={handleBeginActivePractice}
                onCompletePractice={handleCompleteActivePractice}
                onCancelPractice={cancelPractice}
                onNavigateJournal={() => navigate('/journal')}
                onOpenSankalpaPanel={() => setSankalpaPanelOpen(true)}
              />

              {/* Wisdom card scroll */}
              <div className="wisdom-scroll-wrapper">
                <WisdomScrollSection
                  secLabelStyle={secLabelStyle}
                  currentSankalpa={currentSankalpa}
                  wisdomRead={wisdomRead}
                  handleReadWisdom={handleReadWisdom}
                />
              </div>
            </div>

            {/* DAILY FLAME PROGRESS CHAKRA (Mobile only) */}
            <div className="mobile-flame-chakra-container md:hidden" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 0',
              position: 'relative'
            }}>
              <div 
                className="flame-chakra-wrapper" 
                style={{
                  width: '185px',
                  height: '185px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {/* SVG circular progress ring */}
                <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 12px rgba(200, 169, 110, 0.25))' }}>
                  {/* Glowing Filter Definitions */}
                  <defs>
                    <linearGradient id="chakraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c9933a" />
                      <stop offset="60%" stopColor="#e8622a" />
                      <stop offset="100%" stopColor="#d4607a" />
                    </linearGradient>
                    <filter id="chakraGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer decorative lotus petals (Mandala framework) */}
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const angle = (idx * 360) / 12;
                    return (
                      <path
                        key={`petal-${idx}`}
                        d="M85 18 C85 7, 90 3, 90 3 C90 3, 95 7, 95 18 C92 19, 88 19, 85 18 Z"
                        fill="none"
                        stroke="#c8a96e"
                        strokeWidth="1"
                        opacity={dark ? 0.45 : 0.65}
                        transform={`rotate(${angle} 90 90)`}
                      />
                    );
                  })}

                  {/* Decorative outer thin ring */}
                  <circle
                    cx="90"
                    cy="90"
                    r="82"
                    fill="none"
                    stroke={dark ? 'rgba(200, 169, 110, 0.06)' : 'rgba(200, 169, 110, 0.12)'}
                    strokeWidth="1"
                  />
                  {/* Outer track ring */}
                  <circle
                    cx="90"
                    cy="90"
                    r="72"
                    fill="none"
                    stroke={dark ? 'rgba(200, 169, 110, 0.08)' : 'rgba(200, 169, 110, 0.16)'}
                    strokeWidth="6"
                  />
                  {/* Glowing progress stroke */}
                  <circle
                    cx="90"
                    cy="90"
                    r="72"
                    fill="none"
                    stroke="url(#chakraGradient)"
                    strokeWidth="8"
                    strokeDasharray="452.39"
                    strokeDashoffset={habitStreak > 0 ? (452.39 - (452.39 * ([ritualDone, waterGoalMet, journalToday, wisdomRead].filter(Boolean).length / 4))) : 452.39}
                    strokeLinecap="round"
                    filter="url(#chakraGlow)"
                    style={{
                      transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                  {/* Inner decorative dotted chakra ring */}
                  <circle
                    cx="90"
                    cy="90"
                    r="61"
                    fill="none"
                    stroke="#c8a96e"
                    strokeWidth="1"
                    strokeDasharray="4,6"
                    opacity="0.45"
                  />
                  {/* Shaded inner disk background for center text */}
                  <circle
                    cx="90"
                    cy="90"
                    r="54"
                    fill={dark ? 'rgba(28, 20, 10, 0.65)' : 'rgba(255, 252, 243, 0.75)'}
                    stroke="rgba(200, 169, 110, 0.15)"
                    strokeWidth="0.5"
                  />
                  
                  {/* Decorative tiny rays/spokes in center (24 spokes representing Ashoka Chakra) */}
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const angle = (idx * 360) / 24;
                    return (
                      <line
                        key={idx}
                        x1="90"
                        y1="25"
                        x2="90"
                        y2="30"
                        stroke="#c8a96e"
                        strokeWidth="1.2"
                        opacity={dark ? 0.35 : 0.5}
                        transform={`rotate(${angle} 90 90)`}
                      />
                    );
                  })}

                  {/* Tiny dots at tips of spokes */}
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const angle = (idx * 360) / 24;
                    return (
                      <circle
                        key={`tip-${idx}`}
                        cx="90"
                        cy="22"
                        r="1.2"
                        fill="#c8a96e"
                        opacity={dark ? 0.45 : 0.65}
                        transform={`rotate(${angle} 90 90)`}
                      />
                    );
                  })}
                </svg>

                {/* Main Streak Number & Progress Fraction in Center */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    marginTop: '-2px'
                  }}>
                    <span style={{ 
                      fontSize: '18px', 
                      filter: 'drop-shadow(0 2px 4px rgba(232, 98, 42, 0.35))',
                      marginRight: '1px' 
                    }}>
                      🔥
                    </span>
                    <span style={{ 
                      fontSize: '36px', 
                      fontWeight: 700, 
                      color: dark ? '#fcf6e8' : '#2d1f0e', 
                      fontFamily: "'Playfair Display', serif", 
                      lineHeight: 1 
                    }}>
                      {habitStreak || 0}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '8px', 
                    fontWeight: 700, 
                    color: '#c8a96e', 
                    letterSpacing: '0.12em', 
                    textTransform: 'uppercase', 
                    marginTop: '4px', 
                    fontFamily: "'Cinzel', serif" 
                  }}>
                    Streak
                  </span>
                  <span style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#e8622a',
                    opacity: 0.85,
                    marginTop: '2px',
                    fontFamily: "'Lexend', sans-serif"
                  }}>
                    {([ritualDone, waterGoalMet, journalToday, wisdomRead].filter(Boolean).length)}/4 Today
                  </span>
                </div>

                {/* Streak Hover Tooltip */}
                <div className="streak-tooltip" style={{
                  position: 'absolute',
                  bottom: '-60px',
                  background: dark ? 'rgba(24, 17, 10, 0.94)' : 'rgba(253, 249, 240, 0.96)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(200, 169, 110, 0.38)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  zIndex: 20,
                  boxShadow: dark ? '0 12px 32px rgba(0,0,0,0.55)' : '0 12px 28px rgba(139,105,20,0.12)',
                  minWidth: '154px',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <div style={{ 
                    fontSize: '9px', 
                    fontWeight: 700, 
                    color: '#c8a96e', 
                    letterSpacing: '0.08em', 
                    textTransform: 'uppercase', 
                    borderBottom: '0.5px solid rgba(200,169,110,0.25)', 
                    paddingBottom: '4px', 
                    marginBottom: '4px', 
                    fontFamily: "'Lexend', sans-serif" 
                  }}>
                    ✨ Active Streaks
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: dark ? '#f5edd8' : '#3d2600', fontFamily: "'Lexend', sans-serif" }}>
                    <span>🧘 Sadhana:</span>
                    <strong style={{ color: '#c8a96e' }}>{habitStreak || 0}d</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: dark ? '#f5edd8' : '#3d2600', fontFamily: "'Lexend', sans-serif" }}>
                    <span>💧 Water:</span>
                    <strong style={{ color: '#3b82f6' }}>{waterStreak || 0}d</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: dark ? '#f5edd8' : '#3d2600', fontFamily: "'Lexend', sans-serif" }}>
                    <span>✍️ Chintan:</span>
                    <strong style={{ color: '#a78bfa' }}>{journalStreak || 0}d</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: dark ? '#f5edd8' : '#3d2600', fontFamily: "'Lexend', sans-serif" }}>
                    <span>📖 Wisdom:</span>
                    <strong style={{ color: '#e8622a' }}>{wisdomStreak || 0}d</strong>
                  </div>
                </div>
              </div>
            </div>


            {/* 2-column grid for Heritage + Community */}
            <div className={`heritage-card-wrapper ${hasReadLetter ? 'full-width' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <HeritageCard dark={dark} glassCardStyle={glassCardStyle} />
            </div>

            {/* Founder vision letter card */}
            <div className={`founder-letter-wrapper ${hasReadLetter ? 'is-read' : ''}`}>
              <FounderLetterCard
                hasReadLetter={hasReadLetter}
                setHasReadLetter={setHasReadLetter}
                setLetterOpen={setLetterOpen}
                user={user}
                updateProfile={updateProfile}
                dark={dark}
                glassCardStyle={glassCardStyle}
              />
            </div>

          </div>

          <ImmersiveFooter />
        </main>
      </PageLayout>



      <FounderLetterModal open={letterOpen} onClose={() => setLetterOpen(false)} dark={dark} />


      {/* Level Up Celebration Overlay */}
      <LevelUpModal
        showLevelUp={showLevelUp}
        levelUpLevel={levelUpLevel}
        dark={dark}
        onClose={() => setShowLevelUp(false)}
      />
    </>
  )
}

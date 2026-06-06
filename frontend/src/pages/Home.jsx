import React from 'react'
import PageLayout from '../components/ui/PageLayout'
import TopBorder from '../components/ui/TopBorder'
import HeroSection from '../sections/HeroSection'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import FounderLetterModal from '../components/ui/FounderLetterModal'
import OnboardingWizardModal from '../components/ui/OnboardingWizardModal'

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
    onboardingOpen,
    setOnboardingOpen,
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
    handleOnboardingComplete,
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

  return (
    <>
      <HeroSection viewMode={viewMode} reflection={reflection} />
      <TopBorder />
      <PageLayout>
        <main style={{ position: 'relative', background: dynamicBackgroundStyle, minHeight: '100vh' }}>

          {/* Drifting Sacred Sparkles and Watermark */}
          <SacredWatermark dark={dark} isNight={isNight} />

          {/* Page Body Container */}
          <div style={containerStyle}>

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

            {/* Collapsible Sankalpa badge & Expandable selection tray */}
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
              onStartPractice={handleBeginActivePractice}
              onCompletePractice={handleCompleteActivePractice}
              onCancelPractice={cancelPractice}
              onNavigateJournal={() => navigate('/journal')}
            />

            {/* Wisdom card scroll */}
            <WisdomScrollSection
              secLabelStyle={secLabelStyle}
              currentSankalpa={currentSankalpa}
              wisdomRead={wisdomRead}
              handleReadWisdom={handleReadWisdom}
            />

            {/* 2-column grid for Heritage + Community */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <HeritageCard dark={dark} glassCardStyle={glassCardStyle} />
            </div>

            {/* Founder vision letter card */}
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

          <ImmersiveFooter />
        </main>
      </PageLayout>

      {/* Floating Sound Panel */}
      <SoundSanctuaryPanel
        soundPanelOpen={soundPanelOpen}
        onToggleSoundPanel={() => setSoundPanelOpen(!soundPanelOpen)}
        activeSound={activeSound}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onToggleMute={toggleMute}
      />

      <FounderLetterModal open={letterOpen} onClose={() => setLetterOpen(false)} dark={dark} />
      <OnboardingWizardModal
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        dark={dark}
        onComplete={handleOnboardingComplete}
      />

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

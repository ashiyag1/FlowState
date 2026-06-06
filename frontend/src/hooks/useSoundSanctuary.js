import { useState, useEffect } from 'react'
import { useSoundEffects } from './useSoundEffects'

export function useSoundSanctuary() {
  const { startWisdomAmbience, stopWisdomAmbience, isMuted, toggleMute } = useSoundEffects()
  const [activeSound, setActiveSound] = useState(null)
  const [soundPanelOpen, setSoundPanelOpen] = useState(false)

  const toggleSound = (preset) => {
    if (activeSound === preset) {
      stopWisdomAmbience()
      setActiveSound(null)
    } else {
      startWisdomAmbience(preset)
      setActiveSound(preset)
    }
  }

  useEffect(() => {
    return () => {
      stopWisdomAmbience()
    }
  }, [stopWisdomAmbience])

  return {
    activeSound,
    setActiveSound,
    soundPanelOpen,
    setSoundPanelOpen,
    toggleSound,
    isMuted,
    toggleMute
  }
}

import { useState, useEffect, useCallback, useRef } from 'react'

export function useBookSpeech(curText, curHeading) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFemale, setIsFemale] = useState(true)

  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying
  const isFemaleRef = useRef(isFemale)
  isFemaleRef.current = isFemale

  const speak = useCallback((text, female) => {
    if (!text) return
    window.speechSynthesis.cancel()

    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    u.pitch = female ? 0.93 : 0.82

    const voices = window.speechSynthesis.getVoices()
    const isIndia = v => /india/i.test(v.name)
    const isKnownFemale = v => /female|heera|priya|neerja|zira|samantha|aria/i.test(v.name)
    const isKnownMale = v => /male|david|guy|mark|prabhat/i.test(v.name)

    const v = female
      ? voices.find(v => isIndia(v) && isKnownFemale(v))
        || voices.find(v => isKnownFemale(v))
        || voices.find(v => v.name.includes('Google UK English Female'))
        || voices.find(v => v.name.includes('Google US English Female'))
        || voices[0]
      : voices.find(v => isIndia(v) && !isKnownFemale(v))
        || voices.find(v => isKnownMale(v))
        || voices.find(v => v.name.includes('Google UK English Male'))
        || voices.find(v => v.name.includes('Google US English Male'))
        || voices[0]
    if (v) u.voice = v

    window.speechSynthesis.speak(u)
  }, [])

  // load voices
  useEffect(() => {
    const h = () => { window.speechSynthesis.getVoices() }
    window.speechSynthesis.addEventListener('voiceschanged', h)
    h()
    return () => window.speechSynthesis.removeEventListener('voiceschanged', h)
  }, [])

  // cancel speech on unmount
  useEffect(() => () => window.speechSynthesis.cancel(), [])

  // speak on page turn
  useEffect(() => {
    if (isPlayingRef.current && curText) {
      speak(`${curHeading}. ${curText}`, isFemaleRef.current)
    }
  }, [curText, curHeading, speak])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      if (curText) speak(`${curHeading}. ${curText}`, isFemale)
    }
  }, [isPlaying, curText, curHeading, isFemale, speak])

  const toggleVoice = useCallback(() => {
    const next = !isFemale
    setIsFemale(next)
    if (isPlaying && curText) speak(`${curHeading}. ${curText}`, next)
  }, [isPlaying, curText, curHeading, isFemale, speak])

  return {
    isPlaying,
    isFemale,
    setIsPlaying,
    togglePlay,
    toggleVoice,
    speak
  }
}

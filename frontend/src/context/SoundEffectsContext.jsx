import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import sitarTanpuraBgm from '../assets/wisdom_music/sitar_tanpura_bgm.mp3'
import omSoundMp3 from '../assets/wisdom_music/om_sound.mp3'
import rainMp3 from '../assets/wisdom_music/rain.mp3'
import fluteMp3 from '../assets/wisdom_music/flute.mp3'
import tibetanBowlMp3 from '../assets/wisdom_music/tibetan_bowl.mp3'
import windChimesMp3 from '../assets/wisdom_music/wind_chimes.mp3'

const SoundEffectsContext = createContext(null)

function createAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  return AudioContextClass ? new AudioContextClass() : null
}

export const AMBIENCE_PRESETS = {
  sitarBgm: {
    label: 'Sitar BGM',
    description: 'Sitar & tanpura background music',
    volume: 0.15,
  },
  omSound: {
    label: 'Om Sound',
    description: 'Soothing om chant',
    volume: 0.30,
  },
  rain: {
    label: 'Rain',
    description: 'Calming rain sounds',
    volume: 0.40,
  },
  flute: {
    label: 'Flute',
    description: 'Peaceful flute melody',
    volume: 0.15,
  },
  tibetanBowl: {
    label: 'Tibetan Bowl',
    description: 'Resonant singing bowl tones',
    volume: 0.25,
  },
  windChimes: {
    label: 'Wind Chimes',
    description: 'Gentle wind chimes',
    volume: 0.15,
  },
  meditation: {
    label: 'Temple Bells',
    strings: [
      { freq: 130.81, strokeDelay: 0.0 },
      { freq: 165.0, strokeDelay: 3.0 },
      { freq: 196.0, strokeDelay: 6.0 },
      { freq: 261.63, strokeDelay: 9.0 },
    ],
    cycleLength: 12.0,
    strokeLength: 8.0,
    filterFreq: 3000,
    masterVolume: 0.16,
    description: 'Reverberant temple bell tones',
  },
}

export function SoundEffectsProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('flowstate_muted') === 'true')
  const audioCtxRef = useRef(null)
  const activeNodesRef = useRef(new Set())
  const timeoutIdsRef = useRef(new Set())

  // Holds the ambient drone nodes so we can fade them in/out independently
  const droneRef = useRef(null)
  const mp3Ref = useRef(null)

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioContext()
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }, [])

  const registerNodes = useCallback((nodes, durationMs) => {
    nodes.forEach((node) => activeNodesRef.current.add(node))
    const timeoutId = window.setTimeout(() => {
      nodes.forEach((node) => activeNodesRef.current.delete(node))
      timeoutIdsRef.current.delete(timeoutId)
    }, durationMs + 500)
    timeoutIdsRef.current.add(timeoutId)
  }, [])

  const stopAllSounds = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id))
    timeoutIdsRef.current.clear()
    activeNodesRef.current.forEach((node) => {
      try {
        if (typeof node.stop === 'function') node.stop()
        if (typeof node.disconnect === 'function') node.disconnect()
      } catch { /* already stopped */ }
    })
    activeNodesRef.current.clear()
    droneRef.current = null
  }, [])

  useEffect(() => {
    localStorage.setItem('flowstate_muted', String(isMuted))
    if (isMuted) stopAllSounds()
  }, [isMuted, stopAllSounds])

  useEffect(() => stopAllSounds, [stopAllSounds])

  /* ─────────────────────────────────────────────────────────
     💧 WATER — soft crystal chime ripple (reduced volume)
     E major chord partials: 329·493·659 Hz
     Bloom like ripples spreading outward on still water.
  ───────────────────────────────────────────────────────── */
  const playHydrationSound = useCallback(() => {
    if (isMuted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const warmth = ctx.createBiquadFilter()
    warmth.type = 'lowpass'
    warmth.frequency.value = 3200
    warmth.Q.value = 0.3
    warmth.connect(ctx.destination)

    const partials = [
      { freq: 329.63, delay: 0,    peak: 0.038, attackT: 0.018, decayT: 2.6 },
      { freq: 493.88, delay: 0.12, peak: 0.027, attackT: 0.022, decayT: 2.1 },
      { freq: 659.25, delay: 0.26, peak: 0.018, attackT: 0.026, decayT: 1.6 },
    ]

    const allNodes = [warmth]
    partials.forEach(({ freq, delay, peak, attackT, decayT }) => {
      const t = now + delay
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(peak, t + attackT)
      g.gain.linearRampToValueAtTime(0,    t + decayT)
      osc.connect(g)
      g.connect(warmth)
      osc.start(t)
      osc.stop(t + decayT + 0.1)
      allNodes.push(osc, g)
    })

    registerNodes(allNodes, 3200)
  }, [getAudioContext, isMuted, registerNodes])

  /* ─────────────────────────────────────────────────────────
     🪕 SITAR — habit completed (reduced volume)
     Sa·Pa·Sa ascending arpeggio (C4·G4·C5).
  ───────────────────────────────────────────────────────── */
  const playHabitSound = useCallback(() => {
    if (isMuted) return
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const allNodes = []

    const notes = [
      { freq: 261.63, start: 0,    decay: 2.2 },
      { freq: 392.00, start: 0.22, decay: 1.8 },
      { freq: 523.25, start: 0.42, decay: 2.4 },
    ]

    notes.forEach(({ freq, start, decay }) => {
      const t = now + start

      // Noise burst = sitar jawari buzz on pluck
      const bufferSize = Math.floor(ctx.sampleRate * 0.08)
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = freq
      bp.Q.value = 18
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.10, t)
      noiseGain.gain.linearRampToValueAtTime(0, t + 0.06)
      noise.connect(bp)
      bp.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(t)

      // Fundamental with meend gesture (downward bend then settle)
      const fundamental = ctx.createOscillator()
      fundamental.type = 'sine'
      fundamental.frequency.setValueAtTime(freq, t)
      fundamental.frequency.linearRampToValueAtTime(freq * 0.985, t + 0.08)
      fundamental.frequency.linearRampToValueAtTime(freq,         t + 0.22)
      const fundGain = ctx.createGain()
      fundGain.gain.setValueAtTime(0,    t)
      fundGain.gain.linearRampToValueAtTime(0.055, t + 0.025)
      fundGain.gain.linearRampToValueAtTime(0,     t + decay)
      fundamental.connect(fundGain)
      fundGain.connect(ctx.destination)
      fundamental.start(t)
      fundamental.stop(t + decay + 0.1)

      // Harmonic octave (very faint)
      const harmonic = ctx.createOscillator()
      harmonic.type = 'sine'
      harmonic.frequency.value = freq * 2
      const harmGain = ctx.createGain()
      harmGain.gain.setValueAtTime(0,     t)
      harmGain.gain.linearRampToValueAtTime(0.014, t + 0.03)
      harmGain.gain.linearRampToValueAtTime(0,     t + decay * 0.7)
      harmonic.connect(harmGain)
      harmGain.connect(ctx.destination)
      harmonic.start(t)
      harmonic.stop(t + decay)

      allNodes.push(bp, noiseGain, fundGain, harmGain, fundamental, harmonic)
    })

    registerNodes(allNodes, 3200)
  }, [getAudioContext, isMuted, registerNodes])

  /* ─────────────────────────────────────────────────────────
     🎵 TANPURA DRONE — ambient wisdom / quotes ambience

     A tanpura is the continuous drone instrument behind all
     Indian classical music. It holds Sa (tonic) and Pa (fifth)
     in a slow, meditative cycle that feels like breathing.

     Design:
       • Sa  = 110 Hz  (low tonic, grounding)
       • Pa  = 165 Hz  (perfect fifth, open and resonant)
       • Sa' = 220 Hz  (octave, presence)
       • Ma  = 146 Hz  (fourth, adds a touch of longing)

     Each string "stroke" is simulated by a brief amplitude
     swell on the corresponding frequency — they cycle through
     Sa → Ma → Pa → Sa' with ~2s between each, looping gently.

     The master gain envelope fades the whole drone IN over 3s
     and OUT over 3s when stopped — immersive, never jarring.

     startWisdomAmbience() → fades in and loops indefinitely
     stopWisdomAmbience()  → fades out gently then disconnects
   ───────────────────────────────────────────────────────── */

  const startWisdomAmbience = useCallback((presetName = 'sitarBgm') => {
    if (isMuted) return
    if (droneRef.current) stopWisdomAmbience()

    const preset = AMBIENCE_PRESETS[presetName] || AMBIENCE_PRESETS.meditation

    // Handle MP3-based presets
    if (!preset.strings) {
      const mp3Sources = {
        sitarBgm: sitarTanpuraBgm,
        omSound: omSoundMp3,
        rain: rainMp3,
        flute: fluteMp3,
        tibetanBowl: tibetanBowlMp3,
        windChimes: windChimesMp3,
      }
      const audio = new Audio(mp3Sources[presetName])
      audio.loop = true
      audio.volume = preset.volume
      try {
        audio.play().catch(err => {
          console.warn("Audio playback was blocked or failed:", err)
        })
      } catch (err) {
        console.warn("Audio playback failed synchronously:", err)
      }
      mp3Ref.current = audio
      droneRef.current = { isMp3: true }
      return
    }

    // Temple Bells (meditation) — synthesized
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    const sr = ctx.sampleRate
    const irLen = sr * 3.5
    const irBuf = ctx.createBuffer(2, irLen, sr)
    for (let ch = 0; ch < 2; ch++) {
      const d = irBuf.getChannelData(ch)
      for (let i = 0; i < irLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 6)
      }
    }
    const reverb = ctx.createConvolver()
    reverb.buffer = irBuf

    const reverbWet = ctx.createGain()
    reverbWet.gain.value = 0.55
    const reverbDry = ctx.createGain()
    reverbDry.gain.value = 1.0

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(preset.masterVolume, now + 3.0)
    master.connect(ctx.destination)

    const warmth = ctx.createBiquadFilter()
    warmth.type = 'lowpass'
    warmth.frequency.value = preset.filterFreq
    warmth.Q.value = 0.8

    warmth.connect(reverbDry)
    warmth.connect(reverb)
    reverb.connect(reverbWet)
    reverbDry.connect(master)
    reverbWet.connect(master)

    const CYCLE = preset.cycleLength
    const STROKE = preset.strokeLength
    const NUM_CYCLES = 48
    const oscillators = []
    const gainNodes = [warmth, reverb, reverbWet, reverbDry, master]
    const bellRatios = [1, 2.0, 3.01, 4.02]
    const bellVols = [1, 0.5, 0.25, 0.12]
    const bellDecays = [8.0, 5.5, 3.5, 2.0]

    preset.strings.forEach(({ freq, strokeDelay }) => {
      for (let p = 0; p < 4; p++) {
        const partialFreq = freq * bellRatios[p]
        const partialVol = bellVols[p]
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = partialFreq

        const g = ctx.createGain()
        g.gain.setValueAtTime(0, now)
        for (let cycle = 0; cycle < NUM_CYCLES; cycle++) {
          const t = now + strokeDelay + cycle * CYCLE
          g.gain.setValueAtTime(0, t)
          g.gain.linearRampToValueAtTime(0.14 * partialVol, t + 0.04)
          g.gain.exponentialRampToValueAtTime(0.001, t + bellDecays[p])
        }
        osc.connect(g)
        g.connect(warmth)
        osc.start(now)
        oscillators.push(osc)
        gainNodes.push(g)
      }
    })

    droneRef.current = { master, oscillators, gainNodes, warmth, ctx }
    ;[master, warmth, reverb, reverbWet, reverbDry, ...oscillators, ...gainNodes].forEach((n) =>
      activeNodesRef.current.add(n)
    )
  }, [getAudioContext, isMuted])

  const stopWisdomAmbience = useCallback(() => {
    // Stop MP3 if playing
    if (mp3Ref.current) {
      mp3Ref.current.pause()
      mp3Ref.current = null
    }

    if (!droneRef.current) return

    // MP3 preset — no oscillator cleanup needed
    if (droneRef.current.isMp3) {
      droneRef.current = null
      return
    }

    const { master, oscillators, gainNodes, warmth, ctx } = droneRef.current
    droneRef.current = null

    const now = ctx.currentTime
    // Fade out master over 3 seconds — smooth, meditative exit
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(0, now + 3.0)

    // Stop oscillators after fade completes
    window.setTimeout(() => {
      oscillators.forEach((osc) => {
        try { osc.stop(); osc.disconnect() } catch { /* ok */ }
      })
      gainNodes.forEach((g) => { try { g.disconnect() } catch { /* ok */ } })
      try { warmth.disconnect() } catch { /* ok */ }
      try { master.disconnect() } catch { /* ok */ }
      ;[master, warmth, ...oscillators, ...gainNodes].forEach((n) =>
        activeNodesRef.current.delete(n)
      )
    }, 3200)
  }, [])

  // Keep a no-op playWisdomSound for API compatibility
  // (Quotes.jsx uses start/stop instead now)
  const playWisdomSound = useCallback(() => {}, [])

  const toggleMute = useCallback(() => {
    setIsMuted((current) => !current)
  }, [])

  return (
    <SoundEffectsContext.Provider
      value={{
        isMuted,
        toggleMute,
        stopAllSounds,
        playHydrationSound,
        playHabitSound,
        playWisdomSound,
        startWisdomAmbience,
        stopWisdomAmbience,
      }}
    >
      {children}
    </SoundEffectsContext.Provider>
  )
}

export function useSoundEffects() {
  const context = useContext(SoundEffectsContext)
  if (!context) throw new Error('useSoundEffects must be used inside SoundEffectsProvider')
  return context
}
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import morningBg from '../assets/hero/morningBg.webp'
import afternoonBg from '../assets/hero/afternoonBg.webp'
import eveningBg from '../assets/hero/eveningBg.webp'
import nightBg from '../assets/hero/nightBg.webp'

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'evening'
  return 'night'
}

const BG_IMAGES = {
  morning: morningBg,
  afternoon: afternoonBg,
  evening: eveningBg,
  night: nightBg
}

export default function PwaSplash({ onComplete }) {
  const [tod] = useState(getTimeOfDay)
  const bgImage = BG_IMAGES[tod] || nightBg

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="pwa-splash-container">
      {/* ── Immersive Zooming Background Photo ── */}
      <motion.img
        src={bgImage}
        alt="Sanctuary Landscape"
        className="pwa-splash-bg"
        initial={{ scale: 1.08, opacity: 0.8 }}
        animate={{ scale: 1.01, opacity: 1 }}
        transition={{ duration: 2.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      
      {/* Blending overlay for readability */}
      <div className="pwa-splash-overlay" />

      {/* ── Content Text Overlay ── */}
      <div className="pwa-splash-content">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 className="pwa-splash-title">
            Welcome to tarang-flowstate
          </h1>
          <p className="pwa-splash-sub">
            your digital sanctuary
          </p>
        </motion.div>
      </div>
    </div>
  )
}

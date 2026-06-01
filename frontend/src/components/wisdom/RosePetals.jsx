import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const PETAL_COLORS = [
  '#FF9EAA', '#FFB3BA', '#FFDDE1', '#FFC8DD',
  '#E8A0BF', '#FF85A1', '#FFB347', '#FFD700',
  '#FF6B9D', '#C9A8D8',
]

function Petal({ color, startX, delay, size, rotation, sway }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '-40px',
        left: `${startX}%`,
        width: size,
        height: size * 1.4,
        borderRadius: '60% 40% 60% 40% / 40% 60% 40% 60%',
        backgroundColor: color,
        opacity: 0.85,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        zIndex: 99999,
        pointerEvents: 'none',
        rotate: rotation,
      }}
      initial={{ y: -60, opacity: 0, rotate: rotation }}
      animate={{
        y: '110vh',
        opacity: [0, 0.9, 0.9, 0],
        x: [0, sway, -sway * 0.5, sway * 0.8, 0],
        rotate: rotation + 360,
      }}
      transition={{
        duration: 3.5 + Math.random() * 2,
        delay,
        ease: 'linear',
      }}
    />
  )
}

export default function RosePetals({ trigger, count = 35 }) {
  const [petals, setPetals] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!trigger) return
    
    const newPetals = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      startX: Math.random() * 100,
      delay: Math.random() * 1.5,
      size: 10 + Math.random() * 18,
      rotation: Math.random() * 360,
      sway: (Math.random() - 0.5) * 160,
    }))
    
    setPetals(newPetals)
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setPetals([])
    }, 5500)
    
    return () => clearTimeout(timer)
  }, [trigger, count])

  if (!isVisible || !petals.length) return null

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99998 }}>
      <AnimatePresence>
        {petals.map(petal => (
          <Petal key={petal.id} {...petal} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

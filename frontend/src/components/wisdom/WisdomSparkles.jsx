import { motion } from 'framer-motion'

export default function WisdomSparkles() {
  // Generate 18 particles with randomized parameters
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 12 + Math.random() * 14,
    delay: Math.random() * -15, // Negative delay so particles start midway on mount
    opacity: 0.15 + Math.random() * 0.4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-t from-gold via-gold/80 to-transparent"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: '-2%',
            filter: 'drop-shadow(0 0 5px rgba(201,147,58,0.5))',
            willChange: 'transform, opacity',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-105vh',
            opacity: [0, p.opacity, p.opacity, 0],
            x: [0, Math.sin(p.id) * 35, Math.cos(p.id) * 45, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

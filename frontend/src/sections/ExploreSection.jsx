import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Landmark, PlayCircle } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
})

const RESOURCES = [
  { title: 'Yoga for Beginners', url: 'https://youtu.be/oDP-89wRXUk?si=v5TLzJNX1ty3XymT', benefit: 'Radically lowers cortisol & enhances neuroplasticity' },
  { title: 'Deep Yoga Nidra', url: 'https://youtu.be/uPSml_JQGVY?si=nhVhj5Ag64X3CHEQ', benefit: '30 mins = 2 hours of deep REM sleep for your brain' },
  { title: 'Surya Namaskar', url: 'https://youtu.be/AneOlb4dAZU?si=zXqpYa1iZ7MQ0hK-', benefit: 'Regulates endocrine system & ignites metabolic fire' },
  { title: 'Chakra Meditation', url: 'https://youtu.be/Zdy-NVFpSUI?si=ayma3Ml5RqjFXKE-', benefit: 'Synchronizes brain hemispheres & increases gray matter' },
  { title: 'Kapalbhati Breath', url: 'https://youtu.be/AtG7cx6p7DY?si=BdKVCedciXeLo4SJ', benefit: 'Oxygenates frontal lobe for intense, immediate focus' },
  { title: 'Anulom Vilom', url: 'https://youtu.be/blbv5UTBCGg?si=DQt8rU1zp_H5_frA', benefit: 'Balances autonomic nervous system, dropping blood pressure' }
]

export default function ExploreSection({ dark }) {
  const glassCardStyle = {
    background: dark ? 'rgba(18, 12, 4, 0.95)' : 'rgba(253, 248, 240, 0.95)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.15)' : '1px solid rgba(200, 169, 110, 0.25)',
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 gap-4">
        {/* Heritage Widget */}
        <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Link to="/heritage" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="fs-gold-corner-card" style={{
              ...glassCardStyle,
              position: 'relative', padding: '1.5rem 1.25rem', overflow: 'hidden', height: '100%',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #c9a84c, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.8rem' }}>
                <div style={{ padding: 8, borderRadius: 12, background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                  <Landmark size={20} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600, color: dark ? '#e8d9b5' : '#5C3D1E', margin: 0, lineHeight: 1 }}>Explore Heritage</h3>
              </div>
              <p style={{ fontFamily: "'Lora', serif", fontSize: '0.82rem', color: dark ? '#c9b080' : '#8B5E2F', lineHeight: 1.6, margin: '0 0 1rem' }}>
                Swipe through forgotten history and reconnect with the roots of ancient Indian wisdom.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Cinzel', serif", fontSize: '0.62rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.08em' }}>
                Enter the Archives <ArrowRight size={10} />
              </div>
            </div>
          </Link>
        </motion.div>


      </div>

      {/* Ashiya's Curated Resources */}
      <motion.div variants={fadeUp(0.12)} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <div style={{
          ...glassCardStyle,
          position: 'relative', padding: '1.5rem', borderRadius: '20px',
        }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, color: dark ? '#e8d9b5' : '#5C3D1E', marginBottom: '0.2rem', textAlign: 'center' }}>
            Ashiya's Curated Practices
          </h3>
          <p style={{ fontFamily: "'Lora', serif", fontSize: '0.85rem', fontStyle: 'italic', color: dark ? '#c9b080' : '#8B5E2F', textAlign: 'center', marginBottom: '1.5rem' }}>
            Hand-picked resources, backed by science and ancient wisdom.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RESOURCES.map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl border border-gold/15 bg-white/40 dark:bg-white/5 hover:bg-gold/10 dark:hover:bg-gold/10 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="text-gold mt-1 group-hover:scale-110 transition-transform">
                    <PlayCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink dark:text-sand-lt group-hover:text-saffron transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                      {res.title}
                    </h4>
                    <p className="text-[10px] text-ink-soft/70 dark:text-ivory/60 mt-1 leading-snug">
                      <span className="text-saffron font-semibold">Science:</span> {res.benefit}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

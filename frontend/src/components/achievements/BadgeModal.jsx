import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements, getBadgeImageUrl } from '../../context/AchievementsContext';
import { Sparkles, Award, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Web Audio API synthesiser for a pure, meditative temple bell chime sound
function playTempleChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (frequency, volume, duration, delay = 0) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      // Smooth attack and long exponential decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    // Recreate a bright, clean harmonic minor temple bell chime
    playTone(293.66, 0.25, 4.0, 0.0);   // D4 (deep grounding resonance)
    playTone(440.00, 0.15, 3.5, 0.08);  // A4 (fifth)
    playTone(587.33, 0.12, 3.0, 0.15);  // D5 (octave)
    playTone(739.99, 0.08, 2.5, 0.22);  // F#5 (major third)
    playTone(880.00, 0.05, 1.8, 0.30);  // A5 (higher harmonic)
  } catch (err) {
    console.error('Failed to synthesise temple chime sound:', err);
  }
}

export default function BadgeModal() {
  const { activeUnlockBadge, setActiveUnlockBadge } = useAchievements();
  const { dark } = useTheme();

  // Play sound on mount when a new badge is unlocked
  useEffect(() => {
    if (activeUnlockBadge) {
      playTempleChime();
    }
  }, [activeUnlockBadge]);

  // Generate fixed floating particles positioning
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.sin(i * 1.5) * 80,
      y: -50 - (i * 18),
      delay: i * 0.15,
      duration: 3 + (i % 3) * 1.5,
      size: 4 + (i % 3) * 3
    }));
  }, []);

  if (!activeUnlockBadge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveUnlockBadge(null)}
          className="absolute inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative max-w-sm w-full mx-4 rounded-3xl border p-8 text-center overflow-visible select-none shadow-2xl"
          style={{
            background: dark
              ? 'linear-gradient(180deg, #1d1208 0%, #100a04 100%)'
              : 'linear-gradient(180deg, #fdfaf5 0%, #f4edd8 100%)',
            borderColor: 'rgba(201, 147, 58, 0.45)',
            boxShadow: dark
              ? '0 30px 70px rgba(0,0,0,0.85), 0 0 100px rgba(201, 147, 58, 0.15)'
              : '0 30px 70px rgba(92, 61, 30, 0.15), 0 0 100px rgba(201, 147, 58, 0.1)',
          }}
        >
          {/* Glowing auric circle background behind badge */}
          <div 
            className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none filter blur-[32px] opacity-40 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(201, 147, 58, 0.6) 0%, rgba(232, 98, 42, 0.3) 50%, transparent 70%)'
            }}
          />

          {/* Floating spiritual sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0], 
                  y: [0, p.y],
                  x: [0, p.x]
                }}
                transition={{ 
                  duration: p.duration, 
                  repeat: Infinity, 
                  delay: p.delay,
                  ease: 'easeOut'
                }}
                className="absolute left-[50%] top-[40%] text-gold pointer-events-none"
                style={{ fontSize: p.size }}
              >
                ✦
              </motion.div>
            ))}
          </div>

          {/* Top category label */}
          <div className="flex items-center justify-center gap-1.5 text-gold font-display font-bold uppercase tracking-[0.25em] text-[10px] mb-4">
            <Compass size={12} className="animate-spin-slow" /> SACRED ACHIEVEMENT
          </div>

          {/* Centered Golden Badge Frame */}
          <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
            {/* Spinning background mandala ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-gold/45"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border border-dotted border-gold/30"
            />
            
            {/* Badge Image */}
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative z-10 w-28 h-28 flex items-center justify-center bg-gradient-to-b from-gold/15 to-saffron/5 rounded-full p-2 border border-gold/25"
            >
              <img
                src={getBadgeImageUrl(activeUnlockBadge.imageFilename)}
                alt={activeUnlockBadge.title}
                className="w-24 h-24 object-contain filter drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
              />
            </motion.div>
          </div>

          {/* Rarity Tag */}
          <span 
            className="inline-block px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-4 border"
            style={{
              background: activeUnlockBadge.rarity === 'Legendary' ? 'rgba(232, 98, 42, 0.15)' : 'rgba(201, 147, 58, 0.1)',
              borderColor: activeUnlockBadge.rarity === 'Legendary' ? 'var(--saffron)' : 'var(--gold)',
              color: activeUnlockBadge.rarity === 'Legendary' ? 'var(--saffron)' : 'var(--gold)'
            }}
          >
            {activeUnlockBadge.rarity}
          </span>

          {/* Titles & Descriptions */}
          <h2 className="font-display font-bold text-2xl text-ink dark:text-ivory mb-2 tracking-wide leading-snug">
            {activeUnlockBadge.title}
          </h2>
          
          <p className="font-serif text-sm italic text-ink-soft/80 dark:text-ivory-soft/75 px-4 mb-6 leading-relaxed">
            "{activeUnlockBadge.description}"
          </p>

          {/* Close Action Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveUnlockBadge(null)}
            className="w-full py-3.5 rounded-full font-display font-semibold tracking-wider text-xs uppercase cursor-pointer text-white shadow-lg shadow-gold/20"
            style={{
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--saffron) 100%)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            Acknowledge ✦ Continue
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

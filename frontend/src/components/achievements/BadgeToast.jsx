import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements, getBadgeImageUrl } from '../../context/AchievementsContext';
import { Sparkles, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function BadgeToast() {
  const { toasts, removeToast } = useAchievements();
  const { dark } = useTheme();

  return (
    <div className="fixed top-6 left-4 right-4 md:left-auto md:right-6 z-[99] flex flex-col gap-3 pointer-events-none md:max-w-sm w-auto md:w-full">
      <AnimatePresence>
        {toasts.map(({ id, badge }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full rounded-2xl border border-gold/30 p-4 shadow-2xl flex items-center gap-3.5 relative overflow-hidden"
            style={{
              background: dark 
                ? 'linear-gradient(135deg, rgba(28, 18, 8, 0.95) 0%, rgba(18, 11, 4, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(254, 252, 246, 0.98) 0%, rgba(245, 242, 230, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: dark
                ? '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 147, 58, 0.08)'
                : '0 12px 30px rgba(92, 61, 30, 0.08), 0 0 20px rgba(201, 147, 58, 0.05)',
            }}
          >
            {/* Ambient gold glow back layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-saffron/5 pointer-events-none" />

            {/* Sparkle decorative */}
            <div className="absolute top-1 right-8 opacity-25">
              <Sparkles size={10} className="text-gold animate-pulse" />
            </div>

            {/* Badge image auto-mapping */}
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gold/10 border border-gold/20 overflow-hidden">
              <img 
                src={getBadgeImageUrl(badge.imageFilename)} 
                alt={badge.title} 
                className="w-10 h-10 object-contain filter drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                loading="lazy"
              />
            </div>

            {/* Text description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-gold font-display font-semibold uppercase tracking-widest text-[9px] mb-0.5">
                <Sparkles size={9} /> Achievement Unlocked
              </div>
              <h4 className="font-display font-bold text-sm leading-tight text-ink dark:text-ivory truncate">
                {badge.title}
              </h4>
              <p className="text-[10px] text-ink-soft/75 dark:text-ivory-soft/65 leading-normal mt-0.5 truncate">
                {badge.description}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(id)}
              className="p-1 rounded-full hover:bg-gold/10 transition-colors text-ink-soft/40 dark:text-ivory-soft/45 hover:text-ink dark:hover:text-ivory cursor-pointer"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

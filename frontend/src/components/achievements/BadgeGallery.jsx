import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements, getBadgeImageUrl } from '../../context/AchievementsContext';
import { Sparkles, X, Award, ShieldAlert, Trophy, ShieldCheck, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Trophy },
  { id: 'streaks', label: 'Streaks', icon: Trophy },
  { id: 'wisdom', label: 'Wisdom', icon: Compass },
  { id: 'journaling', label: 'Journaling', icon: Trophy },
  { id: 'rituals', label: 'Rituals', icon: Sparkles },
  { id: 'wellness', label: 'Wellness', icon: ShieldCheck },
  { id: 'legendary', label: 'Legendary', icon: Award }
];

export default function BadgeGallery() {
  const { badges, isGalleryOpen, setGalleryOpen } = useAchievements();
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  // Filter badges based on selected tab
  const filteredBadges = useMemo(() => {
    if (activeTab === 'all') return badges;
    return badges.filter(b => b.category === activeTab);
  }, [badges, activeTab]);

  if (!isGalleryOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setGalleryOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden pointer-events-auto"
          style={{
            background: dark
              ? 'rgba(20, 13, 6, 0.92)'
              : 'rgba(253, 248, 235, 0.94)',
            borderColor: 'rgba(201, 147, 58, 0.3)',
            boxShadow: dark
              ? '0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(201, 147, 58, 0.08)'
              : '0 30px 80px rgba(92, 61, 30, 0.12), 0 0 50px rgba(201, 147, 58, 0.05)',
            backdropFilter: 'blur(36px) saturate(1.2)'
          }}
        >
          {/* Subtle gold line at top */}
          <div className="h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold/15 flex-shrink-0">
            <div>
              <div className="flex items-center gap-1.5 text-gold font-display font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
                <Sparkles size={11} className="animate-pulse" /> Wellness Milestones
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ivory">
                Achievements Collection
              </h2>
            </div>
            <button
              onClick={() => setGalleryOpen(false)}
              className="p-2 rounded-full hover:bg-gold/10 transition-colors text-ink-soft/50 dark:text-ivory-soft/50 hover:text-ink dark:hover:text-ivory cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Filters */}
          <div className="flex items-center gap-1.5 px-6 py-3 overflow-x-auto border-b border-gold/10 scrollbar-none flex-shrink-0">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-gold/15 border-gold text-gold-lt font-bold shadow-sm'
                      : 'bg-transparent border-transparent text-ink-soft/70 dark:text-ivory-soft/60 hover:bg-gold/5'
                  }`}
                >
                  <Icon size={12} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Badges Grid Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {filteredBadges.map(badge => {
                const isLegendary = badge.rarity === 'Legendary';
                const isLocked = !badge.isUnlocked;
                const isHidden = isLegendary && isLocked;
                
                const percentage = badge.targetProgress > 0 
                  ? Math.min((badge.progress / badge.targetProgress) * 100, 100)
                  : 0;

                return (
                  <motion.div
                    key={badge.badgeId}
                    whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
                    className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 ${
                      isLocked 
                        ? 'opacity-45 hover:opacity-60 bg-black/10 dark:bg-white/[0.01]' 
                        : 'bg-white/40 dark:bg-white/[0.03]'
                    }`}
                    style={{
                      borderColor: isLocked
                        ? 'rgba(201, 147, 58, 0.15)'
                        : isLegendary
                          ? 'rgba(232, 98, 42, 0.35)'
                          : 'rgba(201, 147, 58, 0.35)',
                      boxShadow: !isLocked 
                        ? isLegendary
                          ? '0 8px 24px rgba(232, 98, 42, 0.08), inset 0 0 12px rgba(232, 98, 42, 0.03)'
                          : '0 8px 24px rgba(201, 147, 58, 0.06), inset 0 0 12px rgba(201, 147, 58, 0.03)'
                        : 'none'
                    }}
                  >
                    {/* Glowing highlight border for unlocked */}
                    {!isLocked && (
                      <div 
                        className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
                        style={{
                          background: isLegendary
                            ? 'linear-gradient(90deg, transparent, var(--saffron), transparent)'
                            : 'linear-gradient(90deg, transparent, var(--gold), transparent)'
                        }}
                      />
                    )}

                    {/* Badge Image Frame */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 flex items-center justify-center">
                      {/* Mandala back decoration for unlocked */}
                      {!isLocked && (
                        <div 
                          className="absolute inset-0 rounded-full border border-gold/15 animate-spin-slow pointer-events-none" 
                          style={{ borderStyle: 'dashed' }}
                        />
                      )}
                      
                      {isHidden ? (
                        // Hidden legendary relics
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/25 flex items-center justify-center text-gold/30 border border-gold/15 select-none font-display text-2xl font-bold">
                          ?
                        </div>
                      ) : (
                        <img
                          src={getBadgeImageUrl(badge.imageFilename)}
                          alt={badge.title}
                          className={`w-16 h-16 sm:w-20 sm:h-20 object-contain filter ${
                            isLocked 
                              ? 'grayscale blur-[1px] opacity-75' 
                              : 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                          }`}
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Badge Info */}
                    <div className="w-full">
                      {/* Rarity label */}
                      <span 
                        className="text-[7.5px] font-bold tracking-widest uppercase"
                        style={{ color: isLegendary ? 'var(--saffron)' : 'var(--gold)' }}
                      >
                        {badge.rarity}
                      </span>
                      
                      <h3 className="font-display font-semibold text-xs sm:text-sm text-ink dark:text-ivory mt-1 leading-snug truncate">
                        {isHidden ? 'Sacred Relic' : badge.title}
                      </h3>
                      
                      <p className="text-[10px] text-ink-soft/75 dark:text-ivory-soft/60 line-clamp-2 mt-1 px-1 h-7 leading-normal">
                        {isHidden ? 'A legendary secret awaits. Keep practicing daily rituals to reveal it.' : badge.description}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full mt-4 flex flex-col gap-1.5 flex-shrink-0">
                      <div className="flex items-center justify-between text-[8.5px] font-semibold text-ink-soft/70 dark:text-ivory-soft/50 font-display">
                        <span>{isLocked ? 'PROGRESS' : 'UNLOCKED'}</span>
                        <span>
                          {isLocked 
                            ? `${badge.progress} / ${badge.targetProgress}`
                            : '✦ COMPLETE'
                          }
                        </span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="w-full h-1 bg-gold/10 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${percentage}%`,
                            background: isLegendary
                              ? 'linear-gradient(90deg, var(--saffron), #f4925a)'
                              : 'linear-gradient(90deg, var(--gold), #ecd49b)'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="px-6 py-4 border-t border-gold/10 flex items-center justify-between bg-gold/5 text-[10px] text-ink-soft/80 dark:text-ivory-soft/60 flex-shrink-0">
            <span>Keep logging your daily practices to uncover ancient spiritual milestones.</span>
            <span className="font-display font-bold text-gold">FLOWSTATE ✦ achi</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

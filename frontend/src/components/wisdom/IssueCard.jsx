import { motion } from 'framer-motion'

export default function IssueCard({ issue, dark, onClick }) {
  // We'll use the issue's color to create a beautiful gradient glow
  const glowStyle = {
    background: dark 
      ? `linear-gradient(135deg, ${issue.color}40 0%, ${issue.color}15 100%)`
      : `linear-gradient(135deg, ${issue.color}35 0%, ${issue.color}10 100%)`,
    borderColor: `${issue.color}66`,
  }

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative flex flex-col justify-end p-5 rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl h-[320px] w-full box-border overflow-hidden group backdrop-blur-md"
      style={{
        backgroundColor: dark ? 'rgba(20, 15, 10, 0.85)' : 'rgba(255, 252, 245, 0.85)',
        ...glowStyle,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {/* Decorative Background Blob */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40 transition-transform duration-700 group-hover:scale-150"
        style={{ backgroundColor: issue.color, transform: 'translate(20%, -20%)' }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-auto">
          <span 
            className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md"
            style={{
              background: `${issue.color}25`,
              color: issue.color,
              border: `1px solid ${issue.color}40`,
            }}
          >
            {issue.tag}
          </span>
          <span className="text-2xl drop-shadow-md bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/5">
            {issue.emoji}
          </span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: issue.color }}>
              {issue.approach}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ink dark:text-ivory font-serif leading-tight mb-2">
            {issue.title}
          </h3>
          <p className="text-sm text-mist-dark dark:text-sand-lt/80 leading-relaxed line-clamp-2">
            {issue.summary}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
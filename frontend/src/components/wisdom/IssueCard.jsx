import { motion } from 'framer-motion'

export default function IssueCard({ issue, dark, onClick }) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between gap-4 p-4 bg-white/65 dark:bg-white/[0.03] hover:bg-white/80 dark:hover:bg-white/[0.06] border border-gold/15 dark:border-gold/10 hover:border-gold/35 dark:hover:border-gold/25 rounded-2xl cursor-pointer shadow-sm hover:shadow-md h-[80px] w-full box-sizing-border"
    >
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span 
            className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md"
            style={{
              background: issue.color + '15',
              color: issue.color,
            }}
          >
            {issue.tag}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron/80 dark:text-saffron-lt text-[9px]">
            {issue.approach}
          </span>
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-ivory font-serif truncate leading-tight">
          {issue.title}
        </h3>
      </div>

      <p className="hidden sm:block text-xs text-mist-dark dark:text-ocean-lt/60 leading-normal line-clamp-2 max-w-[200px] flex-1">
        {issue.summary}
      </p>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-sm text-gold dark:text-gold/80 font-bold transition-transform duration-350 hover:translate-x-1">
          →
        </span>
      </div>
    </motion.div>
  )
}
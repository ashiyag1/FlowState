import { motion } from 'framer-motion'

export default function PageLayout({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className={`min-h-screen pb-24 md:pb-12 dark:bg-ink ${className}`}
    >
      {children}
    </motion.main>
  )
}

export function Container({ children, wide = false, className = '' }) {
  return (
    <div className={`${wide ? 'max-w-5xl' : 'max-w-3xl'} mx-auto px-4 md:px-6 ${className}`}>
      {children}
    </div>
  )
}

export function PageHeader({ eyebrow, title, titleEm, sub, children }) {
  return (
    <div className="py-10 md:py-14">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="section-title">
        {title}
        {titleEm && <em className="not-italic text-ocean-mid dark:text-ocean-lt"> {titleEm}</em>}
      </h1>
      {sub && <p className="mt-3 text-mist-dark dark:text-ocean-lt/70 font-light leading-relaxed max-w-md">{sub}</p>}
      {children}
    </div>
  )
}
import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'

export function HeritageSnapCard({
  item,
  index,
  expandedId,
  setExpandedId
}) {
  const isExpanded = expandedId === item.id

  return (
    <div id={item.id} style={{
      height: isExpanded ? 'auto' : '100vh',
      minHeight: '100vh',
      width: '100%',
      scrollSnapAlign: isExpanded ? 'none' : 'start',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(' + item.image + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: item.type === 'scholar' ? 'brightness(0.7) contrast(1.1)' : 'brightness(0.3) saturate(1.2)'
      }}>
        {/* Lazy-load off-screen images to avoid loading all 16 portraits at once */}
        <img
          src={item.image}
          alt=""
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}
        />
      </div>
      
      {/* Gradient Overlay for Text Readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(0deg, rgba(5,3,1,1) 0%, rgba(5,3,1,0.85) 30%, rgba(5,3,1,0.3) 60%, transparent 100%)'
      }} />

      {/* Content Area */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: isExpanded
          ? '2rem 1.5rem 9rem 1.5rem'  // extra bottom room when expanded (mobile nav + scroll)
          : '2rem 1.5rem 7rem 1.5rem', // normal bottom padding accounts for mobile nav
        color: '#fff',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, ' + item.accent + ', ' + item.accent + '88)',
            color: '#fff',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1.2rem',
            boxShadow: '0 4px 12px ' + item.accent + '44'
          }}>
            {item.type}
          </div>

          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            lineHeight: '1.05',
            fontWeight: '600',
            marginBottom: '0.75rem',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            color: '#fff'
          }}>
            {item.title}
          </h2>
          
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '1.2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '500'
          }}>
            {item.subtitle}
          </p>

          <p style={{
            fontFamily: 'Lora, serif',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '1.5rem',
            display: isExpanded ? 'block' : '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}>
            {item.body}
          </p>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginBottom: '1.5rem' }}
            >
              {item.readMore.slice(item.type === 'scholar' ? 0 : 1).map((p, i) => (
                <p key={i} style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '1rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>{p}</p>
              ))}
            </motion.div>
          )}

          <button
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: item.accent,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid ' + item.accent + '66',
              padding: '10px 20px',
              borderRadius: '999px',
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            {isExpanded ? 'Show Less' : 'Read Full Story'} 
            <ChevronRight size={18} style={{ transform: isExpanded ? 'rotate(-90deg)' : 'none', transition: '0.3s' }} />
          </button>
        </motion.div>
      </div>
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            color: 'rgba(255,255,255,0.7)'
          }}
        >
          <ChevronDown size={32} />
        </motion.div>
      )}
    </div>
  )
}

export default HeritageSnapCard

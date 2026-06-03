import React from 'react'
import { motion } from 'framer-motion'

export function StepWrapper({ number, title, description, children, dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'relative',
        padding: '2.5rem 1.8rem',
        marginBottom: '2.5rem',
        borderRadius: '24px',
        background: dark ? 'rgba(15,10,4,0.6)' : 'rgba(255,252,240,0.6)',
        border: '1px solid ' + (dark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)'),
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{
        position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #c9933a, #e8b96a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Cinzel, serif', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff',
        boxShadow: '0 8px 20px rgba(201,147,58,0.4)',
        border: '4px solid ' + (dark ? '#110b05' : '#fdf6e3')
      }}>
        {number}
      </div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '0.8rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: dark ? '#f5e6c8' : '#2d1f0e', marginBottom: '0.4rem' }}>{title}</h3>
        <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: dark ? 'rgba(245,230,200,0.6)' : 'rgba(45,31,14,0.6)', fontSize: '0.9rem' }}>{description}</p>
      </div>
      {children}
    </motion.div>
  )
}
export default StepWrapper

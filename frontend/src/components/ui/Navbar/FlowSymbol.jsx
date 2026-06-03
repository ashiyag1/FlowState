import React from 'react'

export function FlowSymbol({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 1 L31 16 L16 31 L1 16 Z" stroke="url(#sg)" strokeWidth="0.9" fill="none"/>
      <path d="M16 4.5 L27.5 16 L16 27.5 L4.5 16 Z" stroke="url(#sg)" strokeWidth="0.55" fill="none" opacity="0.45"/>
      {[0,45,90,135,180,225,270,315].map(d => (
        <ellipse key={d} cx="16" cy="9.5" rx="1.6" ry="5.2"
          fill="url(#sg)" opacity="0.55" transform={`rotate(${d} 16 16)`}/>
      ))}
      <circle cx="16" cy="16" r="5.5" stroke="url(#sg)" strokeWidth="0.55" fill="none" opacity="0.5"/>
      <circle cx="16" cy="16" r="2.2" fill="url(#sg)" opacity="0.95"/>
      <circle cx="16" cy="16" r="0.9" fill="white" opacity="0.9"/>
      {[['16','1'],['31','16'],['16','31'],['1','16']].map(([cx,cy]) => (
        <circle key={cx+cy} cx={cx} cy={cy} r="0.9" fill="url(#sg)" opacity="0.7"/>
      ))}
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#e8c46a"/>
          <stop offset="50%" stopColor="#d4a82a"/>
          <stop offset="100%" stopColor="#c8921a"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

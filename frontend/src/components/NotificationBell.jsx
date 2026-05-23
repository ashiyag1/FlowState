// src/components/NotificationBell.jsx

import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import ReminderSettings from './ReminderSettings';

export default function NotificationBell() {
  const { permission, supported } = usePushNotifications();
  const [open, setOpen] = useState(false);

  if (!supported) return null;

  return (
    <>
      <style>{bellStyles}</style>
      <button
        className={`fs-bell-btn ${permission === 'granted' ? 'fs-bell-on' : ''}`}
        onClick={() => setOpen(true)}
        title={permission === 'granted' ? 'Manage reminders' : 'Enable reminders'}
      >
        <span className="fs-bell-icon">🔔</span>
        <span className="fs-bell-text">
          {permission === 'granted' ? 'Reminders' : 'Enable Reminders'}
        </span>
        {permission === 'granted' && <span className="fs-bell-dot" />}
      </button>
      {open && <ReminderSettings onClose={() => setOpen(false)} />}
    </>
  );
}

const bellStyles = `
  .fs-bell-btn {
    display:        inline-flex;
    align-items:    center;
    gap:            7px;
    padding:        7px 16px;
    border-radius:  999px;
    font-family:    'Cormorant Garamond', 'Georgia', serif;
    font-size:      13px;
    font-weight:    600;
    letter-spacing: 0.04em;
    white-space:    nowrap;
    cursor:         pointer;
    transition:     all 0.25s ease;
    position:       relative;
    overflow:       hidden;
    background:     linear-gradient(135deg, #c8973a 0%, #e8b84b 45%, #c8973a 100%);
    border:         1px solid #a0762a;
    color:          #1a0f00;
    box-shadow:     0 2px 12px rgba(200,151,58,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .fs-bell-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.5s ease;
  }
  .fs-bell-btn:hover::before { left: 160%; }
  .fs-bell-btn:hover {
    background:  linear-gradient(135deg, #d9a84a 0%, #f0c96a 45%, #d9a84a 100%);
    box-shadow:  0 4px 18px rgba(200,151,58,0.5);
    transform:   translateY(-1px);
  }
  .fs-bell-btn:active { transform: translateY(0); }

  /* Granted state — subtler */
  .fs-bell-on {
    background:  rgba(200,151,58,0.12) !important;
    border:      1px solid rgba(200,151,58,0.45) !important;
    color:       #c8973a !important;
    box-shadow:  none !important;
  }
  .fs-bell-on:hover {
    background:  rgba(200,151,58,0.2) !important;
    transform:   translateY(-1px) !important;
  }

  .fs-bell-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #c8973a; flex-shrink: 0;
    box-shadow: 0 0 0 0 rgba(200,151,58,0.6);
    animation: fs-bell-pulse 2s infinite;
  }
  @keyframes fs-bell-pulse {
    0%  { box-shadow: 0 0 0 0   rgba(200,151,58,0.6); }
    70% { box-shadow: 0 0 0 6px rgba(200,151,58,0);   }
    100%{ box-shadow: 0 0 0 0   rgba(200,151,58,0);   }
  }

  .fs-bell-icon { font-size: 14px; line-height: 1; }
  .fs-bell-text { line-height: 1; }
`;
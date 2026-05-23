// src/components/ReminderModal.jsx

import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useNotif } from './NotificationPopup';

// ─── Format helpers ───────────────────────────────────────────────────────────
function to12h(hour, minute) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h    = hour % 12 || 12;
  return `${h}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function toTimeInput(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function parseTimeInput(val) {
  const [h, m] = val.split(':').map(Number);
  return { hour: h, minute: m };
}

// ─── Single reminder row ──────────────────────────────────────────────────────
function ReminderRow({ id, reminder, onUpdate, onTest, isInterval }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(toTimeInput(reminder.hour, reminder.minute));
  const [intDraft, setIntDraft] = useState(reminder.intervalMins || 45);

  const save = () => {
    if (isInterval) {
      onUpdate(id, { intervalMins: Number(intDraft) });
    } else {
      const { hour, minute } = parseTimeInput(draft);
      onUpdate(id, { hour, minute });
    }
    setEditing(false);
  };

  return (
    <div style={s.row}>
      {/* Toggle */}
      <button
        onClick={() => onUpdate(id, { enabled: !reminder.enabled })}
        style={{ ...s.toggle, ...(reminder.enabled ? s.toggleOn : s.toggleOff) }}
        aria-label="Toggle"
      >
        <span style={{
          ...s.toggleThumb,
          transform: reminder.enabled ? 'translateX(18px)' : 'translateX(2px)',
        }} />
      </button>

      {/* Info */}
      <div style={s.rowInfo}>
        <div style={s.rowTitle}>
          {reminder.emoji} {reminder.label}
        </div>
        <div style={{ ...s.rowSub, opacity: reminder.enabled ? 1 : 0.45 }}>
          {isInterval
            ? `Every ${reminder.intervalMins} minutes`
            : to12h(reminder.hour, reminder.minute)
          }
        </div>
      </div>

      {/* Actions */}
      <div style={s.rowActions}>
        {reminder.enabled && (
          <button onClick={() => onTest(id)} style={s.testBtn} title="Send test now">
            ▷
          </button>
        )}
        <button
          onClick={() => setEditing(!editing)}
          style={{ ...s.editBtn, ...(editing ? s.editBtnActive : {}) }}
          title="Edit time"
        >
          ✏️
        </button>
      </div>

      {/* Inline editor */}
      {editing && (
        <div style={s.editor}>
          {isInterval ? (
            <div style={s.editorRow}>
              <label style={s.editorLabel}>Every</label>
              <input
                type="number"
                min={5} max={120}
                value={intDraft}
                onChange={(e) => setIntDraft(e.target.value)}
                style={s.numberInput}
              />
              <span style={s.editorLabel}>minutes</span>
            </div>
          ) : (
            <div style={s.editorRow}>
              <label style={s.editorLabel}>Time</label>
              <input
                type="time"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                style={s.timeInput}
              />
            </div>
          )}
          <div style={s.editorRow}>
            <button onClick={save} style={s.saveBtn}>Save</button>
            <button onClick={() => setEditing(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export default function ReminderModal({ onClose }) {
  const { permission, supported, schedule, requestPermission, updateSchedule, testReminder } =
    usePushNotifications();
  const notif = useNotif();

  const keys = Object.keys(schedule);

  const handleAllow = async () => {
    const result = await requestPermission();
    if (result === 'granted') notif("Reminders are all set! You'll get gentle pings throughout the day.", 'success');
  };

  const handleToggle = (id, changes) => {
    updateSchedule(id, changes);
    if (changes.enabled !== undefined) {
      const label = schedule[id]?.label || 'Reminder';
      const emoji = schedule[id]?.emoji || '🔔';
      notif(changes.enabled ? `${emoji} ${label} turned on` : `${emoji} ${label} turned off`, 'default');
    }
  };

  return (
    <>
      <style>{modalStyles}</style>

      {/* Backdrop */}
      <div className="fs-modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="fs-modal">
        {/* Header */}
        <div style={s.header}>
          <div>
            <p style={s.headerEyebrow}>Tarang‑FlowState</p>
            <h2 style={s.headerTitle}>Wellness Reminders</h2>
          </div>
          <button onClick={onClose} style={s.closeBtn} aria-label="Close">✕</button>
        </div>

        {/* Permission banner */}
        {permission !== 'granted' && (
          <div style={s.banner}>
            {permission === 'denied' ? (
              <>
                <span>🔕</span>
                <span>Notifications are blocked. Please enable them in your browser settings.</span>
              </>
            ) : (
              <>
                <span>🔔</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Enable browser notifications</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    Get reminders even when this tab is in the background.
                  </div>
                </div>
                <button onClick={handleAllow} style={s.allowBtn}>Allow</button>
              </>
            )}
          </div>
        )}

        {/* Reminder rows */}
        <div style={s.list}>
          {keys.map((key) => (
            <ReminderRow
              key={key}
              id={key}
              reminder={schedule[key]}
              onUpdate={handleToggle}
              onTest={testReminder}
              isInterval={!!schedule[key].intervalMins}
            />
          ))}
        </div>

        {/* Footer note */}
        <p style={s.footer}>
          🌿 Times are in your local timezone. Press ▷ to send a test notification.
        </p>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const gold   = '#c8973a';
const goldLt = '#e8b84b';
const cream  = '#fdf6e3';
const brown  = '#1a0f00';
const brownLt = '#5c3d1e';

const s = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerEyebrow: {
    margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: gold, fontFamily: 'inherit',
  },
  headerTitle: {
    margin: '4px 0 0', fontSize: 22, fontWeight: 700,
    color: brown, fontFamily: "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '-0.01em',
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: brownLt, padding: 4, borderRadius: 8,
    transition: 'color 0.15s',
  },
  banner: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: `${gold}15`, border: `1px solid ${gold}40`,
    borderRadius: 14, padding: '12px 16px', marginBottom: 16,
    fontSize: 13, color: brownLt, fontWeight: 500,
  },
  allowBtn: {
    marginLeft: 'auto', flexShrink: 0,
    background: `linear-gradient(135deg, ${gold}, ${goldLt})`,
    border: `1px solid ${gold}`, borderRadius: 20, padding: '6px 16px',
    fontSize: 12, fontWeight: 700, color: brown,
    cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  row: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 0', borderBottom: `1px solid ${gold}20`,
    flexWrap: 'wrap',
  },
  toggle: {
    width: 44, height: 26, borderRadius: 13, border: '1.5px solid #c8973a',
    background: '#e7d7b8',
    cursor: 'pointer', position: 'relative', flexShrink: 0,
    transition: 'background 0.25s, border-color 0.25s',
    boxSizing: 'border-box',
    outline: 'none',
    display: 'flex', alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  toggleOn:  {
    background: `linear-gradient(135deg, ${gold}, ${goldLt})`,
    borderColor: gold,
    boxShadow: '0 2px 8px 0 rgba(200,151,58,0.18)',
  },
  toggleOff: {
    background: '#e7d7b8',
    borderColor: '#d4c4a8',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  toggleThumb: {
    position: 'absolute',
    top: 3.5,
    left: 3.5,
    width: 19, height: 19, borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
    border: '1px solid #e8b84b',
    transition: 'transform 0.25s cubic-bezier(0.34,1.4,0.64,1)',
    willChange: 'transform',
  },
  rowInfo:   { flex: 1, minWidth: 0 },
  rowTitle:  { fontSize: 14, fontWeight: 700, color: brown, marginBottom: 2 },
  rowSub:    { fontSize: 12, color: brownLt, transition: 'opacity 0.2s' },
  rowActions: { display: 'flex', gap: 6, flexShrink: 0 },
  testBtn: {
    background: `${gold}18`, border: `1px solid ${gold}40`,
    borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
    fontSize: 13, color: gold, transition: 'all 0.15s',
  },
  editBtn: {
    background: 'transparent', border: `1px solid ${gold}30`,
    borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
    fontSize: 13, transition: 'all 0.15s',
  },
  editBtnActive: { background: `${gold}20`, borderColor: `${gold}60` },
  editor: {
    width: '100%', paddingTop: 10,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  editorRow:   { display: 'flex', alignItems: 'center', gap: 10 },
  editorLabel: { fontSize: 13, color: brownLt, fontWeight: 600 },
  timeInput: {
    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    color: brown, background: cream,
    border: `1px solid ${gold}50`, borderRadius: 10, padding: '6px 12px',
    outline: 'none', cursor: 'pointer',
  },
  numberInput: {
    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    color: brown, background: cream,
    border: `1px solid ${gold}50`, borderRadius: 10, padding: '6px 12px',
    outline: 'none', width: 70, textAlign: 'center',
  },
  saveBtn: {
    background: `linear-gradient(135deg, ${gold}, ${goldLt})`,
    border: `1px solid ${gold}`, borderRadius: 20, padding: '6px 18px',
    fontSize: 12, fontWeight: 700, color: brown, cursor: 'pointer',
    fontFamily: 'inherit', letterSpacing: '0.04em',
  },
  cancelBtn: {
    background: 'transparent', border: `1px solid ${gold}40`,
    borderRadius: 20, padding: '6px 14px',
    fontSize: 12, fontWeight: 600, color: brownLt, cursor: 'pointer',
    fontFamily: 'inherit',
  },
  footer: {
    margin: '16px 0 0', fontSize: 11.5, color: '#9a7a50',
    textAlign: 'center', lineHeight: 1.5,
  },
};

const modalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap');

  .fs-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(26,15,0,0.55);
    backdrop-filter: blur(4px);
    z-index: 9998;
    animation: fs-fade-in 0.2s ease;
  }

  .fs-modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    width: min(480px, calc(100vw - 16px));
    max-height: min(90vh, 600px);
    overflow-y: auto;
    background: #fdf6e3;
    border-radius: 24px;
    border: 1px solid rgba(200,151,58,0.3);
    box-shadow: 0 24px 64px rgba(26,15,0,0.35), 0 0 0 1px rgba(200,151,58,0.1);
    padding: 28px;
    font-family: 'Nunito', 'Cormorant Garamond', Georgia, sans-serif;
    animation: fs-slide-up 0.35s cubic-bezier(0.34,1.3,0.64,1);
  }

  @keyframes fs-fade-in  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fs-slide-up {
    from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;
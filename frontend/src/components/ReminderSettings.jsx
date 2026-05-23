import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useNotif } from './NotificationPopup';

const NOTIF_TYPES = [
  { key: 'journal',  emoji: '📓', label: 'Journal Reminder',  defaultTime: '09:00', desc: 'Reflect & write' },
  { key: 'habit',    emoji: '✅', label: 'Habit Check',        defaultTime: '20:00', desc: 'Evening review' },
  { key: 'hydrate',  emoji: '💧', label: 'Hydration Reminder', defaultTime: '45',    desc: 'Every N minutes', isInterval: true },
  { key: 'sleep',    emoji: '🌙', label: 'Sleep Reminder',     defaultTime: '22:30', desc: 'Wind down time' },
  { key: 'wisdom',   emoji: '🧘', label: 'Daily Wisdom',       defaultTime: '07:00', desc: 'Morning inspiration' },
];

const gold   = '#c8973a';
const goldLt = '#e8b84b';
const brown  = '#1a0f00';
const cream  = '#fdf6e3';

export default function ReminderSettings({ onClose }) {
  const { schedule, updateSchedule, requestPermission, testReminder } = usePushNotifications();
  const notif = useNotif();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});

  const handleToggle = (key) => {
    const current = schedule[key];
    const newEnabled = !current?.enabled;
    updateSchedule(key, { enabled: newEnabled });
    const info = NOTIF_TYPES.find(t => t.key === key);
    notif(newEnabled ? `${info?.emoji} ${info?.label} turned on` : `${info?.emoji} ${info?.label} turned off`, 'success');
  };

  const handleTimeSave = (key) => {
    const val = draft[key];
    if (!val) return;
    const info = NOTIF_TYPES.find(t => t.key === key);
    if (info?.isInterval) {
      updateSchedule(key, { intervalMins: Number(val) });
    } else {
      const [h, m] = val.split(':').map(Number);
      updateSchedule(key, { hour: h, minute: m });
    }
    setEditing(null);
    notif(`${info?.emoji} ${info?.label} time updated`, 'success');
  };

  const handleAllow = async () => {
    const result = await requestPermission();
    if (result === 'granted') notif("Reminders are all set! You'll get gentle pings throughout the day.", 'success');
  };

  return (
    <>
      <style>{modalCSS}</style>
      <div className="rs-backdrop" onClick={onClose} />
      <div className="rs-wrap">
        <div className="rs-box">
          <div className="rs-head">
            <div>
              <p className="rs-eyebrow">Tarang‑FlowState</p>
              <h2 className="rs-title">Notification Settings</h2>
            </div>
            <button className="rs-close" onClick={onClose} aria-label="Close">&#10005;</button>
          </div>

          <div className="rs-body">
            {schedule && Object.keys(schedule).length > 0 && !schedule.journal?.hour && (
              <div className="rs-banner">
                <span>🔔</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 13 }}>Enable browser notifications</div>
                  <div style={{ fontSize: 11.5, opacity: 0.75 }}>Get reminders even when this tab is in the background.</div>
                </div>
                <button className="rs-allow-btn" onClick={handleAllow}>Allow</button>
              </div>
            )}

            <div className="rs-list">
              {NOTIF_TYPES.map((info) => {
                const s = schedule[info.key];
                const isOn = s?.enabled;
                const timeDisplay = info.isInterval
                  ? `Every ${s?.intervalMins || 45} min`
                  : `${String(s?.hour ?? 9).padStart(2, '0')}:${String(s?.minute ?? 0).padStart(2, '0')}`;

                return (
                  <div key={info.key} className="rs-row">
                    <button
                      onClick={() => handleToggle(info.key)}
                      className={`rs-toggle ${isOn ? 'rs-toggle-on' : ''}`}
                      aria-label={`Toggle ${info.label}`}
                    >
                      <span className="rs-toggle-thumb" style={{ transform: isOn ? 'translateX(18px)' : 'translateX(2px)' }} />
                    </button>
                    <div className="rs-info">
                      <span className="rs-label">{info.emoji} {info.label}</span>
                      <span className="rs-time">{timeDisplay}</span>
                    </div>
                    <button className="rs-edit-btn" onClick={() => {
                      setEditing(editing === info.key ? null : info.key);
                      const current = info.isInterval ? (s?.intervalMins || 45).toString() : `${String(s?.hour ?? 9).padStart(2, '0')}:${String(s?.minute ?? 0).padStart(2, '0')}`;
                      setDraft(prev => ({ ...prev, [info.key]: current }));
                    }} aria-label="Edit time">✏️</button>

                    {editing === info.key && (
                      <div className="rs-editor">
                        {info.isInterval ? (
                          <div className="rs-editor-row">
                            <span className="rs-editor-label">Every</span>
                            <input type="number" min={5} max={180} value={draft[info.key] || 45}
                              onChange={e => setDraft(prev => ({ ...prev, [info.key]: e.target.value }))}
                              className="rs-input-num" />
                            <span className="rs-editor-label">minutes</span>
                          </div>
                        ) : (
                          <div className="rs-editor-row">
                            <span className="rs-editor-label">Time</span>
                            <input type="time" value={draft[info.key] || '09:00'}
                              onChange={e => setDraft(prev => ({ ...prev, [info.key]: e.target.value }))}
                              className="rs-input-time" />
                          </div>
                        )}
                        <div className="rs-editor-row">
                          <button className="rs-save-btn" onClick={() => handleTimeSave(info.key)}>Save</button>
                          <button className="rs-cancel-btn" onClick={() => setEditing(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="rs-footer">🌿 Times are in your local timezone.</p>
          </div>
        </div>
      </div>
    </>
  );
}

const modalCSS = `
.rs-backdrop {
  position: fixed; inset: 0;
  background: rgba(26,15,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 99998;
  animation: rs-fade 0.2s ease;
}
.rs-wrap {
  position: fixed; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
  pointer-events: none;
}
.rs-box {
  display: flex; flex-direction: column;
  width: min(460px, calc(100vw - 24px));
  max-height: min(85vh, 580px);
  background: ${cream};
  border-radius: 24px;
  border: 1px solid rgba(200,151,58,0.3);
  box-shadow: 0 24px 64px rgba(26,15,0,0.35);
  pointer-events: auto;
  animation: rs-pop 0.35s cubic-bezier(0.34,1.3,0.64,1);
}
.rs-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 24px 24px 0 28px;
  flex-shrink: 0;
}
.rs-eyebrow {
  margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
  text-transform: uppercase; color: ${gold};
}
.rs-title {
  margin: 4px 0 0; font-size: 22px; font-weight: 700;
  color: ${brown}; letter-spacing: -0.01em;
  font-family: 'Cormorant Garamond', Georgia, serif;
}
.rs-close {
  flex-shrink: 0;
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: #5c3d1e;
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.rs-close:hover { background: rgba(200,151,58,0.15); color: ${brown}; }
.rs-body {
  padding: 16px 28px 24px;
  overflow-y: auto;
  flex: 1;
}
.rs-banner {
  display: flex; align-items: center; gap: 12;
  background: ${gold}15; border: 1px solid ${gold}40;
  border-radius: 14px; padding: 12px 16px; margin-bottom: 16px;
  font-size: 13px; color: #5c3d1e; font-weight: 500;
}
.rs-allow-btn {
  margin-left: auto; flex-shrink: 0;
  background: linear-gradient(135deg, ${gold}, ${goldLt});
  border: 1px solid ${gold}; border-radius: 20px; padding: 6px 16px;
  font-size: 12px; font-weight: 700; color: ${brown};
  cursor: pointer; font-family: inherit; letter-spacing: 0.04em;
}
.rs-list { display: flex; flex-direction: column; gap: 2px; }
.rs-row {
  display: flex; align-items: center; gap: 12;
  padding: 12px 0; border-bottom: 1px solid ${gold}20;
  flex-wrap: wrap;
}
.rs-toggle {
  width: 44px; height: 26px; border-radius: 13px; border: 1.5px solid ${gold};
  background: #e7d7b8; cursor: pointer; position: relative; flex-shrink: 0;
  transition: background 0.25s; box-sizing: border-box;
  display: flex; align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.rs-toggle-on {
  background: linear-gradient(135deg, ${gold}, ${goldLt});
  border-color: ${gold};
  box-shadow: 0 2px 8px rgba(200,151,58,0.18);
}
.rs-toggle-thumb {
  position: absolute; top: 3.5px; left: 3.5px;
  width: 19px; height: 19px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  border: 1px solid ${goldLt};
  transition: transform 0.25s cubic-bezier(0.34,1.4,0.64,1);
}
.rs-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.rs-label { font-size: 14px; font-weight: 700; color: ${brown}; }
.rs-time { font-size: 12px; color: #5c3d1e; opacity: 0.75; }
.rs-edit-btn {
  background: transparent; border: 1px solid ${gold}30;
  border-radius: 8px; padding: 4px 8px; cursor: pointer;
  font-size: 13px; transition: all 0.15s; flex-shrink: 0;
}
.rs-edit-btn:hover { background: ${gold}20; border-color: ${gold}60; }
.rs-editor { width: 100%; padding-top: 10px; display: flex; flex-direction: column; gap: 10px; }
.rs-editor-row { display: flex; align-items: center; gap: 10px; }
.rs-editor-label { font-size: 13px; color: #5c3d1e; font-weight: 600; }
.rs-input-time {
  font-family: inherit; font-size: 14px; font-weight: 600;
  color: ${brown}; background: ${cream};
  border: 1px solid ${gold}50; border-radius: 10px; padding: 6px 12px;
  outline: none; cursor: pointer;
}
.rs-input-num {
  font-family: inherit; font-size: 14px; font-weight: 600;
  color: ${brown}; background: ${cream};
  border: 1px solid ${gold}50; border-radius: 10px; padding: 6px 12px;
  outline: none; width: 70px; text-align: center;
}
.rs-save-btn {
  background: linear-gradient(135deg, ${gold}, ${goldLt});
  border: 1px solid ${gold}; border-radius: 20px; padding: 6px 18px;
  font-size: 12px; font-weight: 700; color: ${brown};
  cursor: pointer; font-family: inherit; letter-spacing: 0.04em;
}
.rs-cancel-btn {
  background: transparent; border: 1px solid ${gold}40;
  border-radius: 20px; padding: 6px 14px;
  font-size: 12px; font-weight: 600; color: #5c3d1e; cursor: pointer;
  font-family: inherit;
}
.rs-footer { margin: 16px 0 0; font-size: 11.5px; color: #9a7a50; text-align: center; }
@keyframes rs-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rs-pop {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;

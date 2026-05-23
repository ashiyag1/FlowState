// src/hooks/usePushNotifications.js

import { useState, useEffect, useCallback } from 'react';

// ─── Defaults (24h format) ────────────────────────────────────────────────────
export const DEFAULT_SCHEDULE = {
  journal:  { hour: 9,  minute: 0,  enabled: true,  label: 'Journal Reminder',  emoji: '📓' },
  habit:    { hour: 20, minute: 0,  enabled: true,  label: 'Habit Check',        emoji: '✅' },
  hydrate:  { hour: 0,  minute: 0,  enabled: true,  label: 'Hydration Reminder', emoji: '💧', intervalMins: 45 },
  sleep:    { hour: 22, minute: 30, enabled: false, label: 'Sleep Reminder',     emoji: '🌙' },
};

const STORAGE_KEY = 'flowstate_reminder_schedule';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadSchedule() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_SCHEDULE, ...JSON.parse(saved) };
  } catch (_) {}
  return DEFAULT_SCHEDULE;
}

function saveSchedule(schedule) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
}

function msUntil(hour, minute) {
  const now    = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}

async function sendNotif({ title, body, tag }) {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, {
      body,
      icon:     '/favicon.ico',
      badge:    '/favicon.ico',
      tag,
      renotify: true,
      vibrate:  [200, 100, 200],
    });
  } catch (_) {}
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePushNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [supported,  setSupported]  = useState(false);
  const [schedule,   setSchedule]   = useState(loadSchedule);

  // Check support + register SW
  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    setSupported(true);
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  // Re-schedule whenever permission or schedule changes
  useEffect(() => {
    if (permission !== 'granted') return;

    const timers = [];

    // Daily timed reminders
    Object.entries(schedule).forEach(([key, r]) => {
      if (!r.enabled || r.intervalMins) return; // skip disabled & interval-based
      const fire = () => {
        sendNotif({ title: `${r.emoji} FlowState`, body: messageFor(key), tag: key });
        const t = setTimeout(fire, msUntil(r.hour, r.minute) + 24 * 60 * 60 * 1000);
        timers.push(t);
      };
      const t = setTimeout(fire, msUntil(r.hour, r.minute));
      timers.push(t);
    });

    // Interval-based reminders (hydration)
    Object.entries(schedule).forEach(([key, r]) => {
      if (!r.enabled || !r.intervalMins) return;
      const t = setInterval(() => {
        sendNotif({ title: `${r.emoji} FlowState`, body: messageFor(key), tag: key });
      }, r.intervalMins * 60 * 1000);
      timers.push(t);
    });

    return () => timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
  }, [permission, schedule]);

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!supported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      sendNotif({
        title: '🌿 FlowState',
        body:  "You're all set! We'll remind you throughout the day.",
        tag:   'welcome',
      });
    }
    return result;
  }, [supported]);

  // Update schedule
  const updateSchedule = useCallback((key, changes) => {
    setSchedule((prev) => {
      const next = { ...prev, [key]: { ...prev[key], ...changes } };
      saveSchedule(next);
      return next;
    });
  }, []);

  // Manual triggers
  const testReminder = useCallback((key) => {
    const r = schedule[key];
    if (!r) return;
    sendNotif({ title: `${r.emoji} FlowState`, body: messageFor(key), tag: key });
  }, [schedule]);

  return { permission, supported, schedule, requestPermission, updateSchedule, testReminder };
}

function messageFor(key) {
  const msgs = {
    journal: 'Have you journaled yet?',
    habit:   'Have you finished that habit?',
    hydrate: 'Stay hydrated!! Drink some water. 💧',
    sleep:   'Time to wind down and rest. 🌙',
  };
  return msgs[key] || 'A gentle reminder from FlowState.';
}

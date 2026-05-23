// sw.js — place this in your /public folder

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title   = data.title   || 'FlowState 🌿';
  const options = {
    body:    data.body    || 'A gentle reminder from FlowState.',
    icon:    data.icon    || '/favicon.ico',
    badge:   '/favicon.ico',
    tag:     data.tag     || 'flowstate-reminder',
    renotify: true,
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(url) && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

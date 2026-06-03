export function computeStreakFromDone(done) {
  if (!done || Object.keys(done).length === 0) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 366; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayDone = done[dateStr]
    if (dayDone && Object.keys(dayDone).length > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export function timeAgo(dateStr) {
  if (!dateStr) return 'Recently'
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'Yesterday'
  return `${Math.floor(diff / 86400)}d ago`
}

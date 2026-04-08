export function getSecondsUntil3AM(): number {
  const now = new Date()
  const next3AM = new Date()
  next3AM.setHours(3, 0, 0, 0)

  if (now >= next3AM) {
    next3AM.setDate(next3AM.getDate() + 1)
  }

  return Math.floor((next3AM.getTime() - now.getTime()) / 1000)
}

import type { RequestHandler } from 'express'

// Sends visitors on any other host (www., the herokuapp.com URL) or on plain http to
// https on the one canonical domain, so everyone shares the same origin and the secure
// login cookie works everywhere.
export function canonicalHost(host: string): RequestHandler {
  const canonical = host.trim().toLowerCase()

  return (req, res, next) => {
    const requestHost = req.get('host')?.toLowerCase()
    // Heroku's router terminates TLS and reports the original protocol in this header.
    const isHttp = req.get('x-forwarded-proto') === 'http'
    // Only page loads are redirected; API calls with a body would lose it on a redirect.
    if (!requestHost || (requestHost === canonical && !isHttp) || (req.method !== 'GET' && req.method !== 'HEAD')) {
      return next()
    }
    res.redirect(301, `https://${canonical}${req.originalUrl}`)
  }
}

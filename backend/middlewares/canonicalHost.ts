import type { RequestHandler } from 'express'

// Sends visitors on any other host (www., the herokuapp.com URL) to the one canonical domain,
// so everyone shares the same origin and the login cookie works everywhere.
export function canonicalHost(host: string): RequestHandler {
  const canonical = host.trim().toLowerCase()

  return (req, res, next) => {
    const requestHost = req.get('host')?.toLowerCase()
    // Only page loads are redirected; API calls with a body would lose it on a redirect.
    if (!requestHost || requestHost === canonical || (req.method !== 'GET' && req.method !== 'HEAD')) {
      return next()
    }
    res.redirect(301, `https://${canonical}${req.originalUrl}`)
  }
}

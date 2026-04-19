import { createApp } from '../app.ts'

export function createTestApp() {
  return createApp({ enableNonDevelopmentMiddleware: false })
}

import 'dotenv/config'
import { createApp } from './app.ts'
import { start } from './utils/fetchMovies.ts'
import cron from 'node-cron'
import debug from 'debug'
import { validateBackendEnv } from './lib/env.ts'

const env = validateBackendEnv()
const PORT = env.PORT || 3000
const app = createApp()
const cronDebug = debug('cron')

app.listen(PORT, async () => {
  console.log('server running on port: ', PORT)

  await start()

  cron.schedule('0 3 * * *', async () => {
    cronDebug('Running daily updates')
    await start()
  })
})

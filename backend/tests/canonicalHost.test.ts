import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { canonicalHost } from '../middlewares/canonicalHost.ts'

const app = express()
app.use(canonicalHost('movie-club.net'))
app.all('/{*splat}', (req, res) => { res.status(200).send('ok') })

describe('canonicalHost', () => {
  it('lets requests on the canonical domain through', async () => {
    const res = await request(app).get('/social/main').set('Host', 'movie-club.net')
    expect(res.status).toBe(200)
  })

  it('redirects www and the herokuapp URL to the canonical domain, keeping path and query', async () => {
    for (const host of ['www.movie-club.net', 'movies-club-46a0675ed565.herokuapp.com']) {
      const res = await request(app).get('/social/users/mo?tab=posts').set('Host', host)
      expect(res.status).toBe(301)
      expect(res.headers.location).toBe('https://movie-club.net/social/users/mo?tab=posts')
    }
  })

  it('redirects plain http on the canonical domain to https', async () => {
    const res = await request(app).get('/social/main?x=1').set('Host', 'movie-club.net').set('X-Forwarded-Proto', 'http')
    expect(res.status).toBe(301)
    expect(res.headers.location).toBe('https://movie-club.net/social/main?x=1')
  })

  it('lets https requests on the canonical domain through', async () => {
    const res = await request(app).get('/').set('Host', 'movie-club.net').set('X-Forwarded-Proto', 'https')
    expect(res.status).toBe(200)
  })

  it('ignores host case', async () => {
    const res = await request(app).get('/').set('Host', 'Movie-Club.NET')
    expect(res.status).toBe(200)
  })

  it('does not redirect requests that carry a body', async () => {
    const res = await request(app).post('/api/auth/login').set('Host', 'www.movie-club.net').send({ a: 1 })
    expect(res.status).toBe(200)
  })
})

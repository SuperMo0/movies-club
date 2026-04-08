import * as cheerio from 'cheerio'
import axios from 'axios'
import { prisma } from './../lib/prisma.ts'

const HEADERS = {
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Referer: 'https://elcinema.com/',
  'X-Requested-With': 'XMLHttpRequest',
}

const base = 'https://elcinema.com'

type Movie = {
  id: string
  image: string
  title: string
  description: string
  genre: string[]
  schedule?: DayEntry[]
}

type CinemaEntry = {
  name: string
  times: string[]
}

type DayEntry = {
  date: string
  cinemas: CinemaEntry[]
}

async function shouldFetch(): Promise<boolean> {
  try {
    const today = new Date().toLocaleDateString('en-CA')

    const record = await prisma.app_state.findUnique({ where: { key: 'lastDataUpdate' } })

    if (!record) return true

    if (record.value === today) {
      console.log('Movies are up to date.')
      return false
    }
    return true
  } catch (error) {
    console.log('Error checking date, forcing update:', error instanceof Error ? error.message : error)
    return true
  }
}

function getPageMovies(page: string, moviesArray: Movie[]): void {
  const $ = cheerio.load(page)
  const moviesTable = $('div.row[id^=w]')

  moviesTable.each((i, e) => {
    void i

    const rawId = e.attribs.id
    if (!rawId) return
    const id = rawId.slice(1)
    const image = $(e).find('> div:eq(0)').find('img').prop('attribs')['data-src'] as string
    const title = $(e).find('> div:eq(1)').find('h3').text().trim()
    const description = $(e).find('> div:eq(2) p:eq(1)').text().trim()

    const genre = $(e)
      .find('> div:eq(2)>ul:eq(1)')
      .children('li')
      .map((genreIndex, el) => {
        if (genreIndex === 0) return null
        return $(el).text().trim()
      })
      .get()
      .filter((item): item is string => item !== null)

    moviesArray.push({ id, image, title, description, genre })
  })
}

function getPages(page: string): string[] {
  const $ = cheerio.load(page)
  const pagination = $('ul.pagination>li')
    .not('.arrow')
    .map((i, el) => {
      void i
      return $(el).find('a').prop('href') as string | undefined
    })
    .get()
    .filter((link): link is string => Boolean(link))

  return pagination
}

export async function start(): Promise<void> {
  console.log('Starting Scraper')

  if (!(await shouldFetch())) return

  const movies: Movie[] = []
  const today = new Date().toLocaleDateString('en-CA')

  try {
    const response = await axios.get('https://elcinema.com/en/now', { headers: HEADERS })
    const mainPage = response.data as string

    getPageMovies(mainPage, movies)

    const links = getPages(mainPage)
    for (const link of links) {
      try {
        const res = await axios.get(base + link, { headers: HEADERS })
        getPageMovies(res.data as string, movies)
      } catch (error) {
        console.log(
          `Error fetching page ${link}:`,
          error instanceof Error ? error.message : error,
        )
      }
    }

    console.log(`Found ${movies.length} movies. Syncing DB...`)

    await scrapeShowtimes(movies)

    await prisma.app_state.upsert({
      where: { key: 'moviesData' },
      update: { value: JSON.stringify(movies) },
      create: { key: 'moviesData', value: JSON.stringify(movies) },
    })

    await prisma.app_state.upsert({
      where: { key: 'lastDataUpdate' },
      update: { value: today },
      create: { key: 'lastDataUpdate', value: today },
    })

    console.log('--- Scraper Finished Successfully ---')
  } catch (error) {
    console.error('Fatal Scraper Error:', error)
  }
}

async function scrapeShowtimes(movies: Movie[]): Promise<void> {
  console.log('Scraping Showtimes...')
  for (const movie of movies) {
    const url = `${base}/en/work/${movie.id}/theater/eg`
    movie.schedule = []

    try {
      const response = await axios.get(url, { headers: HEADERS })
      const $ = cheerio.load(response.data as string)

      $('.tabs-content .content').each((i, contentDiv) => {
        void i
        const divId = $(contentDiv).attr('id')
        if (divId && divId.startsWith('wtheater')) {
          const rawDate = divId.replace('wtheater', '')
          const formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`

          const dayEntry: DayEntry = { date: formattedDate, cinemas: [] }

          $(contentDiv)
            .find('.row')
            .each((j, row) => {
              void j
              const cinemaAnchor = $(row).find('.columns.large-4 a').not('.minimize').first()
              const cinemaName = cinemaAnchor.text().trim()

              if (cinemaName) {
                const timesList: string[] = []
                $(row)
                  .find('.columns.large-6 ul.list-separator li')
                  .each((k, li) => {
                    void k
                    const timeText = $(li).text().trim()
                    if (timeText && !timeText.includes('More')) {
                      timesList.push(timeText)
                    }
                  })
                if (timesList.length > 0) {
                  dayEntry.cinemas.push({ name: cinemaName, times: timesList })
                }
              }
            })

          if (dayEntry.cinemas.length > 0) movie.schedule?.push(dayEntry)
        }
      })
      console.log(`Scraped schedule for: ${movie.title}`)
    } catch (err) {
      console.log(`Skipping schedule for ${movie.title}:`, err instanceof Error ? err.message : err)
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

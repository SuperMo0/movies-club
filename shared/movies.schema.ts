export type Movie = {
    id: string
    image: string
    title: string
    description: string
    genre: string[]
    schedule?: DayEntry[]
}

export type CinemaEntry = {
    name: string
    times: string[]
}

export type DayEntry = {
    date: string
    cinemas: CinemaEntry[]
}
import type { Movie } from "moviesclub-shared/movies";
import fs from 'fs'

export function transformMoviesDataByCienma(data: Movie[]) {
    const transformedData: Record<string, Record<string, any>> = {};
    data.forEach((movie => {
        movie.schedule?.forEach(movieSchedule => {
            const crntDate = movieSchedule.date;
            movieSchedule.cinemas.forEach(cinema => {
                if (!transformedData[cinema.name]) transformedData[cinema.name] = {};
                if (!(transformedData[cinema.name]![movie.title])) transformedData[cinema.name]![movie.title] = {};
                if (!(transformedData[cinema.name]![movie.title]![crntDate])) {
                    transformedData[cinema.name]![movie.title]![crntDate] = cinema.times;
                }
            })
        })
    }))

    fs.writeFileSync('./data.json', JSON.stringify(transformedData, null, 2));
    return transformedData;
}
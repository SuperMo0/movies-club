import { GETTodayMovies, GETTodayCinemas } from "@/api/movies.api"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useTodayMovies() {
    return useSuspenseQuery({
        queryKey: ["movies"],
        queryFn: GETTodayMovies,
        select: (data) => data.movies,
        staleTime: Infinity
    })
}


export function useTodayCinemas() {
    return useSuspenseQuery({
        queryKey: ["cinemas"],
        queryFn: GETTodayCinemas,
        select: (data) => data.cinemas,
        staleTime: Infinity
    })
}
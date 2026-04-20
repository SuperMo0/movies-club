import { fetchTodayMovies } from "@/api/movies"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

export function useTodayMovies() {
    return useSuspenseQuery({
        queryKey: ["today-movies"],
        queryFn: fetchTodayMovies,
        staleTime: Infinity
    })
}
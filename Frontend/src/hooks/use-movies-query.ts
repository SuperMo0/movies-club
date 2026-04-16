import { fetchTodayMovies } from "@/api/movies"
import { useQuery } from "@tanstack/react-query"

export function useTodayMovies() {
    return useQuery({
        queryKey: ["today-movies"],
        queryFn: fetchTodayMovies,
        staleTime: Infinity
    })
}
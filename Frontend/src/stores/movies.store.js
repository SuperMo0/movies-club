import api from "@/lib/axios";
import { create } from "zustand";

export const useMoviesStore = create((set, get) => ({

    allMovies: null,

    todayMovies: null,

    getAllMovies: async function () {
        if (get().allMovies) return;
        let allMovies = new Map();
        try {
            let result = await api.get('/movies');
            let movies = result.data.movies;
            movies.forEach(m => {
                allMovies.set(m.id, m);
            })
        } catch (error) {
            console.error('Failed to fetch all movies', error);
        }
        set({ allMovies });
    },

    getTodayMovie: async function () {
        if (get().todayMovies) return;
        let todayMovies = new Map();
        try {
            let result = await api.get('/movies/today');
            let movies = result.data.movies;
            movies.forEach(m => {
                todayMovies.set(m.id, m);
            })
        } catch (error) {
            console.error('Failed to fetch today movies', error);
        }
        set({ todayMovies });
    }

}))

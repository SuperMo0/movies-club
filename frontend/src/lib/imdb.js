const imdbCache = new Map()
const imdbInFlight = new Map()

function normalizeQuery(query) {
    return String(query || "").trim().toLowerCase()
}

export function getImdbCacheKey(query) {
    return normalizeQuery(query)
}

export function getCachedImdbTitle(query) {
    const normalized = normalizeQuery(query)
    if (!normalized) return null
    return imdbCache.get(normalized) ?? null
}

export async function searchImdbTitle(query) {
    const normalized = normalizeQuery(query)
    if (!normalized) return null

    if (imdbCache.has(normalized)) {
        return imdbCache.get(normalized)
    }

    if (imdbInFlight.has(normalized)) {
        return imdbInFlight.get(normalized)
    }

    const request = fetch(
        `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(normalized)}&limit=1`
    )
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`IMDb search failed with status ${response.status}`)
            }

            const payload = await response.json()
            const title = payload?.titles?.[0]
            if (!title) return null

            const rating = title?.rating?.aggregateRating
            const imdbUrl = title?.id ? `https://www.imdb.com/title/${title.id}/` : null

            const result = {
                id: title?.id || null,
                rating: typeof rating === "number" ? rating : null,
                imdbUrl,
            }

            imdbCache.set(normalized, result)
            return result
        })
        .catch(() => {
            imdbCache.set(normalized, null)
            return null
        })
        .finally(() => {
            imdbInFlight.delete(normalized)
        })

    imdbInFlight.set(normalized, request)
    return request
}

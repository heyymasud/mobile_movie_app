export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

export const fetchMovies = async ({
    query, sortBy
}: {
    query: string;
    sortBy?: string;
}): Promise<Movie[]> => {
    let endpoint: string | URL | Request;
    if (query) {
        endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    } else {
        switch (sortBy) {
            case 'upcoming':
                endpoint = `${TMDB_CONFIG.BASE_URL}/movie/upcoming?language=en-US&page=1`;
                break;

            case 'rating':
                endpoint = `${TMDB_CONFIG.BASE_URL}/movie/top_rated?language=en-US&page=1`;
                break;

            default:
                endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=vote_count.desc`;
                break;
        }
    }

    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
};

export const fetchMovieDetails = async (
    movieId: string
): Promise<MovieDetails> => {
    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
            {
                method: "GET",
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw error;
    }
};
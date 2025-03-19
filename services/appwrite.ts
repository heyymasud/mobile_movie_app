import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_METRICS_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_METRICS_ID!;
const COLLECTION_SAVED_MOVIE_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_SAVED_MOVIE_ID!;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_METRICS_ID, [
            Query.equal("searchTerm", query),
        ]);

        if (result.documents.length > 0 && result.documents[0].movie_id === movie.id) {
            const existingMovie = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_METRICS_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_METRICS_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                overview: movie.overview
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
};

export const saveMovie = async (movie: MovieDetails) => {
    try {
        await database.createDocument(DATABASE_ID, COLLECTION_SAVED_MOVIE_ID, ID.unique(), {
            movie_id: movie.id,
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            vote_average: movie.vote_average
        });
    } catch (error) {
        console.error("Error saving movie:", error);
        throw error;
    }
}

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_SAVED_MOVIE_ID, [
            Query.orderDesc("$createdAt"),
        ]);

        return result.documents as unknown as SavedMovie[];
    } catch (error) {
        console.log("error getSavedMovies", error);
        return undefined;
    }
}

export const getSavedMovieDetails = async (movieId: string): Promise<SavedMovie | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_SAVED_MOVIE_ID, [
            Query.equal("movie_id", Number(movieId)),
        ]);

        return result.documents[0] as unknown as SavedMovie;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const deleteSavedMovie = async (movieId: string) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_SAVED_MOVIE_ID, [
            Query.equal("movie_id", Number(movieId)),
        ])
        if (result.documents.length > 0) {
            await database.deleteDocument(DATABASE_ID, COLLECTION_SAVED_MOVIE_ID, result.documents[0].$id);
        }
    } catch (error) {
        console.error("Error deleting movie:", error);
        throw error;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_METRICS_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "../components/SearchBar";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import React from "react";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "../components/TrendingCard";
import TopRatedCard from "../components/TopRatedCard";
import UpcomingCard from "../components/UpcomingCard";
import MovieInfo from "../components/MovieInfo";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({ query: "" }))

  const {
    data: topRatedMovies,
    loading: topRatedMoviesLoading,
    error: topRatedMoviesError
  } = useFetch(() => fetchMovies({ query: "", sortBy: "rating" }))

  const {
    data: upcomingMovies,
    loading: upcomingMoviesLoading,
    error: upcomingMoviesError
  } = useFetch(() => fetchMovies({ query: "", sortBy: "upcoming" }))
  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          minHeight: "100%"
        }} >
        {moviesLoading || trendingLoading || topRatedMoviesLoading || upcomingMoviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000FF"
            className="mt-10 self-center" />
        ) : moviesError || trendingError || topRatedMoviesError || upcomingMoviesError ? (
          <Text>Error: {moviesError?.message || trendingError?.message || topRatedMoviesError?.message || upcomingMoviesError?.message}</Text>
        ) : (
          <>
            <Link href={`/movies/${trendingMovies?.[0]?.movie_id}`} asChild>
              <TouchableHighlight>
                <View className="w-full">
                  <View className="relative h-80 w-screen -translate-x-5">
                    <Image source={{ uri: trendingMovies?.[0]?.poster_url ? `https://image.tmdb.org/t/p/w500${trendingMovies?.[0]?.poster_url}` : 'https://placehold.co/600x400/1a1a1a/ffffff.png' }} className='w-full h-full absolute' resizeMode='cover' />
                    <LinearGradient
                      colors={['transparent', 'rgba(0, 0, 0, 0.5)', '#030014']}
                      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%' }}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                    />
                  </View>
                  <View className="w-full absolute bottom-0">
                    <MovieInfo label={trendingMovies?.[0]?.title} value={trendingMovies?.[0]?.overview} isHero />
                  </View>
                </View>
              </TouchableHighlight>
            </Link>
            <View className="flex-1 mt-5">
              <SearchBar
                placeholder="Search for a movie"
                onPress={() => router.push("/search")} />
              {trendingMovies && (
                <View className="mt-5">
                  <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                </View>
              )}
              <>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-5 mt-3"
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()} />
                <Text className="text-lg text-white font-bold mt-5 mb-3">Top Rated Movies</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-5 mt-3"
                  data={topRatedMovies}
                  renderItem={({ item }) => (
                    <TopRatedCard {...item} />
                  )}
                  keyExtractor={(item) => item.id.toString()} />
                <Text className="text-lg text-white font-bold mt-5 mb-3">Upcoming Movies</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-5 mt-3"
                  data={upcomingMovies}
                  renderItem={({ item }) => (
                    <UpcomingCard {...item} />
                  )}
                  keyExtractor={(item) => item.id.toString()} />
                <Text className="text-lg text-white font-bold mt-5 mb-3">Recomended Movies</Text>
                <FlatList
                  data={movies}
                  renderItem={({ item }) => (
                    <MovieCard {...item} />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false} />
              </>
            </View>
          </>
        )
        }
      </ScrollView>
    </View>
  );
}

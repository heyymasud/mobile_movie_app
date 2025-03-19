import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';
import MovieInfo from '../components/MovieInfo';
import { LinearGradient } from 'expo-linear-gradient';
import { deleteSavedMovie, getSavedMovieDetails, saveMovie } from '@/services/appwrite';

const MovieDetails = () => {
    const [isSaved, setIsSaved] = useState(false);
    const { id } = useLocalSearchParams();

    const { data: movie, loading, error } = useFetch(() => fetchMovieDetails(id as string));

    const { data: savedMovie } = useFetch(() => getSavedMovieDetails(id as string));

    useEffect(() => {
        if (savedMovie) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [savedMovie]);


    const handleSavePress = async ({ movie }: { movie: MovieDetails }) => {
        try {
            if (isSaved) {
                await Promise.all([
                    deleteSavedMovie(movie.id.toString()),
                    setIsSaved(false)
                ]);
            } else {
                await Promise.all([
                    saveMovie(movie),
                    setIsSaved(true)
                ]);
            }
        } catch (error) {
            console.error("Error handling save press:", error);
        }
    }
    return (
        <View className='bg-primary flex-1'>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000FF"
                        className="mt-10 self-center" />
                ) : error ? (
                    <Text>Error: {error?.message}</Text>
                ) : (
                    <>
                        <View className='relative'>
                            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} className='w-full h-[550px]' resizeMode='stretch' />
                            <LinearGradient
                                colors={['#030014', 'transparent']}
                                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%' }}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 0.5 }}
                            />
                        </View>
                        <View className='flex-col items-start justify-center mt-5 px-5'>
                            <View className='flex-row items-center justify-between w-full'>
                                <View className='flex-1'>
                                    <Text className='text-white text-xl font-bold'>{movie?.title}</Text>
                                    <View className='flex-row items-center gap-x-1 mt-2'>
                                        <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
                                        <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
                                    </View>
                                </View>
                                {movie && (
                                    <TouchableOpacity onPress={() => handleSavePress({ movie })} className='flex-1 items-end justify-center gap-y-1'>
                                        <Image source={icons.save} className='size-8' tintColor={isSaved ? '#AB8BFF' : '#A8B5DB'} />
                                        <Text className={` text-sm font-bold ${isSaved ? 'text-accent' : 'text-light-200'}`}>{isSaved ? 'Saved' : 'Save'}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View className='flex-row items-center bg-dark-100 rounded-md px-2 py-1 gap-x-1 mt-2'>
                                <Image source={icons.star} className='size-4' />
                                <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
                                <Text className='text-light-200 text-sm'>({movie?.vote_count} votes)</Text>
                            </View>
                            <MovieInfo label='Overview' value={movie?.overview} />
                            <MovieInfo label='Genres' value={movie?.genres?.map((genre: any) => genre.name).join(' - ') || 'N/A'} />
                            <View className='flex-row justify-between w-1/2'>
                                <MovieInfo label='Budget' value={`$${(movie?.budget ?? 0) / 1_000_000} million`} />
                                <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue ?? 0) / 1_000_000}`} />
                            </View>
                            <MovieInfo label='Production Companies' value={movie?.production_companies?.map((company: any) => company.name).join(' - ') || 'N/A'} />
                        </View>
                    </>
                )}
            </ScrollView>
            <TouchableOpacity onPress={router.back} className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex-row items-center justify-center z-50'>
                <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor='#FFF' />
                <Text className='text-white font-semibold text-base' >Go Back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MovieDetails
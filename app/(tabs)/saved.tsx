import { View, Text, Image, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import useFetch from '@/services/useFetch'
import { getSavedMovies } from '@/services/appwrite'
import { images } from '@/constants/images'
import { Link } from 'expo-router'
import SavedCard from '../components/SavedCard'

const saved = () => {
    const {
        data: savedMovies,
        loading: savedMoviesLoading,
        error: savedMoviesError
    } = useFetch(() => getSavedMovies());
    return (
        <View className='flex-1 bg-primary'>
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
                {savedMoviesLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000FF"
                        className="mt-10 self-center" />
                ) : savedMoviesError ? (
                    <Text>Error: {savedMoviesError?.message}</Text>
                ) : (
                    <View className="flex-1 mt-5">
                        {savedMovies && (
                            <View className="mt-5">
                                <FlatList
                                    data={savedMovies}
                                    renderItem={({ item }) => (
                                        <SavedCard {...item} />
                                    )}
                                    keyExtractor={(item) => item.movie_id.toString()}
                                    numColumns={3}
                                    columnWrapperStyle={{
                                        justifyContent: "flex-start",
                                        gap: 20,
                                        paddingRight: 5,
                                        marginBottom: 10
                                    }}
                                    className="mt-2 pb-32"
                                    scrollEnabled={false}
                                    ListHeaderComponent={
                                        <>
                                            <View className="w-full flex-row justify-center my-10 items-center">
                                                <Image source={icons.logo} className="w-28" resizeMode="contain" />
                                            </View>
                                            <Text className="text-lg text-white font-bold mb-3">Saved Movies</Text>
                                        </>
                                    } />
                            </View>
                        )}
                    </View>
                )
                }
            </ScrollView>
        </View >
    )
}

export default saved
import { View, Text, TouchableOpacity, Image } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import React from 'react'
import { Link } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const UpcomingCard = ({ id, poster_path, title, release_date }: Movie) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className='w-36 relative '>
                <Image
                    source={{ uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://placehold.co/600x400/1a1a1a/ffffff.png' }}
                    className='w-full h-48 rounded-lg'
                    resizeMode='cover'
                />
                <Text className='text-sm font-bold text-light-200 mt-2' numberOfLines={1}>{title}</Text>
                <View className='flex-row items-center justify-between w-full'>
                    <Text className='text-xs text-light-300 font-medium mt-1'>{release_date?.split('-')[0]}</Text>
                    <Text className='text-xs text-light-300 font-medium uppercase mt-1'>Movie</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default UpcomingCard
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'

const SavedCard = ({ movie_id, poster_url, title, vote_average, $createdAt }: SavedMovie) => {
    return (
        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity className='w-[30%]'>
                <Image
                    source={{
                        uri: poster_url
                    }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover" />
                <View className='flex-row items-center justify-between mt-2'>
                    <Text className='text-xs text-light-300 font-medium'>Added at:</Text>
                    <Text className='text-xs text-light-300 font-medium uppercase'>{new Date($createdAt).toLocaleDateString()}</Text>
                </View>
                <Text className='text-sm font-bold text-white mt-1' numberOfLines={1}>
                    {title}
                </Text>
                <View className='flex-row items-center justify-start gap-x-1'>
                    <Image source={icons.star} className='size-4' />
                    <Text className='text-xs text-white font-bold uppercase'>{Math.round(vote_average / 2)}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default SavedCard
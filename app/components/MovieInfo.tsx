import { View, Text } from 'react-native'
import React from 'react'

interface MovieInfoProps {
    label: any;
    value?: string | number | null;
    isHero?: boolean
}

const MovieInfo = ({ label, value, isHero }: MovieInfoProps) => {
    return (
        <View className='flex-col items-start justify-center mt-5'>
            <Text className={isHero ? 'text-white font-bold text-lg' : 'text-light-200 font-normal text-sm'}>{label}</Text>
            <Text className={isHero ? 'text-light-200 text-sm mt-2' : 'text-light-100 font-bold text-sm mt-2'} numberOfLines={isHero ? 4 : undefined}>{value || 'N/A'}</Text>
        </View>
    )
}

export default MovieInfo
import { Image, Text, View } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function Features() {
    return (
        <View style={{height: hp(58.7)}} className="space-y-3">
            <Text style={{fontSize: wp(6.5)}} className="font-semibold text-grey-700">Features</Text>
            <View className="bg-cyan-400 p-4 rounded-xl space-y-1">
                <View className="flex-col items-center space-x-1">
                    <Image source={require('../../assets/images/ai1.png')} className="w-30 h-30" />
                    <Text style={{fontSize: wp(5.5)}} className="font-semibold text-grey-700 my-4">NLP Feature</Text>
                </View>
                <Text style={{fontSize: wp(4.5)}} className="text-grey-700 font-medium text-justify">We seamlessly merge AI into the future of voice communication, enhancing your chat experience with rapid responses. Our voice assistant is designed to elevate communication, providing a swift and efficient platform. Embrace the future of conversational technology with our integrated AI for an unparalleled voice chat experience.</Text>
            </View>
        </View>
    )
}
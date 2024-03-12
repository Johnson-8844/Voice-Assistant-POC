import { Image, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';


export default function WelcomeScreen() {
    const navigation = useNavigation();
    return (
      <SafeAreaView className="flex-1 flex justify-around bg-white">
           <View className="space-y-2">
             <Text style={{fontSize: wp(10)}} className="text-center font-bold text-grey-700">VOICE GPT</Text>
             <Text style={{fontSize: wp(4)}} className="text-center tracing-wider text-grey-600 font-semibold">The Future is here, powered by AI</Text>
           </View> 
           <View className="flex-row justify-center">
             <Image source={require('../../assets/images/bot-icon.png')} className="w-60 h-60"/>
           </View>  
           <TouchableOpacity onPress={() => navigation.navigate('home') } className="bg-cyan-400 mx-5 p-4 rounded-2xl">
            <Text style={{fontSize: wp(6)}} className="text-center font-bold text-white">Get Started</Text>
           </TouchableOpacity>
      </SafeAreaView>
    );
}
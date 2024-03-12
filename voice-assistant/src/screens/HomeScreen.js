import { SafeAreaView, Image, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Features from '../components/features';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Voice from '@react-native-community/voice';
import { apiCall } from '../api/openAI';
import Tts from 'react-native-tts';

export default function HomeScreen() {
    
    const [messages,setMessages]=useState([]);
    const [recording,setRecording]=useState(false);
    const [speaking,setSpeaking]=useState(false);
    const [result, setResult] = useState("");
    const ScrollViewRef = useRef();
    const [loading, setLoading] = useState(false);


    const clearChat = () => {
        setMessages([]);
        Tts.stop();
        setSpeaking(false)
    };
    const stopSpeak = () => {
        Tts.stop();
        setSpeaking(false);
    }

    const speechStartHandler = () =>{
        console.log('Speech start handler');
    }
    const speechEndHandler = () =>{
        setRecording(false);
        console.log('Speech End handler');
    }
    const speechResultHandler = async e =>{
        console.log('voice enent:' ,e);
        const text = e.value[0];
        //setResult(text);
        fetchResponse(text);
        console.log("Fetch response function initiated")
    }
    const speechErrorHandler = e =>{
        console.log('Speech error handler :' ,e);
    }

    const startRecording= async ()=>{
        setRecording(true)
        Tts.stop();
        setSpeaking(false)
        try{
            await Voice.start('en-US');
        }catch(error){
            console.error('Start Record -', error);
        }
    }
    const stopRecording= async ()=>{
        try{
            await Voice.stop();
            setRecording(false);
        }catch(error){
            console.error('Stop Record -', error);
        }
    }

    const fetchResponse = (text) => {
        if(text.length>0){
            messages.push({role: 'user', content: text});
            updateScrollView();
            setLoading(true)
            apiCall(text, messages).then(res => {
                setLoading(false)
                if(res.success) {
                    messages.push({role: 'assistant', content: res.data})
                    startTexttoSpeech(res.data);
                    updateScrollView();
                } else {
                    Alert.alert("Error : ",res.msg)
                }
            })
        }
    }

    const startTexttoSpeech = message => {
        setSpeaking(true);
        Tts.speak(message, {
            androidParams: {
              KEY_PARAM_PAN: -1,
              KEY_PARAM_VOLUME: 0.5,
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
          });
    }

    const updateScrollView = () => {
        setTimeout(()=> {
            ScrollViewRef?.current?.scrollToEnd({animated: true})
        }, 200)
    }

    useEffect(()=>{
        // voice handler events
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultHandler;
        Voice.onSpeechError= speechErrorHandler;

        // TTS events
        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
        Tts.addEventListener('tts-finish', (event) => (console.log("finish", event), setSpeaking(false)));
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
    
        return ()=>{
            Voice.destroy().then(Voice.removeAllListeners);
        }
    },[])


    return (
        <View className="flex-1 bg-white">
          <SafeAreaView className="flex-1 flex mx-5">
              <View className="flex-row mt-20 justify-center">
                  <Image source={require('../../assets/images/bot-icon.png')} className="w-40 h-40" />
              </View>
  
              {
                  messages.length > 0 ? (
                      <View className="space-y-2 flex-1">
                          <Text style={{fontSize: wp(5)}} className="text-grey-700 font-semibold ml-1">Assistant</Text>
                          <View style={{height: hp(54)}} className="bg-neutral-200 rounded-3xl p-4">
                              <ScrollView ref={ScrollViewRef} bounces={false} className="space-y-4" showsVerticalScrollIndicator={false}>
                                  {
                                      messages.map((message, index) => {
                                          if (message.role == 'assistant') {
                                              return (
                                                  <View key={index} style={{width: wp(68)}} className="bg-cyan-200 rounded-xl py-3 px-2 rounded-tl-none">
                                                      <Text style={{fontSize: wp(4)}} className="text-black text-justify px-2">{ message.content }</Text>
                                                  </View>
                                              )
                                          } else {
                                              return (
                                                  <View key={index} className="flex-row justify-end">
                                                      <View style={{width: wp(65)}} className="bg-white rounded-xl py-3 px-2 rounded-tr-none">
                                                          <Text style={{fontSize: wp(4)}} className="text-black text-justify">{ message.content }</Text>
                                                      </View>
                                                  </View>
                                              )
                                          }
                                      })
                                  }
                              </ScrollView>
                          </View>
                      </View>
                  ) : (
                      <Features />
                  )
  
              }
  
              <View className="flex justify-center items-center py-3">
                  {
                    loading? (
                        <Image className="rounded-full" source={require('../../assets/images/loading.gif')} style={{width: wp(22), height: wp(22)}} />
                    ) : (
                        recording? (
                            <TouchableOpacity onPress={stopRecording}>
                                <Image className="rounded-full" source={require('../../assets/images/podcast.gif')} style={{width: wp(22), height: wp(22)}} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={startRecording}> 
                                <Image className="rounded-full" source={require('../../assets/images/voice.png')} style={{width: wp(20), height: wp(20)}} />
                            </TouchableOpacity>
                        )
                    )
                  }
  
                  {
                      messages.length>0 && (
                          <TouchableOpacity onPress={clearChat} className="bg-neutral-400 rounded-3xl px-4 py-2 absolute right-8">
                              <Text className="text-white font-semibold">Clear</Text>
                          </TouchableOpacity>
                      )
                  }
  
                  {
                      speaking && (
                          <TouchableOpacity onPress={stopSpeak} className="bg-red-400 rounded-3xl px-4 py-2 absolute left-8">
                              <Text className="text-white font-semibold">Stop</Text>
                          </TouchableOpacity>
                      )
                  }
                  
              </View>
  
          </SafeAreaView>
        </View>
      );
  }
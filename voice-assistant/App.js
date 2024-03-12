import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import AppNavigation from './src/navigations';

export default function App() {
  return (
    <AppNavigation />
  );
}
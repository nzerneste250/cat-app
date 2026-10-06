import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePrediction } from '../context/PredictionContext';
import { t } from '../i18n/translations';
import { colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import PredictScreen from '../screens/PredictScreen';
import CropScreen from '../screens/CropScreen';
import LandSeasonScreen from '../screens/LandSeasonScreen';
import FarmingInfoScreen from '../screens/FarmingInfoScreen';
import ResultScreen from '../screens/ResultScreen';
import SavedScreen from '../screens/SavedScreen';

export type PredictionStackParamList = { Location: undefined; Crop: undefined; LandSeason: undefined; FarmingInfo: undefined; Result: undefined };
export type BottomTabParamList = { Home: undefined; Prediction: NavigatorScreenParams<PredictionStackParamList> | undefined; Saved: undefined };
export type RootStackParamList = PredictionStackParamList;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<BottomTabParamList>();

function PredictionStack() {
  return <Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen name="Location" component={PredictScreen} /><Stack.Screen name="Crop" component={CropScreen} /><Stack.Screen name="LandSeason" component={LandSeasonScreen} /><Stack.Screen name="FarmingInfo" component={FarmingInfoScreen} /><Stack.Screen name="Result" component={ResultScreen} /></Stack.Navigator>;
}

function MainTabs() {
  const { language } = usePrediction();
  const { height } = useWindowDimensions();
  const icons: Record<keyof BottomTabParamList, keyof typeof Ionicons.glyphMap> = { Home: 'home-outline', Prediction: 'analytics-outline', Saved: 'bookmark-outline' };
  return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.secondaryText, tabBarLabelStyle: { fontSize: height < 500 ? 10 : 11, fontWeight: '700' }, tabBarStyle: { height: height < 500 ? 52 : 64, paddingTop: height < 500 ? 2 : 6, borderTopColor: colors.border, backgroundColor: colors.white }, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? icons[route.name].replace('-outline', '') as keyof typeof Ionicons.glyphMap : icons[route.name]} size={height < 500 ? 19 : 22} color={color} /> })}>
    <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t(language, 'home') }} />
    <Tabs.Screen name="Prediction" component={PredictionStack} options={{ tabBarLabel: t(language, 'prediction') }} />
    <Tabs.Screen name="Saved" component={SavedScreen} options={{ tabBarLabel: t(language, 'saved') }} />
  </Tabs.Navigator>;
}

export default function AppNavigator() {
  return <NavigationContainer><MainTabs /></NavigationContainer>;
}
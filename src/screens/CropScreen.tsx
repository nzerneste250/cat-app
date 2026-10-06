import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { usePrediction } from '../context/PredictionContext';
import { t } from '../i18n/translations';
import type { Crop } from '../types';
import type { PredictionStackParamList } from '../navigation/AppNavigator';

const crops: Array<{ name: Crop; icon: keyof typeof Ionicons.glyphMap }> = [
  { name: 'Maize', icon: 'leaf-outline' }, { name: 'Irish Potatoes', icon: 'ellipse-outline' },
  { name: 'Beans', icon: 'nutrition-outline' }, { name: 'Rice', icon: 'water-outline' },
  { name: 'Banana', icon: 'leaf-outline' }, { name: 'Cassava', icon: 'flower-outline' },
];

export default function CropScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PredictionStackParamList>>();
  const { language, draft, updateDraft } = usePrediction();
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const [crop, setCrop] = useState<Crop | undefined>(draft.crop);
  const next = () => { if (crop) { updateDraft({ crop }); navigation.navigate('LandSeason'); } };
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}>
    <Text style={s.step}>2 / 4</Text><Text style={s.title}>{text('crop')}</Text><Text style={s.desc}>{text('cropDescription')}</Text>
    <View style={s.grid}>{crops.map((item) => <Pressable key={item.name} onPress={() => setCrop(item.name)} style={[s.crop, crop === item.name && s.selected]}><Ionicons name={item.icon} size={29} color={crop === item.name ? colors.primary : colors.secondaryText}/><Text style={s.cropText}>{item.name}</Text>{crop === item.name && <Ionicons style={s.check} name="checkmark-circle" size={20} color={colors.primary}/>}</Pressable>)}</View>
    {!crop && <Text style={s.error}>{text('selectCrop')}</Text>}
    <View style={s.actions}><Pressable style={s.back} onPress={() => navigation.goBack()}><Text style={s.backText}>{text('back')}</Text></Pressable><Pressable style={s.primary} onPress={next}><Text style={s.primaryText}>{text('continue')}</Text><Ionicons name="arrow-forward" size={20} color={colors.white}/></Pressable></View>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingBottom:40},step:{fontWeight:'800',color:colors.primary,marginBottom:8},title:{fontSize:29,fontWeight:'800',color:colors.text},desc:{fontSize:15,lineHeight:22,color:colors.secondaryText,marginVertical:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:12},crop:{width:'47%',minHeight:120,borderRadius:16,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white,padding:15,justifyContent:'center',alignItems:'center',position:'relative'},selected:{borderColor:colors.primary,borderWidth:2,backgroundColor:colors.lightGreen},cropText:{fontSize:14,fontWeight:'700',color:colors.text,textAlign:'center',marginTop:10},check:{position:'absolute',right:9,top:9},error:{color:colors.error,fontSize:13,marginTop:12},actions:{flexDirection:'row',gap:10,alignItems:'center',marginTop:28},back:{minHeight:54,borderRadius:14,borderWidth:1,borderColor:colors.primary,alignItems:'center',justifyContent:'center',paddingHorizontal:20},backText:{color:colors.primary,fontWeight:'800'},primary:{flex:1,minHeight:54,borderRadius:14,backgroundColor:colors.primary,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},primaryText:{color:colors.white,fontWeight:'800'}});
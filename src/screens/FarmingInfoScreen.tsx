import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { usePrediction } from '../context/PredictionContext';
import { t } from '../i18n/translations';
import type { PredictionStackParamList } from '../navigation/AppNavigator';
import PlantingMonthSelector from '../components/PlantingMonthSelector';

export default function FarmingInfoScreen() {
  const nav = useNavigation<NativeStackNavigationProp<PredictionStackParamList>>();
  const { language, draft, updateDraft } = usePrediction();
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const [fertilizer, setFertilizer] = useState<boolean | undefined>(draft.fertilizer);
  const [improved, setImproved] = useState<boolean | undefined>(draft.improvedSeeds);
  const [month, setMonth] = useState(draft.plantingMonth);
  const [year, setYear] = useState(draft.plantingYear);
  const [error, setError] = useState('');
  const next = () => { if (fertilizer === undefined || improved === undefined || month === undefined || year === undefined) { setError(text('selectMonth')); return; } updateDraft({ fertilizer, improvedSeeds: improved, plantingMonth: month, plantingYear: year }); nav.navigate('Result'); };
  const yesNo = (value: boolean | undefined, setter: (v: boolean) => void) => <View style={s.row}><Pressable onPress={() => setter(true)} style={[s.choice, value === true && s.selected]}><Text style={s.choiceText}>{text('yes')}</Text></Pressable><Pressable onPress={() => setter(false)} style={[s.choice, value === false && s.selected]}><Text style={s.choiceText}>{text('no')}</Text></Pressable></View>;
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}><Text style={s.step}>4 / 4</Text><Text style={s.title}>{text('farmingInfo')}</Text><Text style={s.desc}>{text('farmingDescription')}</Text><View style={s.card}><Text style={s.label}>{text('fertilizer')}</Text>{yesNo(fertilizer, setFertilizer)}<Text style={s.label}>{text('improvedSeeds')}</Text>{yesNo(improved, setImproved)}<Text style={s.label}>{text('plantingMonth')}</Text><PlantingMonthSelector language={language} month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />{error ? <Text style={s.error}>{error}</Text> : null}</View><View style={s.actions}><Pressable style={s.back} onPress={() => nav.goBack()}><Text style={s.backText}>{text('back')}</Text></Pressable><Pressable style={s.primary} onPress={next}><Text style={s.primaryText}>{text('predictHarvest')}</Text></Pressable></View></ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({ safe:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingBottom:40},step:{fontWeight:'800',color:colors.primary,marginBottom:8},title:{fontSize:29,fontWeight:'800',color:colors.text},desc:{fontSize:15,lineHeight:22,color:colors.secondaryText,marginVertical:10},card:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:18,padding:17,marginTop:10},label:{fontSize:14,fontWeight:'800',color:colors.text,marginTop:14,marginBottom:8},row:{flexDirection:'row',gap:10},choice:{flex:1,minHeight:50,borderRadius:12,borderWidth:1,borderColor:colors.border,justifyContent:'center',alignItems:'center'},selected:{backgroundColor:colors.lightGreen,borderColor:colors.primary},choiceText:{color:colors.text,fontWeight:'700'},error:{color:colors.error,fontSize:13,marginTop:13},actions:{flexDirection:'row',gap:10,marginTop:26},back:{minHeight:54,borderRadius:14,borderWidth:1,borderColor:colors.primary,justifyContent:'center',alignItems:'center',paddingHorizontal:20},backText:{color:colors.primary,fontWeight:'800'},primary:{flex:1,minHeight:54,borderRadius:14,backgroundColor:colors.primary,justifyContent:'center',alignItems:'center',paddingHorizontal:8},primaryText:{color:colors.white,fontWeight:'800',fontSize:13,textAlign:'center'} });
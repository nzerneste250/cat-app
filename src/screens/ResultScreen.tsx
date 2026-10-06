import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { usePrediction } from '../context/PredictionContext';
import { predictHarvest } from '../services';
import { savePrediction } from '../storage';
import { t } from '../i18n/translations';
import type { PredictionInput, SavedPrediction } from '../types';
import type { PredictionStackParamList } from '../navigation/AppNavigator';

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PredictionStackParamList>>();
  const { language, draft, resetDraft } = usePrediction();
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const [saved, setSaved] = useState(false);
  const input = draft as PredictionInput;
  const result = useMemo(() => predictHarvest(input), [input]);
  const save = async () => { if (saved) return; const item: SavedPrediction = { ...input, ...result, id: `${Date.now()}`, date: new Date().toISOString() }; await savePrediction(item); setSaved(true); };
  const share = () => Share.share({ message: `Harvest Prediction\n\nCrop: ${input.crop}\nLocation: ${input.district}, ${input.province}\nSeason: ${input.season}\nAgricultural year: ${input.agriculturalYear}\nPlanting month: ${input.plantingDateLabel}\nLand: ${input.landHectares} ha\nExpected harvest: ${result.expectedHarvestTonnes} tonnes\nExpected yield: ${result.yieldPerHectare} tonnes/ha\n\nEstimate only. Actual harvest may vary.` });
  const another = () => { resetDraft(); navigation.popToTop(); };
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}>
    <Text style={s.title}>{text('result')}</Text><Text style={s.desc}>{text('resultSummary')}</Text>
    <View style={s.details}><Detail label={text('crop')} value={input.crop}/><Detail label={text('location')} value={`${input.district}, ${input.province}`}/><Detail label={text('season')} value={`Season ${input.season}`}/><Detail label={text('agriculturalYear')} value={String(input.agriculturalYear)}/><Detail label={text('plantingMonth')} value={input.plantingDateLabel}/><Detail label={text('landSize')} value={`${input.landSize} ${input.unit === 'hectares' ? text('hectares') : text('squareMetres')}`}/></View>
    <View style={s.main}><Text style={s.mainLabel}>{text('expectedHarvest')}</Text><Text style={s.amount}>{result.expectedHarvestTonnes} <Text style={s.unit}>{text('tonnes')}</Text></Text><View style={s.divider}/><Text style={s.label}>{text('yield')}</Text><Text style={s.value}>{result.yieldPerHectare} {text('perHectare')}</Text><Text style={s.label}>{text('range')}</Text><Text style={s.value}>{result.lowEstimate} – {result.highEstimate} {text('tonnes')}</Text></View>
    <View style={s.disclaimer}><Text style={s.disclaimerTitle}>{text('resultDisclaimer')}</Text><Text style={s.disclaimerText}>{text('resultFactors')}</Text></View>
    {saved && <Text style={s.saved}>{text('savedSuccess')}</Text>}
    <Pressable style={s.primary} onPress={save}><Text style={s.primaryText}>{saved ? text('saved') : text('savePrediction')}</Text></Pressable><Pressable style={s.secondary} onPress={share}><Text style={s.secondaryText}>{text('share')}</Text></Pressable><Pressable style={s.secondary} onPress={another}><Text style={s.secondaryText}>{text('another')}</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
function Detail({ label, value }: { label: string; value: string }) { return <View style={s.detail}><Text style={s.detailLabel}>{label}</Text><Text style={s.detailValue}>{value}</Text></View>; }
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingBottom:40},title:{fontSize:29,fontWeight:'800',color:colors.text},desc:{fontSize:15,lineHeight:22,color:colors.secondaryText,marginVertical:10},details:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:15,marginTop:8},detail:{marginBottom:11},detailLabel:{fontSize:12,color:colors.secondaryText},detailValue:{fontSize:15,fontWeight:'700',color:colors.text,marginTop:2},main:{backgroundColor:colors.primary,borderRadius:18,padding:20,marginTop:16},mainLabel:{fontSize:14,color:'#D9F0DB',fontWeight:'700'},amount:{fontSize:36,fontWeight:'800',color:colors.white,marginTop:8},unit:{fontSize:16,fontWeight:'600'},divider:{height:1,backgroundColor:'#65A568',marginVertical:15},label:{fontSize:12,color:'#D9F0DB',marginTop:5},value:{fontSize:18,fontWeight:'800',color:colors.white,marginTop:3},disclaimer:{backgroundColor:colors.warning,borderRadius:14,padding:15,marginTop:16},disclaimerTitle:{fontWeight:'800',color:colors.warningText,marginBottom:6},disclaimerText:{fontSize:13,lineHeight:19,color:colors.warningText},saved:{fontSize:13,color:colors.primary,fontWeight:'700',textAlign:'center',marginTop:14},primary:{minHeight:54,borderRadius:14,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center',marginTop:16},primaryText:{color:colors.white,fontWeight:'800'},secondary:{minHeight:50,borderRadius:14,borderWidth:1,borderColor:colors.primary,alignItems:'center',justifyContent:'center',marginTop:10},secondaryText:{color:colors.primary,fontWeight:'800'}});
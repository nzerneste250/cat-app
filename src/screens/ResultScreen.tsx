import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { usePrediction } from '../context/PredictionContext';
import { predictHarvest } from '../services';
import { savePrediction } from '../storage';
import { cropLabel, provinceLabel, seasonLabel, t } from '../i18n/translations';
import { isPredictionInput } from '../utils/validation';
import type { PredictionInput, SavedPrediction } from '../types';
import type { PredictionStackParamList } from '../navigation/AppNavigator';

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PredictionStackParamList>>();
  const { language, draft, resetDraft } = usePrediction();
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!isPredictionInput(draft)) {
    return <SafeAreaView style={styles.safe}><View style={styles.invalid}><Text style={styles.title}>{text('result')}</Text><Text style={styles.desc}>{text('invalidPrediction')}</Text><Pressable style={styles.primary} onPress={() => { resetDraft(); navigation.popToTop(); }}><Text style={styles.primaryText}>{text('start')}</Text></Pressable></View></SafeAreaView>;
  }

  const input: PredictionInput = draft;
  const result = useMemo(() => predictHarvest(input), [input]);
  const crop = cropLabel(language, input.crop);
  const location = `${input.district}, ${provinceLabel(language, input.province)}`;
  const season = seasonLabel(language, input.season);

  const save = async () => {
    if (saved || saving) return;
    setSaving(true);
    setSaveError('');
    const item: SavedPrediction = { ...input, ...result, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, date: new Date().toISOString() };
    try {
      await savePrediction(item);
      setSaved(true);
    } catch {
      setSaveError(text('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const share = () => Share.share({ message: `${text('result')}\n\n${text('crop')}: ${crop}\n${text('location')}: ${location}\n${text('season')}: ${season}\n${text('agriculturalYear')}: ${input.agriculturalYear}\n${text('plantingMonth')}: ${input.plantingDateLabel}\n${text('landSize')}: ${input.landHectares} ${text('hectares')}\n${text('expectedHarvest')}: ${result.expectedHarvestTonnes} ${text('tonnes')}\n${text('yield')}: ${result.yieldPerHectare} ${text('perHectare')}\n\n${text('resultDisclaimer')} ${text('resultFactors')}` });

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.title}>{text('result')}</Text><Text style={styles.desc}>{text('resultSummary')}</Text>
    <View style={styles.details}><Detail label={text('crop')} value={crop}/><Detail label={text('location')} value={location}/><Detail label={text('season')} value={season}/><Detail label={text('agriculturalYear')} value={String(input.agriculturalYear)}/><Detail label={text('plantingMonth')} value={input.plantingDateLabel}/><Detail label={text('landSize')} value={`${input.landSize} ${input.unit === 'hectares' ? text('hectares') : text('squareMetres')}`}/></View>
    <View style={styles.main}><Text style={styles.mainLabel}>{text('expectedHarvest')}</Text><Text style={styles.amount}>{result.expectedHarvestTonnes} <Text style={styles.unit}>{text('tonnes')}</Text></Text><View style={styles.divider}/><Text style={styles.label}>{text('yield')}</Text><Text style={styles.value}>{result.yieldPerHectare} {text('perHectare')}</Text><Text style={styles.label}>{text('range')}</Text><Text style={styles.value}>{result.lowEstimate} - {result.highEstimate} {text('tonnes')}</Text></View>
    <View style={styles.disclaimer}><Text style={styles.disclaimerTitle}>{text('resultDisclaimer')}</Text><Text style={styles.disclaimerText}>{text('resultFactors')}</Text></View>
    {saved && <Text style={styles.saved}>{text('savedSuccess')}</Text>}
    {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
    <Pressable disabled={saving} style={[styles.primary, saving && styles.disabled]} onPress={save}><Text style={styles.primaryText}>{saved ? text('saved') : text('savePrediction')}</Text></Pressable>
    <Pressable style={styles.secondary} onPress={share}><Text style={styles.secondaryText}>{text('share')}</Text></Pressable>
    <Pressable style={styles.secondary} onPress={() => { resetDraft(); navigation.popToTop(); }}><Text style={styles.secondaryText}>{text('another')}</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

function Detail({ label, value }: { label: string; value: string }) { return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>; }
const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:colors.background}, content:{padding:20,paddingBottom:40}, invalid:{flex:1,padding:20,justifyContent:'center'}, title:{fontSize:29,fontWeight:'800',color:colors.text}, desc:{fontSize:15,lineHeight:22,color:colors.secondaryText,marginVertical:10}, details:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:15,marginTop:8}, detail:{marginBottom:11}, detailLabel:{fontSize:12,color:colors.secondaryText}, detailValue:{fontSize:15,fontWeight:'700',color:colors.text,marginTop:2}, main:{backgroundColor:colors.primary,borderRadius:18,padding:20,marginTop:16}, mainLabel:{fontSize:14,color:'#D9F0DB',fontWeight:'700'}, amount:{fontSize:36,fontWeight:'800',color:colors.white,marginTop:8}, unit:{fontSize:16,fontWeight:'600'}, divider:{height:1,backgroundColor:'#65A568',marginVertical:15}, label:{fontSize:12,color:'#D9F0DB',marginTop:5}, value:{fontSize:18,fontWeight:'800',color:colors.white,marginTop:3}, disclaimer:{backgroundColor:colors.warning,borderRadius:14,padding:15,marginTop:16}, disclaimerTitle:{fontWeight:'800',color:colors.warningText,marginBottom:6}, disclaimerText:{fontSize:13,lineHeight:19,color:colors.warningText}, saved:{fontSize:13,color:colors.primary,fontWeight:'700',textAlign:'center',marginTop:14}, error:{fontSize:13,color:colors.error,textAlign:'center',marginTop:12}, primary:{minHeight:54,borderRadius:14,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center',marginTop:16,paddingHorizontal:12}, disabled:{opacity:0.6}, primaryText:{color:colors.white,fontWeight:'800',textAlign:'center'}, secondary:{minHeight:50,borderRadius:14,borderWidth:1,borderColor:colors.primary,alignItems:'center',justifyContent:'center',marginTop:10,paddingHorizontal:12}, secondaryText:{color:colors.primary,fontWeight:'800',textAlign:'center'} });

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { locations, provinces, type Province } from '../data/locations';
import { usePrediction } from '../context/PredictionContext';
import { provinceLabel, t } from '../i18n/translations';
import type { PredictionStackParamList } from '../navigation/AppNavigator';

export default function PredictScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PredictionStackParamList>>();
  const { language, draft, updateDraft } = usePrediction();
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const [province, setProvince] = useState<Province>(draft.province || 'Northern Province');
  const [district, setDistrict] = useState<string>(draft.district || locations[province][0]);
  const [open, setOpen] = useState<'province' | 'district' | null>(null);
  const [error, setError] = useState('');
  const next = () => { if (!province || !district || !locations[province].includes(district as never)) { setError(text('requiredLocation')); return; } setError(''); updateDraft({ province, district: district as never }); navigation.navigate('Crop'); };
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Text style={s.step}>1 / 4</Text><Text style={s.title}>{text('location')}</Text><Text style={s.desc}>{text('locationDescription')}</Text>
    <View style={s.progress}><View style={s.active}/><View style={s.bar}/><View style={s.bar}/><View style={s.bar}/></View>
    <View style={s.card}><View style={s.icon}><Ionicons name="location-outline" size={27} color={colors.primary}/></View>
      <Text style={s.section}>{text('province')}</Text><Pressable style={s.select} onPress={() => setOpen(open === 'province' ? null : 'province')}><Text style={s.selectText}>{provinceLabel(language, province)}</Text><Ionicons name="chevron-down" size={19} color={colors.secondaryText}/></Pressable>
      {open === 'province' && <View style={s.options}>{provinces.map((item) => <Pressable key={item} style={s.option} onPress={() => { setProvince(item); setDistrict(locations[item][0]); setOpen(null); }}><Text style={s.optionText}>{provinceLabel(language, item)}</Text></Pressable>)}</View>}
      <Text style={s.section}>{text('district')}</Text><Pressable style={s.select} onPress={() => setOpen(open === 'district' ? null : 'district')}><Text style={s.selectText}>{district}</Text><Ionicons name="chevron-down" size={19} color={colors.secondaryText}/></Pressable>
      {open === 'district' && <View style={s.options}>{locations[province].map((item) => <Pressable key={item} style={s.option} onPress={() => { setDistrict(item); setOpen(null); }}><Text style={s.optionText}>{item}</Text></Pressable>)}</View>}
    </View><View style={s.summary}><Ionicons name="checkmark-circle" size={21} color={colors.primary}/><View><Text style={s.muted}>{text('selectedLocation')}</Text><Text style={s.summaryText}>{district}, {provinceLabel(language, province)}</Text></View></View>
    {error ? <Text style={s.error}>{error}</Text> : null}<View style={s.info}><Ionicons name="information-circle-outline" size={20} color={colors.primary}/><Text style={s.infoText}>{text('gpsNote')}</Text></View>
    <Pressable style={s.primary} onPress={next}><Text style={s.primaryText}>{text('continue')}</Text><Ionicons name="arrow-forward" size={20} color={colors.white}/></Pressable>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingBottom:40},step:{fontSize:14,fontWeight:'800',color:colors.primary,marginBottom:8},title:{fontSize:29,fontWeight:'800',color:colors.text,marginBottom:8},desc:{fontSize:15,lineHeight:22,color:colors.secondaryText,marginBottom:18},progress:{flexDirection:'row',gap:7,marginBottom:23},active:{flex:1,height:6,borderRadius:8,backgroundColor:colors.primary},bar:{flex:1,height:6,borderRadius:8,backgroundColor:colors.border},card:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:18,padding:17},icon:{width:52,height:52,borderRadius:16,backgroundColor:colors.lightGreen,alignItems:'center',justifyContent:'center',marginBottom:15},section:{fontSize:14,fontWeight:'800',color:colors.text,marginTop:13,marginBottom:7},select:{minHeight:50,borderWidth:1,borderColor:colors.border,borderRadius:12,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},selectText:{color:colors.text,fontSize:14,flex:1},options:{borderWidth:1,borderColor:colors.border,borderRadius:12,marginTop:5,overflow:'hidden'},option:{padding:13,borderBottomWidth:1,borderBottomColor:colors.border},optionText:{color:colors.text,fontSize:14},summary:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:colors.lightGreen,borderRadius:13,padding:13,marginTop:16},muted:{fontSize:12,color:colors.secondaryText},summaryText:{fontSize:14,fontWeight:'700',color:colors.darkGreen,marginTop:2},info:{flexDirection:'row',gap:8,marginVertical:17},infoText:{flex:1,color:colors.secondaryText,fontSize:13,lineHeight:19},error:{color:colors.error,fontSize:13,marginTop:8},primary:{minHeight:54,borderRadius:14,backgroundColor:colors.primary,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9},primaryText:{color:colors.white,fontSize:15}});
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { usePrediction } from '../context/PredictionContext';
import { deletePrediction, getPredictions } from '../storage';
import { cropLabel, provinceLabel, seasonLabel, t } from '../i18n/translations';
import { isSavedPrediction } from '../utils/validation';
import type { SavedPrediction } from '../types';
import type { BottomTabParamList } from '../navigation/AppNavigator';

export default function SavedScreen() {
  const nav = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const { language, updateDraft } = usePrediction();
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const [items, setItems] = useState<SavedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setLoadError('');
    try { setItems((await getPredictions()).filter(isSavedPrediction)); }
    catch { setItems([]); setLoadError(text('loadFailed')); }
    finally { setLoading(false); }
  }, [language]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const remove = (id: string) => Alert.alert(text('delete'), text('deleteConfirm'), [
    { text: text('cancel'), style: 'cancel' },
    { text: text('delete'), style: 'destructive', onPress: async () => { try { await deletePrediction(id); setItems((current) => current.filter((item) => item.id !== id)); setDeleteError(''); } catch { setDeleteError(text('deleteFailed')); } } },
  ]);
  const open = (item: SavedPrediction) => { updateDraft(item); nav.navigate('Prediction', { screen: 'Result' }); };

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.title}>{text('saved')}</Text>
    {loading ? <Text style={styles.message}>{text('savedOn')}...</Text> : loadError ? <Text style={styles.error}>{loadError}</Text> : items.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>{text('noSaved')}</Text><Text style={styles.emptyText}>{text('noSavedAction')}</Text><Pressable style={styles.primary} onPress={() => nav.navigate('Prediction', { screen: 'Location' })}><Text style={styles.primaryText}>{text('start')}</Text></Pressable></View> : items.map((item) => <View key={item.id} style={styles.card}><Pressable onPress={() => open(item)} accessibilityRole="button" accessibilityLabel={`${text('view')} ${cropLabel(language, item.crop)}`}><View style={styles.cardTop}><View style={styles.cardHeading}><Text style={styles.crop}>{cropLabel(language, item.crop)}</Text><Text style={styles.meta}>{item.district}, {provinceLabel(language, item.province)}</Text></View></View><Text style={styles.meta}>{text('season')}: {seasonLabel(language, item.season)} - {text('agriculturalYear')}: {item.agriculturalYear}</Text><Text style={styles.meta}>{text('plantingMonth')}: {item.plantingDateLabel}</Text><View style={styles.row}><Text style={styles.meta}>{item.landHectares} {text('hectares')}</Text><Text style={styles.harvest}>{item.expectedHarvestTonnes} {text('tonnes')}</Text></View><Text style={styles.date}>{text('savedOn')}: {new Date(item.date).toLocaleDateString()}</Text></Pressable><Pressable style={styles.deleteButton} onPress={() => remove(item.id)} accessibilityRole="button" accessibilityLabel={text('delete')}><Text style={styles.delete}>{text('delete')}</Text></Pressable></View>) }
    {deleteError ? <Text style={styles.error}>{deleteError}</Text> : null}
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingBottom:40},title:{fontSize:29,fontWeight:'800',color:colors.text,marginBottom:18},message:{fontSize:14,color:colors.secondaryText,textAlign:'center',marginTop:24},error:{fontSize:13,color:colors.error,textAlign:'center',marginVertical:12},empty:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:18,padding:20,alignItems:'center'},emptyTitle:{fontSize:18,fontWeight:'800',color:colors.text,textAlign:'center'},emptyText:{fontSize:14,lineHeight:21,color:colors.secondaryText,textAlign:'center',marginVertical:10},primary:{minHeight:50,borderRadius:14,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center',paddingHorizontal:22,marginTop:10},primaryText:{color:colors.white,fontWeight:'800'},card:{backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:16,marginBottom:12},cardHeading:{flex:1},cardTop:{flexDirection:'row'},crop:{fontSize:17,fontWeight:'800',color:colors.text},meta:{fontSize:13,color:colors.secondaryText,marginTop:4},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15},harvest:{fontSize:15,fontWeight:'800',color:colors.primary},date:{fontSize:12,color:colors.secondaryText,marginTop:12},deleteButton:{minHeight:44,alignSelf:'flex-end',justifyContent:'center',paddingHorizontal:8,marginTop:8},delete:{fontSize:13,fontWeight:'800',color:colors.error}});

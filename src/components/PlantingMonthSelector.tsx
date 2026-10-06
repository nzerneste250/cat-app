import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { t } from '../i18n/translations';
import type { Language, Season } from '../types';
import { getMonthsForSeason } from '../utils/seasonDates';

type Props = { language: Language; season?: Season; agriculturalYear?: number; month?: number; onChange: (month: number, calendarYear: number, label: string) => void };

export default function PlantingMonthSelector({ language, season, agriculturalYear, month, onChange }: Props) {
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 4 : width >= 430 ? 3 : 2;
  const itemWidth = columns === 4 ? '23%' : columns === 3 ? '31%' : '47%';
  const options = season && agriculturalYear ? getMonthsForSeason(season, agriculturalYear) : [];
  const monthKey = (key: string) => key as Parameters<typeof t>[1];
  if (!season || !agriculturalYear) return null;
  return <View style={styles.container}><Text style={styles.label}>{text('plantingMonth')}</Text><View style={styles.grid}>{options.map((item) => { const selected = item.month === month; return <Pressable key={`${item.month}-${item.calendarYear}`} onPress={() => onChange(item.month, item.calendarYear, `${text(monthKey(item.key))} ${item.calendarYear}`)} style={[styles.month, { width: itemWidth }, selected && styles.activeMonth]} accessibilityRole="button" accessibilityState={{ selected }}><Text style={[styles.monthText, selected && styles.activeText]}>{text(monthKey(item.key))}</Text><Text style={[styles.yearText, selected && styles.activeText]}>{item.calendarYear}</Text>{selected && <Ionicons name="checkmark-circle" size={18} color={colors.white} />}</Pressable>; })}</View></View>;
}

const styles = StyleSheet.create({ container:{marginTop:18},label:{fontSize:14,fontWeight:'800',color:colors.text,marginBottom:8},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},month:{minWidth:94,minHeight:64,borderRadius:13,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white,padding:9,alignItems:'center',justifyContent:'center'},activeMonth:{backgroundColor:colors.primary,borderColor:colors.primary},monthText:{fontSize:13,fontWeight:'700',color:colors.text,textAlign:'center'},yearText:{fontSize:12,color:colors.secondaryText,marginTop:2},activeText:{color:colors.white}});
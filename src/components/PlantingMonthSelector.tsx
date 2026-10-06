import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { months, t } from '../i18n/translations';
import type { Language } from '../types';

type Props = { language: Language; month?: number; year?: number; onChange: (month: number, year: number) => void };

export default function PlantingMonthSelector({ language, month, year, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [draftMonth, setDraftMonth] = useState(month);
  const [draftYear, setDraftYear] = useState(year);
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: 5 }, (_, index) => currentYear + index), [currentYear]);
  const text = (key: Parameters<typeof t>[1]) => t(language, key);
  const monthKey = (index: number) => months[index].toLowerCase() as Parameters<typeof t>[1];
  const display = month && year ? `${text(monthKey(month - 1))} ${year}` : text('selectMonth');
  const open = () => { setDraftMonth(month); setDraftYear(year); setVisible(true); };
  const confirm = () => { if (draftMonth && draftYear) { onChange(draftMonth, draftYear); setVisible(false); } };
  return <>
    <Pressable style={styles.field} onPress={open} accessibilityRole="button" accessibilityLabel={text('plantingMonth')}>
      <Ionicons name="calendar-outline" size={23} color={colors.primary} /><Text style={[styles.value, !month && styles.placeholder]}>{display}</Text><Ionicons name="chevron-down" size={20} color={colors.secondaryText} />
    </Pressable>
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}><View style={styles.modal}><View style={styles.modalHeader}><Text style={styles.modalTitle}>{text('selectPlantingMonth')}</Text><Pressable onPress={() => setVisible(false)}><Ionicons name="close" size={24} color={colors.secondaryText} /></Pressable></View>
        <Text style={styles.sectionLabel}>{text('selectYear')}</Text><View style={styles.yearRow}>{years.map((item) => <Pressable key={item} onPress={() => setDraftYear(item)} style={[styles.year, draftYear === item && styles.activeYear]}><Text style={[styles.yearText, draftYear === item && styles.activeText]}>{item}</Text></Pressable>)}</View>
        <Text style={styles.sectionLabel}>{text('plantingMonth')}</Text><View style={styles.grid}>{months.map((item, index) => <Pressable key={item} onPress={() => setDraftMonth(index + 1)} style={[styles.month, draftMonth === index + 1 && styles.activeMonth]}><Text style={[styles.monthText, draftMonth === index + 1 && styles.activeText]}>{text(monthKey(index)).slice(0, 3)}</Text></Pressable>)}</View>
        <View style={styles.actions}><Pressable onPress={() => setVisible(false)} style={styles.cancel}><Text style={styles.cancelText}>{text('cancel')}</Text></Pressable><Pressable onPress={confirm} style={styles.confirm}><Text style={styles.confirmText}>{text('confirm')}</Text></Pressable></View>
      </View></View>
    </Modal>
  </>;
}

const styles = StyleSheet.create({ overlay:{flex:1,backgroundColor:'rgba(15,35,18,0.45)',justifyContent:'flex-end'},modal:{backgroundColor:colors.white,borderTopLeftRadius:24,borderTopRightRadius:24,padding:20,paddingBottom:28},modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18},modalTitle:{fontSize:21,fontWeight:'800',color:colors.text},sectionLabel:{fontSize:13,fontWeight:'800',color:colors.secondaryText,marginBottom:9,marginTop:5},yearRow:{flexDirection:'row',gap:8,marginBottom:15},year:{flex:1,minHeight:46,borderWidth:1,borderColor:colors.border,borderRadius:11,alignItems:'center',justifyContent:'center'},activeYear:{backgroundColor:colors.primary,borderColor:colors.primary},yearText:{fontSize:14,fontWeight:'700',color:colors.text},activeText:{color:colors.white},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},month:{width:'31%',minHeight:50,borderWidth:1,borderColor:colors.border,borderRadius:11,alignItems:'center',justifyContent:'center'},activeMonth:{backgroundColor:colors.primary,borderColor:colors.primary},monthText:{fontSize:14,fontWeight:'700',color:colors.text},actions:{flexDirection:'row',gap:10,marginTop:22},cancel:{flex:1,minHeight:52,borderRadius:13,borderWidth:1,borderColor:colors.primary,alignItems:'center',justifyContent:'center'},cancelText:{color:colors.primary,fontWeight:'800'},confirm:{flex:1,minHeight:52,borderRadius:13,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},confirmText:{color:colors.white,fontWeight:'800'},field:{minHeight:60,borderWidth:1,borderColor:colors.border,borderRadius:14,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:11,backgroundColor:colors.white},value:{flex:1,fontSize:16,fontWeight:'700',color:colors.text},placeholder:{fontWeight:'500',color:colors.secondaryText}});
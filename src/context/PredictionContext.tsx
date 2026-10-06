import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language, PredictionInput } from '../types';
type Draft = Partial<PredictionInput>;
type Value = { language: Language; setLanguage: (value: Language) => void; draft: Draft; updateDraft: (value: Draft) => void; resetDraft: () => void };
const Context = createContext<Value | null>(null);
export function PredictionProvider({ children }: { children: React.ReactNode }) { const [language,setLanguageState] = useState<Language>('rw'); const [draft,setDraft] = useState<Draft>({}); useEffect(() => { AsyncStorage.getItem('@harvest_predictor_language').then((v) => { if (v === 'rw' || v === 'en') setLanguageState(v); }); }, []); const setLanguage = (v: Language) => { setLanguageState(v); void AsyncStorage.setItem('@harvest_predictor_language', v); }; const value = useMemo(() => ({ language, setLanguage, draft, updateDraft: (v: Draft) => setDraft((old) => ({...old,...v})), resetDraft: () => setDraft({}) }), [language,draft]); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function usePrediction() { const value = useContext(Context); if (!value) throw new Error('usePrediction must be used inside PredictionProvider'); return value; }
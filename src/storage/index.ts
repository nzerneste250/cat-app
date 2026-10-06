import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedPrediction } from '../types';
const KEY = '@harvest_predictor_predictions';
export async function getPredictions(): Promise<SavedPrediction[]> { try { const value = await AsyncStorage.getItem(KEY); return value ? JSON.parse(value) as SavedPrediction[] : []; } catch { return []; } }
export async function savePrediction(item: SavedPrediction): Promise<void> { await AsyncStorage.setItem(KEY, JSON.stringify([item, ...(await getPredictions())])); }
export async function deletePrediction(id: string): Promise<void> { await AsyncStorage.setItem(KEY, JSON.stringify((await getPredictions()).filter((item) => item.id !== id))); }

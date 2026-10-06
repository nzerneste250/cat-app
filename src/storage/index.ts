import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Crop, SavedPrediction } from '../types';
import { isSavedPrediction } from '../utils/validation';

const KEY = '@harvest_predictor_predictions';
const legacyCrops: Record<string, Crop> = { Maize: 'maize', 'Irish Potatoes': 'irish_potatoes', Beans: 'beans', Rice: 'rice', Banana: 'banana', Cassava: 'cassava' };
let writeQueue = Promise.resolve();

function normalizeRecord(value: unknown): SavedPrediction | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = { ...(value as Record<string, unknown>) };
  if (typeof record.crop === 'string' && legacyCrops[record.crop]) record.crop = legacyCrops[record.crop];
  if (!record.date && typeof record.savedAt === 'string') record.date = record.savedAt;
  return isSavedPrediction(record) ? record : undefined;
}

function queueWrite(operation: () => Promise<void>): Promise<void> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.catch(() => undefined);
  return next;
}

export async function getPredictions(): Promise<SavedPrediction[]> {
  try {
    const value = await AsyncStorage.getItem(KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(normalizeRecord).filter((item): item is SavedPrediction => Boolean(item)) : [];
  } catch {
    return [];
  }
}

export function savePrediction(item: SavedPrediction): Promise<void> {
  return queueWrite(async () => {
    const current = await getPredictions();
    const withoutDuplicate = current.filter((saved) => saved.id !== item.id);
    await AsyncStorage.setItem(KEY, JSON.stringify([item, ...withoutDuplicate]));
  });
}

export function deletePrediction(id: string): Promise<void> {
  return queueWrite(async () => {
    const current = await getPredictions();
    await AsyncStorage.setItem(KEY, JSON.stringify(current.filter((item) => item.id !== id)));
  });
}

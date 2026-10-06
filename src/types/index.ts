import type { District, Province } from '../data/locations';
export type Language = 'rw' | 'en';
export type Crop = 'Maize' | 'Irish Potatoes' | 'Beans' | 'Rice' | 'Banana' | 'Cassava';
export type Season = 'A' | 'B' | 'C';
export type LandUnit = 'hectares' | 'square metres';
export type PredictionInput = { province: Province; district: District; crop: Crop; landHectares: number; landSize: number; unit: LandUnit; season: Season; fertilizer: boolean; improvedSeeds: boolean; plantingMonth: number; plantingYear: number };
export type PredictionResult = { expectedHarvestTonnes: number; yieldPerHectare: number; lowEstimate: number; highEstimate: number; summary: string };
export type SavedPrediction = PredictionInput & PredictionResult & { id: string; date: string };

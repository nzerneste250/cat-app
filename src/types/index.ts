import type { District, Province } from '../data/locations';
import type { AgriculturalSeason } from '../data/seasons';
export type Language = 'rw' | 'en';
export type Crop = 'Maize' | 'Irish Potatoes' | 'Beans' | 'Rice' | 'Banana' | 'Cassava';
export type Season = AgriculturalSeason;
export type LandUnit = 'hectares' | 'square metres';
export type PredictionInput = { province: Province; district: District; crop: Crop; landHectares: number; landSize: number; unit: LandUnit; season: Season; agriculturalYear: number; fertilizer: boolean; improvedSeeds: boolean; plantingMonth: number; plantingCalendarYear: number; plantingDateLabel: string };
export type PredictionResult = { expectedHarvestTonnes: number; yieldPerHectare: number; lowEstimate: number; highEstimate: number; summary: string };
export type SavedPrediction = PredictionInput & PredictionResult & { id: string; date: string };

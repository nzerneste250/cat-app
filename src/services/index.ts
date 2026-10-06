import type { PredictionInput, PredictionResult } from '../types';
// Mock values for interface testing only. Replace with trained model/API output.
const base: Record<PredictionInput['crop'], number> = { Maize: 2.4, 'Irish Potatoes': 8.5, Beans: 1.4, Rice: 3.2, Banana: 12, Cassava: 9 };
const season: Record<PredictionInput['season'], number> = { A: 1, B: 0.93, C: 0.88 };
export function predictHarvest(input: PredictionInput): PredictionResult { const yieldPerHectare = base[input.crop] * (input.fertilizer ? 1.15 : 1) * (input.improvedSeeds ? 1.12 : 1) * season[input.season]; const expectedHarvestTonnes = input.landHectares * yieldPerHectare; const round = (n: number) => Math.round(n * 10) / 10; return { expectedHarvestTonnes: round(expectedHarvestTonnes), yieldPerHectare: round(yieldPerHectare), lowEstimate: round(expectedHarvestTonnes * .8), highEstimate: round(expectedHarvestTonnes * 1.2), summary: 'Use this estimate to help plan your harvest.' }; }

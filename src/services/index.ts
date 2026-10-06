import type { PredictionInput, PredictionResult } from '../types';
// Mock values for interface testing only. Replace with trained model/API output.
const base: Record<PredictionInput['crop'], number> = { maize: 2.4, irish_potatoes: 8.5, beans: 1.4, rice: 3.2, banana: 12, cassava: 9 };
const season: Record<PredictionInput['season'], number> = { A: 1, B: 0.93, C: 0.88 };
const legacyCropIds: Record<string, PredictionInput['crop']> = { Maize: 'maize', 'Irish Potatoes': 'irish_potatoes', Beans: 'beans', Rice: 'rice', Banana: 'banana', Cassava: 'cassava' };
export function predictHarvest(input: PredictionInput): PredictionResult { const crop = legacyCropIds[input.crop] || input.crop; const yieldPerHectare = base[crop] * (input.fertilizer ? 1.15 : 1) * (input.improvedSeeds ? 1.12 : 1) * season[input.season]; const expectedHarvestTonnes = input.landHectares * yieldPerHectare; const round = (n: number) => Math.round(n * 10) / 10; return { expectedHarvestTonnes: round(expectedHarvestTonnes), yieldPerHectare: round(yieldPerHectare), lowEstimate: round(expectedHarvestTonnes * .8), highEstimate: round(expectedHarvestTonnes * 1.2), summary: 'Use this estimate to help plan your harvest.' }; }

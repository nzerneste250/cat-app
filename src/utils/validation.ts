import { locations, type District, type Province } from '../data/locations';
import { isMonthInSeason } from './seasonDates';
import type { Crop, LandUnit, PredictionInput, SavedPrediction, Season } from '../types';

const crops: readonly Crop[] = ['maize', 'irish_potatoes', 'beans', 'rice', 'banana', 'cassava'];
const seasons: readonly Season[] = ['A', 'B', 'C'];

export function isProvince(value: unknown): value is Province {
  return typeof value === 'string' && value in locations;
}

export function isDistrict(value: unknown, province?: Province): value is District {
  if (typeof value !== 'string') return false;
  return province ? locations[province].includes(value as never) : Object.values(locations).some((districts) => districts.includes(value as never));
}

export function isCrop(value: unknown): value is Crop { return typeof value === 'string' && crops.includes(value as Crop); }
export function isSeason(value: unknown): value is Season { return typeof value === 'string' && seasons.includes(value as Season); }
export function isLandUnit(value: unknown): value is LandUnit { return value === 'hectares' || value === 'square metres'; }

export function isValidLandSize(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 1_000_000;
}

export function isPredictionInput(value: unknown): value is PredictionInput {
  if (!value || typeof value !== 'object') return false;
  const input = value as Partial<PredictionInput>;
  const agriculturalYear = input.agriculturalYear;
  const plantingMonth = input.plantingMonth;
  if (!isSeason(input.season) || typeof agriculturalYear !== 'number' || !Number.isInteger(agriculturalYear) || agriculturalYear < 2000 ||
    typeof plantingMonth !== 'number' || !Number.isInteger(plantingMonth) || plantingMonth < 1 || plantingMonth > 12) return false;
  return isProvince(input.province) && isDistrict(input.district, input.province) && isCrop(input.crop) &&
    isValidLandSize(input.landSize) && isValidLandSize(input.landHectares) && isLandUnit(input.unit) &&
    isMonthInSeason(input.season, plantingMonth) && Number.isInteger(input.plantingCalendarYear) &&
    typeof input.plantingDateLabel === 'string' && typeof input.fertilizer === 'boolean' && typeof input.improvedSeeds === 'boolean';
}

export function isSavedPrediction(value: unknown): value is SavedPrediction {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return isPredictionInput(value) && typeof item.id === 'string' && item.id.length > 0 && typeof item.date === 'string' &&
    typeof item.expectedHarvestTonnes === 'number' && Number.isFinite(item.expectedHarvestTonnes) &&
    typeof item.yieldPerHectare === 'number' && Number.isFinite(item.yieldPerHectare) &&
    typeof item.lowEstimate === 'number' && Number.isFinite(item.lowEstimate) &&
    typeof item.highEstimate === 'number' && Number.isFinite(item.highEstimate) && typeof item.summary === 'string';
}

export function normalizeLandSize(value: string): number | undefined {
  const normalized = value.trim().replace(',', '.');
  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) return undefined;
  const result = Number(normalized);
  return isValidLandSize(result) ? result : undefined;
}

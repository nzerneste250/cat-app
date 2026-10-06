import { seasonMonths, type AgriculturalSeason } from '../data/seasons.ts';

export type SeasonMonthDate = {
  month: number;
  key: string;
  calendarYear: number;
  yearOffset: number;
};

export function getMonthsForSeason(season: AgriculturalSeason, agriculturalYear: number): SeasonMonthDate[] {
  return seasonMonths[season].map((item) => ({ ...item, calendarYear: agriculturalYear + item.yearOffset }));
}

export function getCalendarYearForSeasonMonth(season: AgriculturalSeason, month: number, agriculturalYear: number): number | undefined {
  const item = seasonMonths[season].find((entry) => entry.month === month);
  return item ? agriculturalYear + item.yearOffset : undefined;
}

export function isMonthInSeason(season: AgriculturalSeason, month: number): boolean {
  return seasonMonths[season].some((item) => item.month === month);
}

export function getPlantingDateLabel(monthName: string, calendarYear: number): string {
  return `${monthName} ${calendarYear}`;
}
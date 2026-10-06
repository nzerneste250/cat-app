/**
 * Rwanda agricultural season periods based on the NISR Seasonal Agricultural
 * Survey definitions. Season A crosses two calendar years.
 */
export type AgriculturalSeason = 'A' | 'B' | 'C';

export type SeasonMonth = {
  month: number;
  key: string;
  yearOffset: number;
};

export const seasonMonths: Record<AgriculturalSeason, SeasonMonth[]> = {
  A: [
    { month: 9, key: 'september', yearOffset: -1 },
    { month: 10, key: 'october', yearOffset: -1 },
    { month: 11, key: 'november', yearOffset: -1 },
    { month: 12, key: 'december', yearOffset: -1 },
    { month: 1, key: 'january', yearOffset: 0 },
    { month: 2, key: 'february', yearOffset: 0 },
  ],
  B: [
    { month: 3, key: 'march', yearOffset: 0 },
    { month: 4, key: 'april', yearOffset: 0 },
    { month: 5, key: 'may', yearOffset: 0 },
    { month: 6, key: 'june', yearOffset: 0 },
  ],
  C: [
    { month: 7, key: 'july', yearOffset: 0 },
    { month: 8, key: 'august', yearOffset: 0 },
    { month: 9, key: 'september', yearOffset: 0 },
  ],
};

export const seasonLabels: Record<AgriculturalSeason, string> = {
  A: 'September – February',
  B: 'March – June',
  C: 'July – September',
};

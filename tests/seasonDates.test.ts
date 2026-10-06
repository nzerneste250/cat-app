import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCalendarYearForSeasonMonth, getMonthsForSeason, isMonthInSeason } from '../src/utils/seasonDates.ts';

test('Season A 2027 maps September-February across 2026 and 2027', () => {
  assert.deepEqual(getMonthsForSeason('A', 2027).map((item) => [item.month, item.calendarYear]), [
    [9, 2026], [10, 2026], [11, 2026], [12, 2026], [1, 2027], [2, 2027],
  ]);
  assert.equal(getCalendarYearForSeasonMonth('A', 10, 2027), 2026);
});

test('Season B 2027 maps March-June to 2027', () => {
  assert.deepEqual(getMonthsForSeason('B', 2027).map((item) => [item.month, item.calendarYear]), [[3, 2027], [4, 2027], [5, 2027], [6, 2027]]);
});

test('Season C 2027 maps July-September to 2027', () => {
  assert.deepEqual(getMonthsForSeason('C', 2027).map((item) => [item.month, item.calendarYear]), [[7, 2027], [8, 2027], [9, 2027]]);
});

test('changing from Season A October to Season B makes October invalid', () => {
  assert.equal(isMonthInSeason('A', 10), true);
  assert.equal(isMonthInSeason('B', 10), false);
});
import { toDateString } from "./date";

/**
 * Open-Meteo Forecast API `forecast_days` 상한 (최대 16).
 * @see https://open-meteo.com/en/docs
 */
export const WEATHER_API_MAX_FORECAST_DAYS = 16;

/** 캘린더 표시: 오늘 포함 API 최대 일수 */
export const WEATHER_FORECAST_DAY_COUNT = WEATHER_API_MAX_FORECAST_DAYS;

export function getWeatherDateRange(today: Date = new Date()): {
  start: string;
  end: string;
  dates: string[];
} {
  const dates: string[] = [];
  for (let i = 0; i < WEATHER_FORECAST_DAY_COUNT; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(toDateString(d));
  }
  return {
    start: dates[0],
    end: dates[dates.length - 1],
    dates,
  };
}

export function isDateInWeatherWindow(dateStr: string, today: Date = new Date()): boolean {
  const { dates } = getWeatherDateRange(today);
  return dates.includes(dateStr);
}

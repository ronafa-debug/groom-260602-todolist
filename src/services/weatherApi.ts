import type { WeatherByDate, WeatherCity } from "../types/weather";
import { weatherCodeToEmoji } from "../utils/weatherEmoji";
import {
  getWeatherDateRange,
  WEATHER_API_MAX_FORECAST_DAYS,
} from "../utils/weatherWindow";

interface ForecastResponse {
  hourly?: {
    time?: string[];
    weather_code?: number[];
  };
}

/** 해당 날짜에서 targetHour(0–23)에 가장 가까운 시각의 WMO 코드 */
function pickCodeForHour(
  times: string[],
  codes: number[],
  dateStr: string,
  targetHour: number,
): number | null {
  const prefix = `${dateStr}T`;
  let bestIdx = -1;
  let bestDiff = 24;

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    if (!t.startsWith(prefix)) continue;
    const hour = Number.parseInt(t.slice(11, 13), 10);
    if (Number.isNaN(hour)) continue;
    const diff = Math.abs(hour - targetHour);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  if (bestIdx < 0) return null;
  return codes[bestIdx] ?? null;
}

function buildDayWeather(
  times: string[],
  codes: number[],
  dateStr: string,
): WeatherByDate[string] | null {
  const amCode = pickCodeForHour(times, codes, dateStr, 9);
  const pmCode = pickCodeForHour(times, codes, dateStr, 15);
  if (amCode == null && pmCode == null) return null;

  return {
    am: weatherCodeToEmoji(amCode ?? pmCode ?? 0),
    pm: weatherCodeToEmoji(pmCode ?? amCode ?? 0),
  };
}

export async function fetchWeatherForWindow(city: WeatherCity): Promise<WeatherByDate> {
  const params = new URLSearchParams({
    latitude: String(city.lat),
    longitude: String(city.lon),
    hourly: "weather_code",
    timezone: "Asia/Seoul",
    forecast_days: String(WEATHER_API_MAX_FORECAST_DAYS),
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) {
    throw new Error("날씨 정보를 불러오지 못했습니다.");
  }

  const data = (await res.json()) as ForecastResponse;
  const times = data.hourly?.time ?? [];
  const codes = data.hourly?.weather_code ?? [];

  const { dates } = getWeatherDateRange(new Date());
  const byDate: WeatherByDate = {};

  for (const dateStr of dates) {
    const day = buildDayWeather(times, codes, dateStr);
    if (day) byDate[dateStr] = day;
  }

  return byDate;
}

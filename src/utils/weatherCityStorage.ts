import type { WeatherCity } from "../types/weather";
import { DEFAULT_WEATHER_CITY } from "../services/geocoding";

const STORAGE_KEY = "today-planner-weather-city";

export function loadSavedWeatherCity(): WeatherCity {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WEATHER_CITY;
    const parsed = JSON.parse(raw) as WeatherCity;
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lon === "number" &&
      parsed.label
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_WEATHER_CITY;
}

export function saveWeatherCity(city: WeatherCity): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
  } catch {
    /* ignore */
  }
}

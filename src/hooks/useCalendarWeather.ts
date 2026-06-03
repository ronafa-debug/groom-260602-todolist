import { useCallback, useEffect, useState } from "react";
import { fetchWeatherForWindow } from "../services/weatherApi";
import type { WeatherByDate, WeatherCity } from "../types/weather";
import {
  loadSavedWeatherCity,
  saveWeatherCity,
} from "../utils/weatherCityStorage";

function cacheKey(city: WeatherCity): string {
  return `weather:v3:${city.id}`;
}

export function useCalendarWeather() {
  const [city, setCityState] = useState<WeatherCity>(() => loadSavedWeatherCity());
  const [weatherByDate, setWeatherByDate] = useState<WeatherByDate>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (targetCity: WeatherCity) => {
    const key = cacheKey(targetCity);
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setWeatherByDate(JSON.parse(cached) as WeatherByDate);
        setError(null);
        return;
      }
    } catch {
      /* refetch */
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForWindow(targetCity);
      setWeatherByDate(data);
      try {
        sessionStorage.setItem(key, JSON.stringify(data));
      } catch {
        /* ignore */
      }
    } catch (err) {
      setWeatherByDate({});
      setError(err instanceof Error ? err.message : "날씨 로드 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather(city);
  }, [city, loadWeather]);

  const setCity = useCallback(
    (next: WeatherCity) => {
      saveWeatherCity(next);
      setCityState(next);
    },
    [],
  );

  return { city, setCity, weatherByDate, loading, error };
}

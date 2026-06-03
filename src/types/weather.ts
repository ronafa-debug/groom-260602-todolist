export interface WeatherCity {
  id: string;
  label: string;
  lat: number;
  lon: number;
}

export interface DayWeather {
  am: string;
  pm: string;
}

export type WeatherByDate = Record<string, DayWeather>;

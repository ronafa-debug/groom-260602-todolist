import type { DayWeather } from "../types/weather";

interface DayWeatherRowProps {
  weather?: DayWeather;
  loading?: boolean;
  className?: string;
}

export function DayWeatherRow({ weather, loading, className = "" }: DayWeatherRowProps) {
  if (loading && !weather) {
    return (
      <div
        className={`flex justify-center gap-1 text-[10px] text-gray-300 shrink-0 leading-none ${className}`}
      >
        · ·
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className={`flex items-center justify-center gap-0.5 text-base leading-none shrink-0 ${className}`}
      aria-label={`오전 ${weather.am}, 오후 ${weather.pm}`}
    >
      <span title="오전">{weather.am}</span>
      <span className="text-[8px] text-gray-300">/</span>
      <span title="오후">{weather.pm}</span>
    </div>
  );
}

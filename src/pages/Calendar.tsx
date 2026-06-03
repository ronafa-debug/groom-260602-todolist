import { CalendarGrid } from "../components/CalendarGrid";
import { CityWeatherPicker } from "../components/CityWeatherPicker";
import { useCalendarWeather } from "../hooks/useCalendarWeather";

export function Calendar() {
  const { city, setCity, weatherByDate, loading } = useCalendarWeather();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span>📅</span> 캘린더
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            오늘부터 최대 16일간 날씨(오전/오후)와 마감일 일정이 표시됩니다.
          </p>
        </div>
        <CityWeatherPicker city={city} onSelect={setCity} />
      </div>

      <CalendarGrid weatherByDate={weatherByDate} weatherLoading={loading} />
    </div>
  );
}

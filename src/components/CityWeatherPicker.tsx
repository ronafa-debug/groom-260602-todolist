import { useEffect, useRef, useState } from "react";
import { searchKoreanCities } from "../services/geocoding";
import type { WeatherCity } from "../types/weather";

interface CityWeatherPickerProps {
  city: WeatherCity;
  onSelect: (city: WeatherCity) => void;
}

export function CityWeatherPicker({ city, onSelect }: CityWeatherPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WeatherCity[]>([]);
  const [searching, setSearching] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      setSearching(true);
      void searchKoreanCities(query)
        .then(setResults)
        .finally(() => setSearching(false));
    }, 300);
    return () => window.clearTimeout(t);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const shortLabel =
    city.label.length > 10 ? `${city.label.slice(0, 9)}…` : city.label;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="shrink-0 text-[10px] px-2.5 py-2 rounded-xl border border-primary/25 bg-white text-primary hover:bg-cream/50 shadow-sm max-w-[8rem] truncate"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        📍 {shortLabel}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-primary/15 bg-white shadow-lg p-3 space-y-2">
          <p className="text-[10px] font-semibold text-gray-600">시·군·구 검색</p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 수원, 제주, 군산"
            className="w-full rounded-lg border border-primary/20 px-2 py-1.5 text-xs"
            autoFocus
          />
          <ul className="max-h-40 overflow-y-auto text-xs" role="listbox">
            {searching && (
              <li className="py-2 text-center text-gray-400">검색 중…</li>
            )}
            {!searching && results.length === 0 && query.trim() && (
              <li className="py-2 text-center text-gray-400">결과 없음</li>
            )}
            {!searching &&
              results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-primary/10 text-gray-700"
                    onClick={() => {
                      onSelect(r);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    {r.label}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

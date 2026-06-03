import {
  buildGeocodingSearchTerms,
  searchCuratedKoreanLocations,
} from "../data/koreanWeatherLocations";
import type { WeatherCity } from "../types/weather";

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  admin2?: string;
  country_code?: string;
  feature_code?: string;
  population?: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

const ALLOWED_FEATURE_CODES = new Set([
  "PPLC",
  "PPLA",
  "PPLA2",
  "PPLA3",
  "PPLA4",
  "PPL",
  "ADM1",
  "ADM2",
  "ADM3",
]);

const FEATURE_RANK: Record<string, number> = {
  PPLC: 0,
  PPLA: 1,
  PPLA2: 2,
  PPLA3: 3,
  PPLA4: 4,
  ADM1: 5,
  ADM2: 6,
  ADM3: 7,
  PPL: 8,
};

function featureRank(code?: string): number {
  if (!code) return 99;
  return FEATURE_RANK[code] ?? 99;
}

function formatKoreanLocationLabel(result: GeocodingResult): string {
  const { name, admin1, admin2, feature_code } = result;

  if (
    feature_code === "PPLA" &&
    admin1 &&
    (admin1 === name || /광역시|특별시|특별자치시|특별자치도/.test(name))
  ) {
    return name;
  }

  if (admin2 && (name === admin2 || admin2.includes(name))) {
    return `${admin1} ${admin2}`;
  }

  if (admin1) {
    return `${admin1} ${name}`;
  }

  return name;
}

function toWeatherCity(result: GeocodingResult): WeatherCity {
  return {
    id: String(result.id),
    label: formatKoreanLocationLabel(result),
    lat: result.latitude,
    lon: result.longitude,
  };
}

function isRelevantKoreanResult(result: GeocodingResult): boolean {
  if (result.country_code !== "KR") return false;
  if (!result.feature_code || !ALLOWED_FEATURE_CODES.has(result.feature_code)) {
    return false;
  }
  return true;
}

function compareResults(a: GeocodingResult, b: GeocodingResult): number {
  const popA = a.population ?? 0;
  const popB = b.population ?? 0;
  if (popB !== popA) return popB - popA;

  const rankDiff = featureRank(a.feature_code) - featureRank(b.feature_code);
  if (rankDiff !== 0) return rankDiff;

  return a.name.localeCompare(b.name, "ko");
}

async function fetchGeocodingResults(term: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: term,
    count: "20",
    language: "ko",
    country: "KR",
  });

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
  );
  if (!res.ok) return [];

  const data = (await res.json()) as GeocodingResponse;
  return (data.results ?? []).filter(isRelevantKoreanResult);
}

function mergeWeatherCities(
  curated: WeatherCity[],
  remote: WeatherCity[],
  limit = 15,
): WeatherCity[] {
  const seen = new Set<string>();
  const merged: WeatherCity[] = [];

  for (const city of [...curated, ...remote]) {
    const key = `${city.label}|${city.lat.toFixed(3)}|${city.lon.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(city);
    if (merged.length >= limit) break;
  }

  return merged;
}

export async function searchKoreanCities(query: string): Promise<WeatherCity[]> {
  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const curated = searchCuratedKoreanLocations(trimmed);
  const terms = buildGeocodingSearchTerms(trimmed);

  const remoteResults = (
    await Promise.all(terms.map((term) => fetchGeocodingResults(term)))
  )
    .flat()
    .sort(compareResults)
    .map(toWeatherCity);

  return mergeWeatherCities(curated, remoteResults);
}

export const DEFAULT_WEATHER_CITY: WeatherCity = {
  id: "seoul",
  label: "서울특별시",
  lat: 37.5665,
  lon: 126.978,
};

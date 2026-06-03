import type { WeatherCity } from "../types/weather";

/** Open-Meteo에 없거나 짧은 검색어에서 뒤로 밀리는 주요 지역 */
export interface CuratedKoreanLocation extends WeatherCity {
  keys: string[];
}

export const CURATED_KOREAN_LOCATIONS: CuratedKoreanLocation[] = [
  {
    id: "seoul",
    label: "서울특별시",
    lat: 37.5665,
    lon: 126.978,
    keys: ["서울", "서울특별시"],
  },
  {
    id: "busan",
    label: "부산광역시",
    lat: 35.1796,
    lon: 129.0756,
    keys: ["부산", "부산광역시"],
  },
  {
    id: "daegu",
    label: "대구광역시",
    lat: 35.8714,
    lon: 128.6014,
    keys: ["대구", "대구광역시"],
  },
  {
    id: "incheon",
    label: "인천광역시",
    lat: 37.4563,
    lon: 126.7052,
    keys: ["인천", "인천광역시"],
  },
  {
    id: "gwangju-metro",
    label: "광주광역시",
    lat: 35.1595,
    lon: 126.8526,
    keys: ["광주광역시"],
  },
  {
    id: "gwangju-gyeonggi",
    label: "경기도 광주시",
    lat: 37.4294,
    lon: 127.255,
    keys: ["경기광주", "경기도광주", "경기도 광주시"],
  },
  {
    id: "daejeon",
    label: "대전광역시",
    lat: 36.3504,
    lon: 127.3845,
    keys: ["대전", "대전광역시"],
  },
  {
    id: "ulsan",
    label: "울산광역시",
    lat: 35.5384,
    lon: 129.3114,
    keys: ["울산", "울산광역시"],
  },
  {
    id: "sejong",
    label: "세종특별자치시",
    lat: 36.48,
    lon: 127.289,
    keys: ["세종", "세종특별자치시"],
  },
  {
    id: "jeju-city",
    label: "제주특별자치도 제주시",
    lat: 33.4996,
    lon: 126.5312,
    keys: ["제주", "제주시", "제주특별자치도"],
  },
  {
    id: "namwon",
    label: "전라북도 남원시",
    lat: 35.4164,
    lon: 127.3904,
    keys: ["남원", "남원시", "전라북도남원", "전북남원"],
  },
];

/** 짧은 검색어 → 추가로 조회할 공식 지명 */
export const KOREAN_LOCATION_ALIASES: Record<string, string[]> = {
  서울: ["서울특별시"],
  부산: ["부산광역시"],
  대구: ["대구광역시"],
  인천: ["인천광역시"],
  광주: ["광주광역시", "광주시"],
  대전: ["대전광역시"],
  울산: ["울산광역시"],
  세종: ["세종특별자치시"],
  제주: ["제주시"],
  남원: ["남원시"],
};

const ADMIN_SUFFIXES = [
  "특별자치시",
  "특별자치도",
  "특별시",
  "광역시",
  "시",
  "군",
  "구",
] as const;

export function normalizeLocationQuery(query: string): string {
  return query.trim().replace(/\s+/g, "");
}

export function hasAdminSuffix(query: string): boolean {
  return ADMIN_SUFFIXES.some((suffix) => query.endsWith(suffix));
}

export function buildGeocodingSearchTerms(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const terms = new Set<string>([trimmed]);
  const compact = normalizeLocationQuery(trimmed);

  if (!hasAdminSuffix(trimmed)) {
    terms.add(`${trimmed}시`);
    terms.add(`${trimmed}군`);
  }

  for (const alias of KOREAN_LOCATION_ALIASES[compact] ?? []) {
    terms.add(alias);
  }

  return [...terms];
}

export function searchCuratedKoreanLocations(query: string): WeatherCity[] {
  const compact = normalizeLocationQuery(query);
  if (compact.length < 1) return [];

  const matched: CuratedKoreanLocation[] = [];

  for (const loc of CURATED_KOREAN_LOCATIONS) {
    const hit = loc.keys.some((key) => {
      const k = normalizeLocationQuery(key);
      return k === compact || k.startsWith(compact) || compact.startsWith(k);
    });
    if (hit) matched.push(loc);
  }

  if (compact === "광주") {
    const gwangjuMetro = CURATED_KOREAN_LOCATIONS.find((l) => l.id === "gwangju-metro");
    const gwangjuGyeonggi = CURATED_KOREAN_LOCATIONS.find((l) => l.id === "gwangju-gyeonggi");
    if (gwangjuMetro && !matched.includes(gwangjuMetro)) matched.unshift(gwangjuMetro);
    if (gwangjuGyeonggi && !matched.includes(gwangjuGyeonggi)) matched.push(gwangjuGyeonggi);
  }

  const seen = new Set<string>();
  return matched
    .map(({ id, label, lat, lon }) => ({ id, label, lat, lon }))
    .filter((city) => {
      if (seen.has(city.id)) return false;
      seen.add(city.id);
      return true;
    });
}

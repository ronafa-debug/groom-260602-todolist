const TOKEN_KEY = "today-planner-token";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const SAME_ORIGIN_API = import.meta.env.VITE_SAME_ORIGIN_API === "true";

export function isApiConfigured(): boolean {
  if (import.meta.env.DEV) return true;
  return Boolean(API_BASE) || SAME_ORIGIN_API;
}

/** API 미연결 시 로그인 화면 안내 문구 */
export function getApiSetupMessage(): string {
  if (import.meta.env.DEV) {
    return "API 서버가 필요합니다. 터미널에서 npm run dev로 프론트와 서버를 함께 실행해 주세요.";
  }
  return (
    "Vercel에는 프론트만 배포됩니다. Express API를 Render 등에 먼저 배포한 뒤, " +
    "Vercel 프로젝트 → Settings → Environment Variables에 " +
    "API_SERVER_URL(예: https://your-api.onrender.com)을 넣고 재배포해 주세요. " +
    "또는 VITE_API_URL에 API 주소를 직접 넣을 수 있습니다. (README 배포 절 참고)"
  );
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers });

  let body: { error?: string } | T = {} as T;
  try {
    body = await res.json();
  } catch {
    /* empty */
  }

  if (!res.ok) {
    const message =
      typeof body === "object" && body && "error" in body && body.error
        ? String(body.error)
        : `요청 실패 (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

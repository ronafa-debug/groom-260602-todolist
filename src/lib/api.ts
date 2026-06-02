const TOKEN_KEY = "today-planner-token";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function isApiConfigured(): boolean {
  return import.meta.env.DEV || Boolean(API_BASE);
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

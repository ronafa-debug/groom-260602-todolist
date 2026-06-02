/**
 * Vercel 빌드 시 API_SERVER_URL이 있으면 /api → 백엔드 프록시 rewrites 생성
 * (프론트는 같은 도메인 /api 로 요청, CORS 불필요)
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const vercelPath = join(root, "vercel.json");
const envProdPath = join(root, ".env.production.local");

const apiServer = (process.env.API_SERVER_URL ?? "").replace(/\/$/, "");
const viteApiUrl = (process.env.VITE_API_URL ?? "").replace(/\/$/, "");

let vercel = { rewrites: [{ source: "/(.*)", destination: "/index.html" }] };

if (existsSync(vercelPath)) {
  try {
    vercel = JSON.parse(readFileSync(vercelPath, "utf8"));
  } catch {
    /* use default */
  }
}

const envLines = [];

if (apiServer) {
  vercel.rewrites = [
    { source: "/api/:path*", destination: `${apiServer}/api/:path*` },
    { source: "/(.*)", destination: "/index.html" },
  ];
  envLines.push("VITE_SAME_ORIGIN_API=true");
  console.log(`[vercel-config] API proxy → ${apiServer}`);
} else if (viteApiUrl) {
  envLines.push(`VITE_API_URL=${viteApiUrl}`);
  console.log(`[vercel-config] VITE_API_URL=${viteApiUrl}`);
} else {
  console.warn(
    "[vercel-config] API_SERVER_URL 또는 VITE_API_URL 없음 — Vercel에서 로그인하려면 환경 변수 설정 후 재배포하세요.",
  );
}

writeFileSync(vercelPath, `${JSON.stringify(vercel, null, 2)}\n`);

if (envLines.length > 0) {
  writeFileSync(envProdPath, `${envLines.join("\n")}\n`);
}

# 오늘도 수고했어요 (Today Planner)

교사와 부모를 위한 감성 생산성 To Do App입니다.  
개발: **오뚝이아빠 김선생**

- GitHub: [ronafa-debug/groom-260602-todolist](https://github.com/ronafa-debug/groom-260602-todolist)
- 데모(프론트): [groom-260602-todolist.vercel.app](https://groom-260602-todolist.vercel.app)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트 | React 19 + TypeScript + Vite + Tailwind CSS |
| 상태/라우팅 | Zustand · React Router |
| 백엔드 | Express 5 + SQLite (`better-sqlite3`) |
| 인증 | 이메일·비밀번호 + JWT (`localStorage`) |
| 배포 | Vercel(프론트) · Render(API, [`render.yaml`](render.yaml)) |

---

## 로컬 실행

```bash
npm install
cp .env.example .env
# .env 에 JWT_SECRET 설정 (32자 이상 권장)

npm run dev
```

| 서비스 | URL |
|--------|-----|
| 웹 | http://localhost:5156 |
| API | http://localhost:3001 (`/api` → Vite 프록시) |

### 이용 방법

| 방식 | 설명 |
|------|------|
| **회원 이용** | 로그인 화면에서 회원가입(비밀번호 6자 이상) → 로그인 → 서버에 데이터 저장 |
| **체험(게스트)** | 로그인 화면 하단 **로그인 없이 둘러보기** → API 없이 전 기능 체험, `sessionStorage`에만 저장 |

### 주요 npm 스크립트

- `npm run dev` — API + 프론트 동시 실행
- `npm run build` — Vercel용 프론트 빌드 (`scripts/generate-vercel-config.mjs` 포함)
- `npm run start:server` — API 단독 실행

---

## 주요 기능

### 할 일 (Home · Today · Upcoming · Done · Calendar)

- 할 일 CRUD, 중요도(빨리 / 천천히 / 나중에), 마감일
- 교사 / 부모 모드 전환, 모드별 카테고리
- 카테고리 **+** 버튼(팝업 관리), Today·Upcoming 드래그 정렬
- 완료 격려 메시지, 진행률 대시보드
- 캘린더: 월별 보기, 날짜별 할 일(최대 3건 표시)

### Timetabel (시간표)

- 교사: 수업 시간표 / 부모: 자녀 학교·학원 일정
- 월~금, 시작·종료 시각, 제목·메모
- 모드별 데이터 분리 저장

### Habit (습관)

[HabitKit](https://www.habitkit.app/) 스타일의 습관 추적 탭.

- 습관 추가·수정·삭제 (이름, 이모지, 색상, 설명, 빈도)
- 빈도: 매일 / 평일(월–금) · 표시 주수 1~10주(기본 4주)
- 타일 그리드, streak, **오늘 완료** (그리드 **오늘 = 좌상단**)
- 습관 없을 때 모드별 **예시 습관** 표시
- 탭 제목 우측 **+** → 팝업으로 추가

### 체험(게스트) 모드

- 로그인·API 없이 Home ~ Habit 전 탭 사용
- 샘플 할 일·시간표·습관으로 시작, 세션 중 CRUD 가능
- `sessionStorage`에 저장(브라우저 탭을 닫기 전까지 유지, **서버 미저장**)
- 상단 배너·헤더 **체험 종료** / **로그인하기**

### 계정·동기화 (로그인 시)

- 회원가입·로그인·로그아웃
- 사용자별 SQLite + REST API 동기화
- 예전 LocalStorage 데이터 1회 가져오기 안내

---

## 탭 구성

Home · Today · Upcoming · Done · Calendar · Timetabel · **Habit**

---

## 인증·API 개요

- `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
- `GET /api/data` · `PUT /api/data/profile` · tasks CRUD · `POST /api/data/import`
- `GET /api/health` — 서버 상태 확인
- 프로필 JSON: `categories`, `today_order`, `upcoming_order`, `teacher_timetable`, `parent_timetable`, `teacher_habits`, `parent_habits`, `habit_completions`

DB: `server/data.db` (git 제외, 자동 생성)

---

## 프로덕션 배포 (Vercel + Render)

### 구조

```
[Vercel] React 정적 앱  ──(선택) /api 프록시──►  [Render] Express + SQLite
         └── 게스트 모드: API 없이 sessionStorage만 사용
```

**Vercel만 배포하면 로그인·회원가입은 API가 필요해 동작하지 않습니다.**  
다만 **로그인 없이 둘러보기**로 체험은 가능합니다.

### 1단계: API (Render)

1. [Render](https://render.com) — Web Service 또는 Blueprint + [`render.yaml`](render.yaml)
2. Start: `npm run start:server`
3. 환경 변수: `JWT_SECRET`, `CORS_ORIGIN`(Vercel URL, 예: `https://groom-260602-todolist.vercel.app`)
4. `https://<api-host>/api/health` → `{"ok":true}` 확인

### 2단계: 프론트 (Vercel)

**Settings → Environment Variables** (Production):

| 변수 | 설명 |
|------|------|
| `API_SERVER_URL` | **권장** — 빌드 시 `vercel.json`에 `/api` → Render 프록시 |
| `VITE_API_URL` | 대안 — 브라우저가 API URL 직접 호출 (`CORS_ORIGIN` 필수) |

Build: `npm run build` · Output: `dist` · 변수 설정 후 **Redeploy**

---

## 아키텍처 (로그인 사용자)

```
React (Zustand) → dataSync → Express API → SQLite
```

게스트: `Zustand` ↔ `sessionStorage` (`src/utils/guestSession.ts`, `src/data/guestDemo.ts`)

---

## 변경·오류 수정 이력

### 백엔드·인증

- Supabase 제거 → **Express + SQLite** + 이메일/비밀번호 + JWT
- allowlist 제거 — 누구나 회원가입
- 프론트 포트 **5156**, Vite `/api` 프록시

### Vercel 배포 이슈

- **원인**: Vercel은 프론트만 호스팅, Express API는 별도 서버 필요
- **증상**: 로그인 화면에「API 서버가 필요합니다」등 표시, 로그인 버튼 비활성
- **해결**: Render 등에 API 배포 + Vercel에 `API_SERVER_URL` 또는 `VITE_API_URL` 설정 후 재배포
- 빌드 시 [`scripts/generate-vercel-config.mjs`](scripts/generate-vercel-config.mjs)로 `/api` 프록시 생성
- 프로덕션 안내 문구 개선 ([`src/lib/api.ts`](src/lib/api.ts), [`src/pages/Login.tsx`](src/pages/Login.tsx))

### 체험(게스트) 모드

- [`AuthContext`](src/contexts/AuthContext.tsx): `enterGuestMode`, `isGuest`
- [`ProtectedRoute`](src/components/ProtectedRoute.tsx): `user || isGuest` 허용
- [`guestDemo.ts`](src/data/guestDemo.ts) / [`guestSession.ts`](src/utils/guestSession.ts): 데모 시드 + sessionStorage
- [`GuestModeBanner`](src/components/GuestModeBanner.tsx), Layout 체험 UI

### UI·UX

- primary `#4D796B`, 네비 8탭 가로 스크롤
- 카테고리·습관 추가 **+**: 흰색 `+` / 녹색 버튼 (이모지 보라색 이슈 제거)

### Timetabel · Habit

- 교사/부모 **별도** 시간표·습관 목록
- Habit: + 팝업, 예시 습관, 주수 1~10주, 그리드 좌상단=오늘 (`getHabitGridDates`)
- `weekCount` 미존재 습관 → 로드 시 4주 보정

### 기타

- LocalStorage → 서버 1회 마이그레이션 모달
- TypeScript·빌드 오류 수정

---

## 환경 변수

`.env.example` 참고.

| 변수 | 설명 |
|------|------|
| `JWT_SECRET` | API JWT (필수) |
| `PORT` | API 포트 (기본 3001) |
| `CORS_ORIGIN` | 허용 프론트 URL |
| `VITE_API_URL` | 프론트 직접 API 호출 (Vercel) |
| `API_SERVER_URL` | Vercel 빌드 `/api` 프록시용 |

---

## 라이선스

개인·교육용 프로젝트입니다.

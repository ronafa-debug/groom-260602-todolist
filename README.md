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
| 날씨 | [Open-Meteo](https://open-meteo.com/) Forecast + Geocoding API (키 불필요) |
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
| 웹 | http://localhost:5157 |
| API | http://localhost:3001 (`/api` → Vite 프록시) |

### 이용 방법

| 방식 | 설명 |
|------|------|
| **회원 이용** | 로그인 화면에서 회원가입(비밀번호 6자 이상) → 로그인 → 서버에 데이터 저장 |
| **체험(게스트)** | 로그인 화면 하단 **로그인 없이 둘러보기** → API 없이 전 탭 체험, `sessionStorage`에만 저장 |

### 주요 npm 스크립트

- `npm run dev` — API + 프론트 동시 실행
- `npm run build` — Vercel용 프론트 빌드 (`scripts/generate-vercel-config.mjs` 포함)
- `npm run start:server` — API 단독 실행

---

## 주요 기능

### 할 일 (Home · Today · Upcoming · Done)

- 할 일 CRUD, 중요도(빨리 / 천천히 / 나중에), 마감일
- 교사 / 부모 모드 전환, 모드별 카테고리
- 카테고리 **+** 버튼(팝업 관리), Today·Upcoming 드래그 정렬
- 완료 격려 메시지, 진행률 대시보드

### Calendar (캘린더)

- 월별 그리드(일~토), 마감일 일정 미리보기(최대 3건 + `+N`)
- **날짜 칸 클릭** → 해당 날짜 **전체 일정** 팝업
- **날씨**: Open-Meteo 기준 **오늘 포함 최대 16일** 예보 (오전 9시 / 오후 3시 이모지)
- 우측 상단 **지역 선택** (시·군·구 검색, `localStorage` 저장)
- 한국 지명 검색 보정: 별칭·`시`/`군` 확장, 주요 광역시·남원 등 curated 목록 ([`src/data/koreanWeatherLocations.ts`](src/data/koreanWeatherLocations.ts))

### Timetabel (시간표)

- 탭 진입 시 **그리드 시간표** 바로 표시 (칸 클릭으로 입력)
- **행**: 1~6교시 기본, **+7~12교시** 추가 가능 · **4·5교시 사이 점심시간** 행
- **열**: 월~금 기본, **토·일** 선택 추가
- **교시 칸** 클릭 → 해당 교시 **시작/종료 시간** (예: `0900-0940`) 설정
- **요일 칸** 클릭 → 과목·활동, **학급/장소** 입력
- 교시·주말 표시 개수는 `localStorage` ([`src/utils/timetableLayoutStorage.ts`](src/utils/timetableLayoutStorage.ts))
- 교사/부모 모드별 데이터 분리 저장

### Habit (습관)

[HabitKit](https://www.habitkit.app/) 스타일의 습관 추적 탭.

- 습관 추가·수정·삭제 (이름, 이모지, 색상, 설명, 빈도)
- 빈도: 매일 / 평일(월–금) · 표시 주수 1~10주(기본 4주)
- 타일 그리드, streak, **오늘 완료** (그리드 **오늘 = 좌상단**)
- 습관 없을 때 모드별 **예시 습관** 표시
- 탭 제목 우측 **+** → 팝업으로 추가

### Community (커뮤니티)

- Habit 탭 오른쪽 **Community** 탭
- **교사 모드** (10개): 어린이집·유치원·초등학교·중학교·고등학교 **교사** 모임 + 특수·보건·상담·영양·사서교사 모임
- **부모 모드** (5개): 학교급별 **학부모** 모임
- 각 모임 **입장** 버튼 → `chatUrl` 채팅방 새 탭 (링크는 [`src/data/community.ts`](src/data/community.ts)에서 설정)

### 체험(게스트) 모드

- 로그인·API 없이 Home ~ **Community** 전 탭 사용
- 샘플 할 일·시간표·습관으로 시작, 세션 중 CRUD 가능
- `sessionStorage`에 저장(브라우저 탭을 닫기 전까지 유지, **서버 미저장**)
- 상단 배너·헤더 **체험 종료** / **로그인하기**

### 계정·동기화 (로그인 시)

- 회원가입·로그인·로그아웃
- 사용자별 SQLite + REST API 동기화
- 예전 LocalStorage 데이터 1회 가져오기 안내

### 레이아웃

- 헤더(앱 제목 아래): **교사와 부모를 위한 힐링 플래너**
- 하단: **힐링 Today Planner · 오뚝이아빠 김선생**

---

## 탭 구성

Home · Today · Upcoming · Done · Calendar · Timetabel · Habit · **Community**

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

날씨: `useCalendarWeather` → Open-Meteo (브라우저 직접 호출, `sessionStorage` 캐시)

---

## 변경·오류 수정 이력

### 백엔드·인증

- Supabase 제거 → **Express + SQLite** + 이메일/비밀번호 + JWT
- allowlist 제거 — 누구나 회원가입
- 프론트 포트 **5157**, Vite `/api` 프록시 · CORS에 `5157` 허용

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

### Calendar · 날씨

- Open-Meteo Geocoding + Forecast 연동 ([`weatherApi.ts`](src/services/weatherApi.ts), [`geocoding.ts`](src/services/geocoding.ts))
- 예보 표시 **최대 16일** (API 상한, [`weatherWindow.ts`](src/utils/weatherWindow.ts))
- 지역 검색 오류 보정: `인천`→인천광역시, `광주` 광역시·경기 광주, `남원` 등 curated + `시`/`군` 검색 확장
- 지역 선택 UI를 캘린더 카드 **밖** 제목 줄 우측으로 이동 (Habit `+` 버튼과 동일 패턴)
- 날짜 칸 클릭 시 **전체 일정** 팝업 ([`CalendarDayTasksModal.tsx`](src/components/CalendarDayTasksModal.tsx))
- 일정 표시 순서·간격, 날씨 행 `mt-auto` 레이아웃 조정

### Timetabel (시간표 개편)

- 목록+폼 방식 → **그리드 + 칸 클릭 편집** ([`TimetableGrid.tsx`](src/components/TimetableGrid.tsx))
- 6교시 기본, 7~12교시 추가, 4·5교시 사이 **점심시간** 행
- 월~금 기본, 토·일 선택 추가, 교시별 **수업 시간** 설정
- `학급/장소` 라벨 통일, 칸 내용 **가운데 정렬**
- 구형 `TimetableEditor` / `TimetableList` 제거

### Community

- **Community** 탭·라우트 추가
- 교사 10개 / 부모 5개 모임, `chatUrl`로 입장 ([`community.ts`](src/data/community.ts))

### UI·UX

- primary `#4D796B`, 네비 **9탭** 가로 스크롤
- 헤더·푸터 안내 문구 위치 교체
- 카테고리·습관 추가 **+**: 흰색 `+` / 녹색 버튼 (이모지 보라색 이슈 제거)

### Habit

- 교사/부모 **별도** 습관 목록
- + 팝업, 예시 습관, 주수 1~10주, 그리드 좌상단=오늘 (`getHabitGridDates`)
- `weekCount` 미존재 습관 → 로드 시 4주 보정

### 기타

- LocalStorage → 서버 1회 마이그레이션 모달
- TypeScript·빌드 오류 수정 (중복 import, timetable 타입, geocoding 등)

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

## Community 채팅 링크 설정

[`src/data/community.ts`](src/data/community.ts)에서 각 모임의 `chatUrl`에 카카오톡·오픈채팅 등 URL을 넣으면 **입장** 버튼이 활성화됩니다. 비어 있으면 **준비 중**으로 표시됩니다.

---

## 라이선스

개인·교육용 프로젝트입니다.

# 오늘도 수고했어요 (Today Planner)

교사와 부모를 위한 감성 생산성 To Do App입니다.  
개발: **오뚝이아빠 김선생**

GitHub: [ronafa-debug/groom-260602-todolist](https://github.com/ronafa-debug/groom-260602-todolist)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트 | React 19 + TypeScript + Vite + Tailwind CSS |
| 상태/라우팅 | Zustand · React Router |
| 백엔드 | Express 5 + SQLite (`better-sqlite3`) |
| 인증 | 이메일·비밀번호 + JWT (`localStorage`) |

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

**처음 사용**: 로그인 화면에서 **회원가입** (비밀번호 6자 이상) → **로그인**

### 주요 npm 스크립트

- `npm run dev` — API + 프론트 동시 실행
- `npm run build` — 프론트 프로덕션 빌드
- `npm run start:server` — API 단독 실행

---

## 주요 기능

### 할 일 (Home · Today · Upcoming · Done · Calendar)

- 할 일 CRUD, 중요도(빨리 / 천천히 / 나중에), 마감일
- 교사 / 부모 모드 전환, 모드별 카테고리
- 카테고리 관리(팝업), Today·Upcoming 드래그 정렬
- 완료 격려 메시지, 진행률 대시보드
- 캘린더: 월별 보기, 날짜별 할 일(최대 3건 표시)

### Timetabel (시간표)

- 교사: 수업 시간표 / 부모: 자녀 학교·학원 일정
- 월~금, 시작·종료 시각, 제목·메모
- 모드별 데이터 분리 저장

### Habit (습관)

[HabitKit](https://www.habitkit.app/) 스타일의 습관 추적 탭.

- 습관 추가·수정·삭제 (이름, 이모지, 색상, 설명, 빈도)
- 빈도: 매일 / 평일(월–금)
- 표시 주수: 1~10주 선택 (기본 4주)
- 습관별 타일 그리드, 연속(streak), **오늘 완료** 토글
- 그리드: **오늘 = 좌상단**, 과거로 갈수록 우·하단
- 습관 없을 때: 모드별 **예시 습관 + 그리드** 안내
- 추가 UI: 탭 제목 우측 **+** 버튼 → 팝업 폼

### 계정·동기화

- 회원가입·로그인·로그아웃 (헤더)
- 사용자별 SQLite 저장 + REST API 동기화
- 예전 LocalStorage 데이터 1회 가져오기 안내

---

## 탭 구성

Home · Today · Upcoming · Done · Calendar · Timetabel · **Habit**

---

## 인증·API 개요

- `POST /api/auth/register` · `POST /api/auth/login`
- `GET /api/data` · `PUT /api/data/profile` · tasks CRUD · `POST /api/data/import`
- 프로필 JSON 필드: `categories`, `today_order`, `upcoming_order`, `teacher_timetable`, `parent_timetable`, `teacher_habits`, `parent_habits`, `habit_completions`

DB 파일: `server/data.db` (git 제외, 로컬·서버에서 자동 생성)

---

## 프로덕션 배포 (Vercel + Render)

**왜 Vercel만으로는 로그인이 안 되나요?**  
Vercel은 React **정적 프론트**만 호스팅합니다. 로그인·DB는 **Express + SQLite API**가 필요하며, 이 서버는 Render·Railway 등에 **별도 배포**해야 합니다.

### 1단계: API 서버 (Render 권장)

1. [Render](https://render.com)에서 New → **Blueprint** 또는 Web Service, 이 저장소 연결
2. 루트의 [`render.yaml`](render.yaml) 사용 시: Start Command `npm run start:server`
3. 환경 변수:
   - `JWT_SECRET` — 32자 이상 랜덤 문자열
   - `CORS_ORIGIN` — Vercel 앱 URL (예: `https://groom-260602-todolist.vercel.app`)
4. 배포 후 API URL 확인 (예: `https://groom-todolist-api.onrender.com`)
5. `https://.../api/health` 가 `{ "ok": true }` 이면 정상

### 2단계: 프론트 (Vercel)

Vercel 프로젝트 → **Settings → Environment Variables** (Production):

| 변수 | 값 | 설명 |
|------|-----|------|
| `API_SERVER_URL` | `https://your-api.onrender.com` | **권장** — 빌드 시 `/api`를 Vercel에서 API로 프록시 (CORS 불필요) |
| 또는 `VITE_API_URL` | 위와 동일 | 브라우저가 API URL로 직접 요청 (API에 `CORS_ORIGIN` 필수) |

- Build Command: `npm run build` (기본값)
- Output: `dist`
- 변수 추가 후 **Redeploy** 필수

로컬과 달리 `npm run dev`는 Vercel에서 실행되지 않습니다.

---

## 아키텍처·데이터 흐름

```
React (Zustand) → dataSync → Express API → SQLite (profiles + tasks)
```

- 습관·시간표·카테고리·정렬: `profiles` 테이블 JSON 컬럼
- 할 일: `tasks` 테이블

---

## 변경·오류 수정 이력 (요약)

### 백엔드·인증

- Supabase 의존 제거 → **Express + SQLite** + 이메일/비밀번호 인증으로 전환
- allowlist(가입 제한) 제거 — 누구나 회원가입 가능
- JWT 기반 API, Vite `/api` 프록시, 프론트 포트 **5156** 고정

### UI·UX

- 앱 타이틀·로그인·헤더 문구, primary 색상(`#4D796B`) 정리
- 네비 8탭 대응 **가로 스크롤**
- Home 카테고리 **+** 버튼: Habit 탭과 동일 스타일(녹색 배경 + 흰색 `+`, 이모지 보라색 이슈 제거)

### Timetabel

- 교사/부모 **별도 시간표** 저장 (`teacher_timetable`, `parent_timetable`)

### Habit 탭

- MVP: CRUD, 오늘 완료, streak, 타일 그리드, 모드별 습관 목록
- 인라인 폼 → **+ 팝업** 추가
- 빈 화면 **예시 습관** 표시
- **주수(1~10주)** 선택, 기본 4주
- 그리드 날짜 순서 수정: 완료 시 **좌상단(오늘)부터** 채워지도록 (`getHabitGridDates`)
- 기존 습관 `weekCount` 없으면 로드 시 4주로 보정

### 기타

- LocalStorage → 서버 **1회 마이그레이션** 모달
- TypeScript 빌드·중복 import·습관 타입 정합성 수정

---

## 환경 변수

`.env.example` 참고.

| 변수 | 설명 |
|------|------|
| `JWT_SECRET` | API JWT 서명 (필수) |
| `PORT` | API 포트 (기본 3001) |
| `CORS_ORIGIN` | 허용 프론트 URL (프로덕션) |
| `VITE_API_URL` | 프론트가 API를 직접 호출할 때 (Vercel 대안) |
| `API_SERVER_URL` | Vercel 빌드 시 `/api` 프록시용 (README 배포 절) |

---

## 라이선스

개인·교육용 프로젝트입니다.

# [PRD] MyLink - 마이링크 제품 요구사항 정의서

> 버전: v1.2.0  
> 최종 수정일: 2026-09-30  
> 상태: 확정 (Approved)  
> 프로젝트: 링크트리 클론 + shadcn/ui 기반 컴포넌트 시스템 및 토스 디자인 시스템(TDS) 감성의 다중 사용자 SaaS

---

## 1. 제품 개요 (Product Overview)

### 1.1 배경 및 목적

- SNS 프로필에 단 하나의 링크만 게시할 수 있는 제약을 해소하는 Link-in-bio 서비스.
- 링크트리의 핵심 편의성(실시간 모바일 프리뷰, 드래그앤드롭)과 **shadcn/ui를 기반으로 design.md의 토스 디자인 시스템(TDS)을 구현한 커스텀 컴포넌트 및 마이크로 인터랙션·토스트·응원하기 UX**를 결합.
- 초기 단계: LocalStorage + Mock Data 기반 클라이언트 전용 데모.
- 이후 단계: Supabase(Auth·PostgreSQL·스토리지) 확장 가능하도록 storageAdapter.ts 레이어 추상화 설계.

### 1.2 핵심 타겟 사용자

1. 크리에이터·인플루언서 - 유튜브·인스타·포트폴리오를 한 곳에 모아 팬에게 공유.
2. 개발자·메이커 - GitHub·블로그·프로젝트를 매력적으로 큐레이션.
3. 취업·프리랜서 - 포트폴리오·이력·연락처를 깔끔히 전달.

---

## 2. 제품 핵심 가치 (Value Proposition)

| 가치 | 설명 |
|------|------|
| shadcn/ui 기반 TDS 디자인 시스템 | Radix UI 접근성 + design.md의 토스(TDS) 비주얼 토큰(Oklch, Pretendard, 둥근 라운딩, 햅틱 인터랙션)을 결합한 완성도 높은 UI. |
| WYSIWYG 2분할 에디터 | 좌측 편집 -> 우측 모바일 목업 실시간 반영 (0.1 s 이내). |
| 감성 인터랙션 | 응원하기(하트)·이메일 복사·공유·TDS 토스트 피드백 제공. |
| 가볍고 빠른 로컬 동작 | LocalStorage 기반 즉시 가입·로그인·데이터 저장 완결. |
| 디자인 프리셋 | 토스 미니멀·모던 다크·소프트 파스텔·비비드 네온 + 버튼 스타일·포인트 컬러 선택. |

---

## 3. 정보 구조 및 라우팅 (Information Architecture)

```
[마이링크 서비스 구조]
app/
  page.tsx                    # / - 공개 프로필 페이지 (1순위 현재 구현 대상)
  admin/
    page.tsx                  # /admin - 2분할 에디터 대시보드
  [username]/
    page.tsx                  # /@:username - 다중 사용자 공개 프로필
  login/
    page.tsx                  # /login - 인증 UI
  signup/
    page.tsx                  # /signup - 회원가입 UI
```

---

## 4. 상세 기능 요구사항 (Functional Requirements)

### 4.1 [1순위 - 현재 구현 범위] 공개 프로필 페이지 (Public Profile Page)

#### 개요

- 경로: / (현재) -> 향후 /@:username
- 데이터 소스: localStorage 키 `my-link-hy-store`
- Mock 데이터 폴백: localStorage 미존재 시 DEFAULT_PROFILE 사용
- 스타일: shadcn/ui 컴포넌트 시스템 기반 + TDS 컬러 토큰(Oklch) 및 인터랙션 접목, 모바일 퍼스트 (max-w-[480px])

#### 구성 섹션 (위에서 아래 순서)

| # | 섹션 | 상세 |
|---|------|------|
| 1 | TopBar (56 px, sticky) | 좌: 마이링크 브랜드 로고 + 텍스트. 우: 공유 버튼 (클립보드 복사 + TDS 토스트). |
| 2 | 프로필 메인 카드 | 원형 아바타(이니셜 fallback) + 온라인 상태 점·표시 이름·역할 뱃지·이메일·소개글. |
| 3 | 액션 버튼 행 | 이메일 복사 버튼 + 응원하기 버튼 (하트 카운터·토글·TDS 토스트). |
| 4 | 현황 요약 카드 2열 | 현재 집중 분야·학습 상태 (녹색 활성 점 포함). |
| 5 | 바로가기 링크 리스트 | 활성 링크만 렌더링. 아이콘 컨테이너(44 px) + 제목·부제목·뱃지 칩 + chevron. |
| 6 | 소셜 아이콘 바 | socials 객체에 값이 있는 플랫폼만 아이콘 노출 (GitHub·Instagram·YouTube·X·LinkedIn). |
| 7 | 관심 키워드 칩스 | tags 배열을 TDS Chip(rounded-full, border) 스타일로 렌더링. |
| 8 | 푸터 | 저작권 텍스트. |
| 9 | BottomCTA (fixed) | 하단 고정 56 pt Primary 버튼 - 이메일로 문의하기 (클립보드 복사 + 토스트). |
| 10 | TDS Toast | grey-900 배경·green-500 체크 아이콘·fade-in/slide-up 애니메이션. |

#### LocalStorage 데이터 구조

```typescript
export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  badge?: string;
  isActive: boolean;
  order: number;
  clicks: number;
  iconType?: "github" | "blog" | "notion" | "instagram" | "custom";
}

export interface UserLinkPage {
  username: string;
  displayName: string;
  bio: string;
  badge: string;
  avatarUrl?: string;
  email: string;
  likes: number;
  views: number;
  tags: string[];
  socials: {
    github?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  theme: {
    presetId: "toss" | "dark" | "pastel" | "neon";
    buttonStyle: "rounded" | "sharp" | "pill";
    primaryColor: string;
  };
  links: LinkItem[];
}
```

#### Mock 기본 데이터 및 API 명세 (더미 데이터)

서비스 프로토타입 및 개발 초기 단계에서는 아래의 **더미 데이터(JSON)**와 **백엔드 Mock API**를 표준 데이터 소스로 사용한다.

- **JSON 더미 데이터 파일**: `src/data/links.json` (프로필, 카테고리, 9종 링크 데이터셋)
- **정적 서빙용 파일**: `public/mock/links.json` (프론트엔드 직접 fetch 지원)
- **백엔드 Mock API**: `src/app/api/links/route.ts`
  - `GET /api/links`: 링크 목록 조회 (필터: `category`, `sort`, `search` 지원)
  - `POST /api/links`: 링크 클릭 수 증가 트래킹
- **TypeScript 타입 정의**: `src/types/link.ts` (`LinkItem`, `ProfileInfo`, `LinksApiResponse` 등)
- **React 컴포넌트용 데이터셋**: `src/data/links.tsx` (SVG 아이콘 및 카테고리 정의 포함)

```typescript
// src/data/links.json 기반 기본 데이터 구조 예시
const DEFAULT_PROFILE: UserLinkPage = {
  username: "chaeyoon",
  displayName: "임채윤",
  bio: "안녕하세요, 바이브 코딩을 통해 유용한 프로덕트를 만들어가고 있어요. 새로운 기술과 일상의 문제를 잇는 것에 관심이 많아요.",
  badge: "대학생 메이커",
  email: "chaeyoon.lim@example.com",
  likes: 128,
  views: 0,
  tags: ["Vibe Coding", "Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "AI Agents"],
  socials: {
    github: "https://github.com",
    instagram: "https://instagram.com",
  },
  theme: { presetId: "toss", buttonStyle: "rounded", primaryColor: "#3182F6" },
  links: [
    {
      id: "github", title: "GitHub 저장소", subtitle: "진행 중인 오픈소스 및 개인 프로젝트 소스코드",
      url: "https://github.com", badge: "코드", isActive: true, order: 1, clicks: 1420, iconType: "github",
    },
    {
      id: "portfolio-notion", title: "노션 포트폴리오", subtitle: "자기소개, 경력 기술서 및 프로젝트 상세 회고",
      url: "https://notion.so", badge: "대표", isActive: true, order: 2, clicks: 980,
    },
    {
      id: "project-ai-note", title: "사이드 프로젝트: AI 바이브 노트", subtitle: "AI와 함께 생각을 정리하고 기록하는 스마트 메모앱",
      url: "https://github.com", badge: "신규", isActive: true, order: 3, clicks: 432,
    },
    {
      id: "tech-blog", title: "기술 블로그 (Velog)", subtitle: "Next.js, React, 프론트엔드 아키텍처 학습 일지",
      url: "https://velog.io", badge: "글", isActive: true, order: 4, clicks: 756, iconType: "blog",
    },
    {
      id: "design-system", title: "TDS 스타일 컴포넌트 라이브러리", subtitle: "토스 디자인 시스템을 모티브로 한 UI 키트 Figma & 데모",
      url: "https://figma.com", badge: "디자인", isActive: true, order: 5, clicks: 310,
    },
    {
      id: "linkedin", title: "LinkedIn 프로필", subtitle: "이력 사항 확인 및 커리어 네트워킹",
      url: "https://linkedin.com", badge: "커리어", isActive: true, order: 6, clicks: 520,
    },
    {
      id: "instagram", title: "인스타그램", subtitle: "메이커의 일상과 개발 비하인드 스토리",
      url: "https://instagram.com", badge: "SNS", isActive: true, order: 7, clicks: 689, iconType: "instagram",
    },
    {
      id: "coffee-chat", title: "커피챗 신청하기", subtitle: "가벼운 티타임, 개발 이야기, 프로젝트 협업 제안 환영해요",
      url: "https://open.kakao.com", badge: "환영", isActive: true, order: 8, clicks: 245,
    },
    {
      id: "contact-mail", title: "공식 업무 및 협업 이메일", subtitle: "chaeyoon.lim@example.com (클릭 시 메일 작성창 연결)",
      url: "mailto:chaeyoon.lim@example.com", badge: "문의", isActive: true, order: 9, clicks: 178,
    },
  ],
};
```

#### 인터랙션 상세

| 인터랙션 | 동작 | 상태 변화 | 토스트 메시지 |
|---------|------|----------|--------------|
| 응원하기 (미응원) | 하트 카운터 +1, hasLiked=true, localStorage 동기화 | likes 증가, 하트 파란색 | "소중한 응원이 전달되었어요" |
| 응원하기 (응원 중) | 하트 카운터 -1, hasLiked=false | likes 감소, 하트 흰색 | - |
| 이메일 복사 | navigator.clipboard.writeText(email) | - | "이메일 주소가 복사되었어요" |
| 페이지 공유 | navigator.clipboard.writeText(location.href) | - | "프로필 주소가 복사되었어요" |
| 링크 클릭 | clicks +1 localStorage / Mock API 기록 후 새 탭 이동 | clicks 증가 | - |

#### 파일 구조

```
src/
  types/
    link.ts           # LinkItem, ProfileInfo, LinksApiResponse 등 공유 타입 정의
  data/
    links.json        # 표준 더미 데이터셋 (JSON)
    links.tsx         # SVG 아이콘 포함 React 컴포넌트용 더미 데이터
  lib/
    utils.ts          # 유틸리티 함수 (cn 등)
    storage.ts        # LocalStorage read/write 헬퍼 (getProfile, saveProfile)
  hooks/
    useProfile.ts     # useProfile() - 프로필 데이터 로드·저장 훅
  components/
    profile/
      TopBar.tsx
      ProfileCard.tsx
      ActionButtons.tsx
      StatusCards.tsx
      LinkList.tsx
      SocialBar.tsx
      TagChips.tsx
      BottomCTA.tsx
      Toast.tsx
  app/
    api/
      links/
        route.ts      # 백엔드 Mock REST API 라우트 핸들러 (GET, POST)
    page.tsx          # 공개 프로필 페이지 (/ 경로)
public/
  mock/
    links.json        # 정적 fetch용 Mock JSON
```

---

### 4.2 인증·계정 관리 - 추후 구현

| ID | 내용 |
|----|------|
| F-AUTH-01 | 이메일/비밀번호 가입·로그인 + 구글·카카오 Mock 간편 로그인. |
| F-AUTH-02 | 데모 환경에서 임채윤(기본), 신규 사용자, 커스텀 계정 간 1-클릭 전환. |
| F-AUTH-03 | 프로필 관리: 아바타(이미지·이니셜), 표시명(30자 이하), Bio(150자 이하), 뱃지, 키워드(태그). |

### 4.3 링크 관리 - 추후 구현

| ID | 내용 |
|----|------|
| F-LINK-01 | 링크 추가·수정·삭제 - Title, Subtitle, URL 필수, 뱃지 텍스트 지정. |
| F-LINK-02 | 드래그앤드롭 순서 변경 -> 즉시 프리뷰·LocalStorage 동기화. |
| F-LINK-03 | 활성/비활성 토글(On/Off)로 링크 숨김·표시. |
| F-LINK-04 | 소셜 아이콘 바 - GitHub·Instagram·YouTube·X·LinkedIn·Email 자동 아이콘 렌더링. |

### 4.4 디자인·테마 커스터마이징 - 추후 구현

| ID | 내용 |
|----|------|
| F-THEME-01 | 프리셋 테마: 토스 미니멀(기본)·모던 다크·소프트 파스텔·비비드 네온. |
| F-THEME-02 | 버튼 모양 각진형/둥근형/알약형, 버튼 스타일(카드·아웃라인·글래스), 포인트 컬러 선택. |

### 4.5 실시간 2분할 에디터 UX - 추후 구현

| ID | 내용 |
|----|------|
| F-EDIT-01 | 반응형 2분할: 데스크톱 좌측 탭 패널 + 우측 모바일 프레임. 모바일 미리보기 토글. |
| F-EDIT-02 | debounced 자동 저장 + 즉시 프리뷰 반영. |
| F-EDIT-03 | 공개 링크 표시·새 창 열기·링크 복사 버튼 제공. |

### 4.6 통계·분석 대시보드 - 추후 구현

| ID | 내용 |
|----|------|
| F-STAT-01 | 핵심 메트릭: 총 조회수, 총 링크 클릭수, CTR, 누적 응원 수. |
| F-STAT-02 | 링크별 성과: 실시간 클릭 수·점유율 바 그래프. |
| F-STAT-03 | 최근 7일 트렌드: 일일 방문·클릭 라인/바 차트. |

---

## 5. 데이터 모델 (Data Architecture)

### localStorage 키: "my-link-hy-store"

```typescript
export interface DailyAnalytics {
  date: string;   // YYYY-MM-DD
  views: number;
  clicks: number;
}

export interface UserLinkPage {
  username: string;
  displayName: string;
  bio: string;
  badge: string;
  avatarUrl?: string;
  email: string;
  likes: number;
  views: number;
  tags: string[];
  socials: {
    github?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  theme: {
    presetId: "toss" | "dark" | "pastel" | "neon";
    buttonStyle: "rounded" | "sharp" | "pill";
    primaryColor: string;
  };
  links: LinkItem[];
  analyticsHistory: DailyAnalytics[];
}
```

### 전역 상태 관리: Zustand + persist

- 라이브러리: `zustand` + `zustand/middleware`의 `persist`
- 스토어 파일: `src/store/useLinkPageStore.ts`
- `persist` 미들웨어가 localStorage `"my-link-hy-store"` 키에 자동 동기화.
- 추후 Supabase 전환 시 `persist` 대신 `fetch` 기반 async 액션으로 교체.

---

## 6. 비기능 요구사항 (Non-Functional Requirements)

### 6.1 디자인 시스템 아키텍처: shadcn/ui × 토스 디자인 시스템 (TDS)
모든 UI 컴포넌트는 **`shadcn/ui`의 Headless/Accessible 기본 뼈대** 위에 **`design.md`에 명시된 토스 디자인 시스템(TDS)의 시각 언어, 토큰, 인터랙션을 오버레이**하여 커스텀 디자인 시스템으로 구축한다.

> **[스타일링 표준 강제 규칙]**  
> - **CSS 모듈(`*.module.css`) 사용 일체 금지**: 모든 컴포넌트 및 페이지의 스타일은 **Tailwind CSS (v4) 유틸리티 클래스로 100% 통일**한다.
> - **shadcn/ui 기반 재사용 컴포넌트화**: 페이지 내에서 인라인 HTML 요소를 임의로 스타일링하지 않고, `src/components/ui/`에 `design.md` 기반으로 구축된 shadcn/ui 컴포넌트(`Button`, `Card`, `Badge`, `Chip`, `Avatar` 등)를 가져와 재사용한다.

#### 1) 기반 원칙 (Foundation)
- **Headless 접근성 (Radix UI / Base UI)**: shadcn/ui의 접근성 프리미티브를 활용해 WAI-ARIA, 키보드 네비게이션, 포커스 트랩, 스크린리더 접근성을 100% 보장.
- **TDS 컬러 토큰 매핑**: `design.md`의 Oklch 토큰을 shadcn CSS 변수에 1:1 바인딩:
  - `--primary`: `oklch(0.620 0.191 258)` (#3182F6 - 카노니컬 Toss Blue)
  - `--background`: `oklch(0.966 0.003 248)` (#F2F4F6 - TDS grey-100 캔버스)
  - `--foreground`: `oklch(0.237 0.020 258)` (#191F28 - TDS grey-900, Never pure black)
  - `--card`: `oklch(1 0 0)` (#FFFFFF - 흰색 카드 표면)
  - `--muted-foreground`: `oklch(0.666 0.021 253)` (#8B95A1 - TDS grey-500 보조 텍스트)
  - `--border`: `oklch(0.930 0.005 248)` (#E5E8EB - TDS grey-200 디바이더/보더)
- **타이포그래피**: `Pretendard Variable` 단일 폰트 패밀리, 행간 1.3~1.5, 음수 자간(-0.005em ~ -0.020em) 적용.
- **라운딩 스케일**: TDS 표준 곡률(기본 `--radius: 1rem/16px`, 버튼 10~16px, 카드 20~24px, 칩 full 999px).

#### 2) 핵심 컴포넌트별 TDS 매핑 명세
| shadcn/ui 컴포넌트 | TDS 커스텀 스타일 및 동작 규칙 (design.md 반영) |
|-------------------|-----------------------------------------------------------------|
| `Button` | - **Heights & Radii**: XL 56px (`rounded-2xl` / 16px, CTA), L 48px (`rounded-[14px]`, Main), M 40px (`rounded-xl` / 12px, Sub), S 32px (`rounded-[10px]`)<br>- **Variants**: Primary (`bg-[#3182f6] text-white hover:bg-blue-600`), Secondary (`bg-[#f2f4f6] text-[#191f28] hover:bg-[#e5e8eb]`), Weak (`bg-[#e8f3ff] text-[#3182f6]`), Danger (`bg-[#f04452] text-white`), Ghost (`bg-transparent text-[#3182f6]` / `text-[#4e5968]`)<br>- **Haptic Motion**: 클릭 시 살짝 눌리는 물리 피드백 (`active:scale-[0.98] transition-transform duration-100`) |
| `Card` | - 표면: `bg-white rounded-3xl (24px) border border-[#e5e8eb]/60 p-5`<br>- 그림자: TDS elevation `shadow-1` / `shadow-2` 적용, 차분하고 부드러운 카드 분리감 |
| `Badge` | - 22px 높이, 6px radius (`rounded-[6px]`), 10px-11px font, 세미볼드<br>- 시맨틱 워시드 배경 + 미세 보더 조합 |
| `Chip` | - 34px 높이의 full pill (`rounded-full`), 13px font, padding 14px<br>- Resting: 흰 배경 + 1px grey-200 보더 / Active: grey-900 배경 + 흰 텍스트 / Brand: blue-50 배경 + blue-500 텍스트 |
| `Avatar` | - 원형(`rounded-full`) 아바타 (56px / 48px), 이니셜 Fallback, TDS 온라인 상태 표시 점(`green-500`, 14px) 지원 |
| `Toast / Sonner` | - TDS 플로팅 스낵바 패턴: `fixed bottom-24 z-50`<br>- `bg-[#191f28] text-white rounded-2xl px-5 py-3.5 shadow-toast`<br>- 좌측 녹색 체크 아이콘(`green-500`) + 2.4초 자동 dismiss |
| `Input` | - 높이 48px, `rounded-xl border-grey-200 bg-white px-4`<br>- Focus: `ring-2 ring-[#3182f6] border-[#3182f6]` (TDS 포커스 하이라이트) |
| `Switch / Tabs` | - 토스 특유의 젤리 슬라이딩/스무스 스프링 애니메이션 적용 |

### 6.2 일반 비기능 요구사항
1. **반응형**: 320 px ~ 2560 px 전폭 지원, 모바일 퍼스트 (모바일 뷰 max-w-[480px] 중앙 정렬).
2. **스타일링 일관성**: 모듈 CSS 불허, Tailwind CSS 단일 도구로 스타일 일관성 보장.
3. **웹 접근성 & 사용성**: WAI-ARIA 준수, 외부 링크 `rel="noopener noreferrer"`, 모든 주요 인터랙션에 즉각적 TDS 토스트/햅틱 시각 피드백 제공.
4. **데이터 확장성**: `storageAdapter.ts` Repository 패턴으로 LocalStorage -> Supabase 10분 내 교체 가능.

---

## 7. 개발 로드맵 (Milestones)

| Milestone | 주요 작업 | 상태 |
|-----------|-----------|------|
| M1 - 프로필 페이지 | shadcn/ui 기반 컴포넌트(Card, Button, Badge, Avatar, Toast)를 TDS 테마로 커스텀 구축 및 적용. types.ts·mockData.ts·storage.ts 작성. useProfile 훅 구현. app/page.tsx 리팩터링. | **진행 예정** |
| M2 - 다중 사용자 라우팅 | app/[username]/page.tsx, LocalStorage 다중 계정 지원. | 대기 |
| M3 - 2분할 에디터 | /admin, shadcn/ui(Tabs, Dialog, Input, Switch) 기반 링크·프로필·테마 탭 + 실시간 프리뷰. | 대기 |
| M4 - Analytics 대시보드 | /admin/analytics, shadcn/ui 기반 메트릭 카드·링크 성과·7일 트렌드 차트. | 대기 |
| M5 - 인증·계정 전환 | /login·/signup (shadcn/ui Form/Input 기반), 데모 계정 스위처, 전역 Toast 통합. | 대기 |
| M6 (Optional) | Supabase 백엔드 전환: Auth·PostgreSQL·스토리지 연동. | 대기 |

---

## 8. 사용자 시나리오 (User Scenarios)

> 두 가지 역할로 분류합니다.
> - **방문자 (Visitor)**: 로그인 없이 공개 프로필 페이지를 보는 사람.
> - **소유자 (Owner)**: 가입 후 자신의 마이링크 페이지를 생성·관리하는 사람.

---

### 8.1 방문자 시나리오 (Visitor Scenarios)

#### VS-01. 링크 페이지 첫 방문

```
배경
  김민준은 인스타그램에서 친구 임채윤의 프로필 링크를 클릭했다.

시나리오
  1. /@chaeyoon 페이지가 모바일 브라우저에서 열린다.
  2. 상단 TopBar에서 "마이링크" 브랜드와 공유 버튼을 확인한다.
  3. 프로필 카드에서 아바타·이름·뱃지·소개글을 읽는다.
  4. "현재 집중 분야"와 "학습 상태" 현황 카드를 확인한다.
  5. 바로가기 링크 리스트에서 관심 있는 "기술 블로그" 항목을 탭한다.
  6. 새 탭으로 블로그가 열린다. (clicks +1 기록)

기대 결과
  - 링크 클릭 수가 localStorage에 +1 기록된다.
  - 외부 링크는 rel="noopener noreferrer" 로 새 탭에서 열린다.
  - 페이지 이탈 없이 원본 프로필은 그대로 유지된다.
```

#### VS-02. 응원하기 (하트) 인터랙션

```
배경
  방문자 이수아는 임채윤의 프로필을 감명 깊게 읽고 응원을 남기고 싶다.

시나리오
  1. 프로필 카드 하단 "🤍 응원 128" 버튼을 탭한다.
  2. 버튼이 "💙 응원 129"로 즉시 변경된다.
  3. "소중한 응원이 전달되었어요" TDS 토스트가 2.4 초간 노출된다.
  4. 실수로 다시 탭하면 "🤍 응원 128"로 되돌아간다. (토글)

기대 결과
  - likes 값이 localStorage에 저장되어 새로고침 후에도 유지된다.
  - 같은 기기에서 두 번 응원 시 카운터가 증가하지 않는다. (hasLiked 기반 방지)
```

#### VS-03. 이메일로 연락하기

```
배경
  채용 담당자 박지훈이 임채윤에게 인턴십 제안을 하고 싶다.

시나리오
  1. 하단 고정 CTA 버튼 "이메일로 문의하기"를 탭한다.
  2. 이메일 주소가 클립보드에 복사된다.
  3. "이메일 주소가 복사되었어요" 토스트가 노출된다.
  4. 박지훈은 이메일 앱을 열어 붙여넣기 후 메일을 작성한다.

기대 결과
  - navigator.clipboard.writeText() 가 정상 실행된다.
  - HTTPS 환경 또는 localhost에서 클립보드 API가 동작한다.
  - 복사 실패 시 폴백 동작(alert 또는 별도 안내 토스트)을 제공한다.
```

#### VS-04. 페이지 URL 공유

```
배경
  방문자가 친구에게 이 프로필 링크를 공유하고 싶다.

시나리오
  1. TopBar 우측 "공유" 버튼을 탭한다.
  2. 현재 페이지 URL이 클립보드에 복사된다.
  3. "프로필 주소가 복사되었어요" 토스트가 노출된다.
  4. 방문자는 카카오톡 채팅창에 붙여넣기 후 공유한다.

기대 결과
  - navigator.share() (Web Share API) 지원 기기에서는 OS 공유 시트를 우선 노출한다.
  - 미지원 기기에서는 클립보드 복사로 폴백된다.
```

---

### 8.2 소유자 시나리오 (Owner Scenarios)

#### OS-01. 최초 가입 및 프로필 생성

```
배경
  신규 사용자 정다은이 처음 마이링크에 방문해 자신의 링크 페이지를 만들려 한다.

시나리오
  1. 랜딩 페이지(/)에서 "내 마이링크 만들기" CTA 버튼을 클릭한다.
  2. /signup 페이지로 이동한다.
  3. 구글 로그인 버튼을 클릭한다. (Mock: 즉시 세션 생성)
  4. 프로필 설정 단계: 표시 이름·소개글·역할 뱃지를 입력한다.
  5. 기본 Mock 링크(GitHub·블로그 등)가 자동 삽입된다.
  6. /admin 에디터로 리다이렉트된다.

기대 결과
  - localStorage에 신규 UserLinkPage 객체가 생성된다.
  - /@daeeun 경로로 공개 페이지가 바로 접근 가능해진다.
  - 첫 접속 시 온보딩 토스트 "마이링크가 생성되었어요!"가 노출된다.
```

#### OS-02. 링크 추가·수정·삭제

```
배경
  소유자 임채윤이 새 사이드 프로젝트 링크를 추가하고, 오래된 링크를 삭제하려 한다.

시나리오
  1. /admin 에디터의 "Links" 탭에 진입한다.
  2. "+ 링크 추가" 버튼을 클릭한다.
  3. 제목·부제목·URL·뱃지를 입력하고 "저장"을 누른다.
  4. 우측 모바일 프리뷰에 새 링크가 즉시 반영된다.
  5. 기존 링크 행의 "⋮" 메뉴에서 "삭제"를 선택한다.
  6. 삭제 확인 후 링크가 목록에서 제거되고 프리뷰도 업데이트된다.

기대 결과
  - 링크 CRUD가 localStorage에 즉시 반영된다.
  - 프리뷰는 debounce 없이 실시간으로 동기화된다.
  - 삭제 시 되돌리기(undo) 토스트를 3초간 제공한다.
```

#### OS-03. 드래그앤드롭으로 링크 순서 변경

```
배경
  소유자가 GitHub 링크를 가장 위로 올리고 싶다.

시나리오
  1. Links 탭에서 GitHub 링크 행 좌측 드래그 핸들(⠿)을 잡는다.
  2. 위로 드래그하여 첫 번째 위치에 드롭한다.
  3. 애니메이션과 함께 순서가 재배치된다.
  4. 우측 모바일 프리뷰에 변경된 순서가 즉시 반영된다.

기대 결과
  - LinkItem.order 필드가 재계산되어 localStorage에 저장된다.
  - 드래그 중 다른 항목들이 자연스럽게 밀려나는 애니메이션이 동작한다.
```

#### OS-04. 링크 활성/비활성 토글

```
배경
  소유자가 진행 중인 프로젝트 링크를 완성 전까지 잠시 숨기고 싶다.

시나리오
  1. Links 탭에서 해당 링크 행의 토글 스위치를 Off로 변경한다.
  2. 링크 행이 반투명하게 흐려져 비활성 상태를 표시한다.
  3. 우측 모바일 프리뷰에서 해당 링크가 사라진다.
  4. /@username 공개 페이지에서도 해당 링크가 노출되지 않는다.

기대 결과
  - isActive: false 로 저장되며 삭제되지 않는다.
  - 토글을 다시 On하면 즉시 복구된다.
```

#### OS-05. 테마 변경

```
배경
  소유자가 자신의 페이지 분위기를 다크 모드로 바꾸고 싶다.

시나리오
  1. /admin 에디터의 "Appearance" 탭에 진입한다.
  2. "모던 다크" 테마 카드를 클릭한다.
  3. 우측 프리뷰가 즉시 다크 배경·글래스 카드·쿨 그레이 텍스트로 전환된다.
  4. 버튼 모양을 "알약형(Pill)"으로 변경한다.
  5. 포인트 컬러 팔레트에서 "바이올렛"을 선택한다.
  6. 변경 사항이 자동 저장된다. ("변경이 저장되었어요" 토스트)

기대 결과
  - theme 객체 (presetId·buttonStyle·primaryColor)가 localStorage에 저장된다.
  - 공개 /@username 페이지에서도 동일한 테마가 렌더링된다.
```

#### OS-06. 통계 확인

```
배경
  소유자가 어떤 링크가 인기 있는지 확인하고 싶다.

시나리오
  1. /admin 에디터의 "Analytics" 탭에 진입한다.
  2. 핵심 메트릭 카드에서 총 조회수·링크 클릭수·CTR·응원 수를 확인한다.
  3. 링크별 성과 테이블에서 "GitHub 저장소"가 클릭 수 1위임을 확인한다.
  4. 최근 7일 트렌드 차트에서 특정 날 방문자가 급증했음을 파악한다.

기대 결과
  - analyticsHistory 배열에서 날짜별 views·clicks 데이터를 읽어 차트로 렌더링한다.
  - 링크별 clicks는 LinkItem.clicks 필드에서 집계한다.
  - 데이터가 없는 날은 0으로 표시한다.
```

---

### 8.3 시나리오 → 기능 매핑 요약

| 시나리오 | 관련 기능 ID | 구현 Milestone |
|---------|-------------|---------------|
| VS-01 링크 페이지 첫 방문 | F-PUB-01, F-PUB-04 | M1 |
| VS-02 응원하기 | F-PUB-02 | M1 |
| VS-03 이메일 연락 | F-PUB-02 | M1 |
| VS-04 URL 공유 | F-PUB-02 | M1 |
| OS-01 최초 가입 | F-AUTH-01, F-AUTH-02 | M5 |
| OS-02 링크 CRUD | F-LINK-01 | M3 |
| OS-03 순서 변경 | F-LINK-02 | M3 |
| OS-04 링크 토글 | F-LINK-03 | M3 |
| OS-05 테마 변경 | F-THEME-01, F-THEME-02 | M3 |
| OS-06 통계 확인 | F-STAT-01, F-STAT-02, F-STAT-03 | M4 |

---

## 9. 와이어프레임 (Wireframes)

> **대상 화면**: 메인 화면 - 방문자(Visitor) 뷰 (/ 또는 /@:username)
> **기준 해상도**: 375 x 812 px (모바일 퍼스트)
> **인터랙티브 버전**: 별도 HTML 파일로 제공

---

### 9.1 메인 화면 레이아웃 (방문자 뷰)

```
+-----------------------------------------+  <- 375px
| (1) TopBar                      [공유]  |  56px . sticky . bg-white/80 blur
+-----------------------------------------+
|                                         |
|  (2) 프로필 메인 카드                    |
|  +----------------------------------+   |
|  |  [CY](on) 임채윤  [대학생 메이커] |   |  아바타(48px) + 온라인 점
|  |       chaeyoon.lim@example.com  |   |
|  |  +----------------------------+ |   |
|  |  |  소개글 텍스트 (최대 2줄)    | |   |  bg-grey-50 내부 박스
|  |  +----------------------------+ |   |
|  |                                 |   |
|  |  (3) [ 이메일 복사 ] [ 응원 128] |   |  2열 그리드 버튼
|  +----------------------------------+   |
|                                         |
|  (4) 현황 카드  +--------+ +----------+ |
|                 |집중분야| |(.) 학습   | |  2열 카드 그리드
|                 +--------+ +----------+ |
|                                         |
|  (5) 바로가기 링크                       |
|  +----------------------------------+   |
|  | [GH] GitHub 저장소  [코드]     > |   |  ListRow
|  +----------------------------------+   |  isActive=true 만 노출
|  | [BL] 기술 블로그    [글]       > |   |  clicks +1 트래킹
|  +----------------------------------+   |
|  | [NO] 노션 포트폴리오 [이력]    > |   |
|  +----------------------------------+   |
|                                         |
|  (6)+(7) 소셜 & 키워드                  |
|  +----------------------------------+   |
|  |  [GH] [IG] [YT] [X] [LI]       |   |  socials 값 있는 것만
|  |                                 |   |
|  |  관심 키워드                     |   |
|  |  [Vibe Coding] [Next.js] [TS]   |   |  tags -> Chip
|  +----------------------------------+   |
|                                         |
|  (8) (c) 2026 Lim Chaeyoon             |  푸터
|                                         |
|  (스크롤 여백)                           |
|                                         |
+=========================================+
|  (9) [  이메일로 문의하기 (CTA)       ]  |  56pt . fixed bottom
+-----------------------------------------+

  (10) TDS Toast (조건부)
  +--------------------------------+
  |  (check) 소중한 응원이 전달됐어요 |  <- bottom: 96px
  +--------------------------------+  grey-900 . green-500 체크 . 2.4s
```

---

### 9.2 섹션별 설계 명세

| # | 섹션 | 높이 | 주요 설계 결정 |
|---|------|------|---------------|
| 1 | TopBar | 56 px | `sticky top-0 z-40` . `bg-white/80 backdrop-blur-md` . 좌: 브랜드 로고, 우: 공유 버튼 |
| 2 | 프로필 카드 | auto | `rounded-3xl` 흰색 카드 . 아바타 48px(이니셜 fallback) + 온라인 상태 점(green-500) . 역할 뱃지 chip |
| 3 | 액션 버튼 | 44 px | 2열 `grid-cols-2` . 이메일 복사(클립보드) / 응원하기(hasLiked 토글 . likes +/-1 . localStorage 동기화) |
| 4 | 현황 카드 | auto | `grid-cols-2 gap-3` . 각 카드 `rounded-2xl` . 학습 상태 좌측에 녹색 점 |
| 5 | 링크 리스트 | auto | `isActive=true` + `order` 오름차순 렌더링 . 아이콘 44px `rounded-[14px]` . 클릭시 `clicks+1` 기록 후 새 탭 이동 |
| 6 | 소셜 아이콘 바 | auto | `socials` 객체 중 값이 존재하는 플랫폼만 24px 아이콘으로 자동 노출 |
| 7 | 키워드 칩 | auto | `tags` 배열 -> `rounded-full border` Chip . `flex-wrap gap-2` |
| 8 | 푸터 | auto | `text-center text-[13px] text-grey-500` |
| 9 | BottomCTA | 56 pt | `fixed bottom-0` . `rounded-[16px] bg-blue-500 text-white` . 클릭 시 이메일 클립보드 복사 |
| 10 | TDS Toast | 52 px | `fixed bottom-24` . `bg-grey-900 text-white` . green-500 원형 체크 . 2.4 s 후 자동 dismiss |

---

### 9.3 인터랙션 흐름도

```
방문자 접속 (/@chaeyoon)
      |
      v
localStorage 'my-link-hy-store' 조회
      |
  존재?  --No--> DEFAULT_PROFILE 사용
      |Yes
      v
UserLinkPage 데이터 렌더링
      |
  +---+-------------------------------+
  |                                   |
  v                                   v
[링크 클릭]                     [응원하기 클릭]
  |                                   |
clicks +1 -> localStorage       hasLiked 토글
새 탭으로 이동                   likes +/-1 -> localStorage
                                 TDS Toast 노출 (2.4s)
  v                                   v
[이메일 복사 / 공유 버튼]         [Toast 자동 dismiss]
  |
navigator.clipboard.writeText()
TDS Toast 노출 (2.4s)
```

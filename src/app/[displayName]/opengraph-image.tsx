import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { findUserByDisplayName, getLinksFromFirestore } from "@/lib/firestore";
import { DEFAULT_PROFILE } from "@/lib/storage";
import { getOgFonts } from "@/lib/og-font";

export const alt = "프로필 오픈그래프 이미지";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ displayName: string }>;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * 프로필 이미지를 Satori가 항상 즉각적이고 안정적으로 렌더링할 수 있도록 base64 Data URL로 로드합니다.
 * 로컬 파일 우선 및 외부 URL fetch fallback 전략을 사용합니다.
 */
async function loadAvatarAsBase64(avatarUrl?: string | null): Promise<string | null> {
  const defaultLocalPath = path.join(process.cwd(), "public", "images", "profile-avatar.jpg");

  // 1. 로컬 경로 (/images/...) 이거나 없을 때 로컬 파일 로드
  if (!avatarUrl || avatarUrl.startsWith("/")) {
    const targetPath = avatarUrl
      ? path.join(process.cwd(), "public", avatarUrl.replace(/^\//, ""))
      : defaultLocalPath;
    try {
      if (fs.existsSync(targetPath)) {
        const fileBuffer = await fs.promises.readFile(targetPath);
        return `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
      }
      if (fs.existsSync(defaultLocalPath)) {
        const fileBuffer = await fs.promises.readFile(defaultLocalPath);
        return `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
      }
    } catch (err) {
      console.warn("로컬 아바타 로드 실패:", err);
    }
  }

  // 2. 외부 URL인 경우 fetch 시도
  if (avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(avatarUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        const buf = await res.arrayBuffer();
        return `data:${mimeType};base64,${Buffer.from(buf).toString("base64")}`;
      }
    } catch {
      // 외부 fetch 실패 시 기본 아바타로 대체
    }
  }

  // 3. Fallback: 기본 로컬 아바타
  try {
    if (fs.existsSync(defaultLocalPath)) {
      const fileBuffer = await fs.promises.readFile(defaultLocalPath);
      return `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
    }
  } catch {}

  return null;
}

export default async function Image({ params }: Props) {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName || "").trim();

  // 폰트 로드
  const fonts = await getOgFonts();

  // Firestore 사용자 데이터 및 링크 조회
  let user = null;
  let fetchedLinks: { title: string; subtitle?: string; category?: string }[] = [];

  if (decodedName) {
    try {
      user = await withTimeout(
        findUserByDisplayName(decodedName).catch(() => null),
        1500,
        null
      );
      if (user?.userId) {
        const links = await withTimeout(
          getLinksFromFirestore(user.userId).catch(() => []),
          1200,
          []
        );
        if (links && links.length > 0) {
          fetchedLinks = links.filter((l) => l.isActive !== false);
        }
      }
    } catch {
      // 조회 실패 시 fallback
    }
  }

  const isDefaultMatch =
    !decodedName ||
    decodedName === DEFAULT_PROFILE.displayName ||
    decodedName.replace(/^@/, "").toLowerCase() === DEFAULT_PROFILE.username.toLowerCase();

  const profile = {
    displayName: user?.displayName || (isDefaultMatch ? DEFAULT_PROFILE.displayName : decodedName || "사용자"),
    username: user?.username || (isDefaultMatch ? DEFAULT_PROFILE.username : (decodedName ? decodedName.toLowerCase().replace(/\s+/g, "") : "user")),
    badge: user?.badge || (isDefaultMatch ? DEFAULT_PROFILE.badge : "크리에이터"),
    bio:
      user?.bio ||
      (isDefaultMatch
        ? DEFAULT_PROFILE.bio
        : `${decodedName || "사용자"}님의 공식 마이링크 프로필 공간입니다. 다양한 프로젝트와 소셜 링크를 확인해보세요.`),
    avatarUrl: user?.avatarUrl || (isDefaultMatch ? DEFAULT_PROFILE.avatarUrl : "/images/profile-avatar.jpg"),
    status: isDefaultMatch ? DEFAULT_PROFILE.status : "활발히 활동 중",
    focusArea: isDefaultMatch ? DEFAULT_PROFILE.focusArea : "Maker & Creator",
    likes: user?.likes ?? (isDefaultMatch ? DEFAULT_PROFILE.likes : 42),
    tags: isDefaultMatch ? DEFAULT_PROFILE.tags.slice(0, 4) : ["마이링크", "포트폴리오", "프로필"],
  };

  // 링크 개수 계산 (2. 링크 배지 요구사항)
  const linkCount =
    fetchedLinks.length > 0
      ? fetchedLinks.length
      : isDefaultMatch
      ? DEFAULT_PROFILE.links.length
      : 4;

  const displayLinks =
    fetchedLinks.length > 0
      ? fetchedLinks.slice(0, 2)
      : isDefaultMatch
      ? DEFAULT_PROFILE.links.slice(0, 2)
      : [
          { title: "대표 프로젝트 & 포트폴리오", category: "project" },
          { title: "소셜 미디어 & 블로그", category: "social" },
        ];

  // 1. 프로필 이미지: 통일성 있는 고화질 3D 아바타 로드
  const avatarBase64 = await loadAvatarAsBase64(profile.avatarUrl);
  const firstChar = profile.displayName.charAt(0) || "U";
  const truncatedBio =
    profile.bio.length > 68 ? profile.bio.slice(0, 68) + "..." : profile.bio;

  // 3. 브랜딩: 도메인 URL 표기
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-link.hy";
  const displayUrl = rawSiteUrl.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F2F4F6",
          fontFamily: "Pretendard, sans-serif",
          position: "relative",
        }}
      >
        {/* 토스 블루 앰비언트 글로우 */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            display: "flex",
            background: "radial-gradient(circle, rgba(49, 130, 246, 0.16) 0%, rgba(49, 130, 246, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            display: "flex",
            background: "radial-gradient(circle, rgba(49, 130, 246, 0.12) 0%, rgba(49, 130, 246, 0) 70%)",
          }}
        />

        {/* 메인 프로필 프리뷰 카드 */}
        <div
          style={{
            width: 1080,
            height: 520,
            backgroundColor: "#FFFFFF",
            borderRadius: 36,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "38px 46px",
            boxShadow: "0 24px 50px -12px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)",
            border: "1px solid #E5E8EB",
            position: "relative",
          }}
        >
          {/* [요구사항 3] 상단 브랜딩 바: "마이링크" 로고 + URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* 좌측: 마이링크 로고 & 핸들 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,
                  backgroundColor: "#3182F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(49, 130, 246, 0.35)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#191F28",
                    letterSpacing: "-0.5px",
                  }}
                >
                  마이링크
                </span>
                <span style={{ fontSize: 16, color: "#8B95A1", fontWeight: 500 }}>
                  · @{profile.username}
                </span>
              </div>
            </div>

            {/* 우측: 브랜드 URL 배지 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#F2F4F6",
                padding: "8px 16px",
                borderRadius: 9999,
                border: "1px solid #E5E8EB",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4E5968"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#4E5968" }}>
                {displayUrl}/{profile.username}
              </span>
            </div>
          </div>

          {/* 중앙 영역: 프로필 상세 (좌) + 링크/통계 프리뷰 (우) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 36,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {/* [요구사항 1] 좌측: 유저 프로필 정보 (이름, 둥근 원형 프로필 이미지, 소개글) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              {/* 프로필 이미지 (둥근 원형) + 이름 & 뱃지 영역 */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                {/* 1. 프로필 이미지: 둥근 원형 (고화질 통일성 아바타) */}
                {avatarBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarBase64}
                    alt={profile.displayName}
                    width="100"
                    height="100"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #FFFFFF",
                      boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12), 0 0 0 2px #E5E8EB",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #3182F6 0%, #1B64DA 100%)",
                      color: "#FFFFFF",
                      fontSize: 40,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 24px rgba(49, 130, 246, 0.35)",
                      border: "3px solid #FFFFFF",
                    }}
                  >
                    {firstChar}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* 이름 & 뱃지 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        fontSize: 34,
                        fontWeight: 700,
                        color: "#191F28",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {profile.displayName}
                    </span>
                    {profile.badge && (
                      <span
                        style={{
                          backgroundColor: "#E8F3FF",
                          color: "#3182F6",
                          padding: "5px 12px",
                          borderRadius: 9999,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {profile.badge}
                      </span>
                    )}
                  </div>

                  {/* [요구사항 2] 링크 배지: "N개의 링크" 표시 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span
                      style={{
                        fontSize: 16,
                        color: "#8B95A1",
                        fontWeight: 500,
                      }}
                    >
                      @{profile.username}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        backgroundColor: "#E8F3FF",
                        padding: "3px 10px",
                        borderRadius: 9999,
                        border: "1px solid #CBE3FF",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3182F6"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#3182F6" }}>
                        {linkCount}개의 링크
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상태 칩 (Status pill) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  gap: 8,
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  padding: "6px 14px",
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    display: "flex",
                    backgroundColor: "#10B981",
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333D4B" }}>
                  {profile.status}
                </span>
                {profile.focusArea && (
                  <span style={{ fontSize: 13, color: "#8B95A1" }}>
                    · {profile.focusArea}
                  </span>
                )}
              </div>

              {/* 1. 소개글 (Bio) */}
              <p
                style={{
                  fontSize: 17,
                  color: "#4E5968",
                  lineHeight: 1.45,
                  margin: 0,
                  marginBottom: 14,
                  maxWidth: 510,
                  fontWeight: 400,
                }}
              >
                {truncatedBio}
              </p>

              {/* 태그 칩스 */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {profile.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      backgroundColor: "#F2F4F6",
                      color: "#4E5968",
                      padding: "6px 12px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 링크 & 통계 프리뷰 카드 */}
            <div
              style={{
                width: 380,
                backgroundColor: "#F9FAFB",
                borderRadius: 24,
                padding: "22px",
                border: "1px solid #E5E8EB",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* 통계 바: [요구사항 2] "N개의 링크" 강조 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 10,
                  borderBottom: "1px solid #E5E8EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "#8B95A1", fontWeight: 500 }}>
                    총 등록
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "#E8F3FF",
                      padding: "3px 10px",
                      borderRadius: 9999,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#3182F6" }}>
                      {linkCount}개의 링크
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "#8B95A1", fontWeight: 500 }}>
                    응원 하트
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#E11D48" }}>
                    ♥ {profile.likes}
                  </span>
                </div>
              </div>

              {/* 링크 미니어처들 */}
              {displayLinks.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#FFFFFF",
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid #E5E8EB",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: "#E8F3FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3182F6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#191F28",
                      }}
                    >
                      {item.title.length > 18 ? item.title.slice(0, 18) + "..." : item.title}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, color: "#8B95A1" }}>↗</span>
                </div>
              ))}

              {/* 하단 유도 버튼 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#E8F3FF",
                  color: "#3182F6",
                  padding: "10px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                마이링크에서 {linkCount}개의 링크 전체 보기
              </div>
            </div>
          </div>

          {/* [요구사항 3] 하단 푸터 바: "마이링크" 브랜딩 + URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #E5E8EB",
              paddingTop: 16,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#8B95A1", fontWeight: 500 }}>
                {profile.displayName}님의 공식 마이링크
              </span>
              <span style={{ fontSize: 13, color: "#D1D6DB" }}>•</span>
              <span style={{ fontSize: 13, color: "#3182F6", fontWeight: 600 }}>
                https://{displayUrl}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: "#3182F6",
              }}
            >
              <span>프로필 방문하기</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}

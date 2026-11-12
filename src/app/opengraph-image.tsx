import { ImageResponse } from "next/og";
import { getOgFonts } from "@/lib/og-font";

export const alt = "마이링크 (MyLink) - 나만의 프로필 및 링크 모음";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fonts = await getOgFonts();

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
        {/* 은은한 배경 그라디언트 오브 */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(49, 130, 246, 0.15) 0%, rgba(49, 130, 246, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(49, 130, 246, 0.12) 0%, rgba(49, 130, 246, 0) 70%)",
          }}
        />

        {/* 메인 플로팅 화이트 카드 */}
        <div
          style={{
            width: 1080,
            height: 520,
            backgroundColor: "#FFFFFF",
            borderRadius: 36,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 50px",
            boxShadow: "0 20px 48px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)",
            border: "1px solid #E5E8EB",
            position: "relative",
          }}
        >
          {/* 상단 헤더: 로고 & 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* 로고 영역 */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  backgroundColor: "#3182F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(49, 130, 246, 0.35)",
                }}
              >
                {/* 체인 링크 SVG */}
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.4"
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
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#191F28",
                    letterSpacing: "-0.5px",
                  }}
                >
                  마이링크
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#8B95A1",
                    letterSpacing: "-0.3px",
                  }}
                >
                  MyLink
                </span>
              </div>
            </div>

            {/* TDS 태그 뱃지 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#E8F3FF",
                padding: "8px 18px",
                borderRadius: 9999,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#3182F6",
                }}
              />
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#3182F6",
                }}
              >
                Personal Link-in-bio
              </span>
            </div>
          </div>

          {/* 중앙 본문 영역 (2컬럼) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 40,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            {/* 좌측 카피 & 기능 칩 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: "#191F28",
                  lineHeight: 1.28,
                  letterSpacing: "-1px",
                  margin: 0,
                  marginBottom: 14,
                }}
              >
                나만의 링크와 프로필을
                <br />
                가장 직관적이고 아름답게
              </h1>
              <p
                style={{
                  fontSize: 21,
                  color: "#4E5968",
                  lineHeight: 1.45,
                  margin: 0,
                  marginBottom: 24,
                  fontWeight: 400,
                }}
              >
                토스 감성의 미니멀 디자인으로 포트폴리오, 소셜 링크,
                <br />
                프로젝트를 한눈에 보여주는 퍼스널 브랜딩 페이지
              </p>

              {/* 기능 칩 목록 */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 12,
                    backgroundColor: "#F2F4F6",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#333D4B",
                  }}
                >
                  ⚡ 초간단 원클릭 관리
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 12,
                    backgroundColor: "#F2F4F6",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#333D4B",
                  }}
                >
                  📊 실시간 클릭 수 통계
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 12,
                    backgroundColor: "#F2F4F6",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#333D4B",
                  }}
                >
                  ✨ 반응형 토스 UI
                </div>
              </div>
            </div>

            {/* 우측 프리뷰 미니어처 카드 */}
            <div
              style={{
                width: 320,
                backgroundColor: "#F9FAFB",
                borderRadius: 24,
                padding: "22px 20px",
                border: "1px solid #E5E8EB",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 10px 24px -6px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* 미니 프로필 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#3182F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  채
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#191F28" }}>
                    임채윤 (Chaeyoon)
                  </span>
                  <span style={{ fontSize: 12, color: "#8B95A1" }}>@chaeyoon · 대학생 메이커</span>
                </div>
              </div>

              {/* 미니 링크 버튼 1 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#FFFFFF",
                  padding: "11px 14px",
                  borderRadius: 14,
                  border: "1px solid #E5E8EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#191F28" }}>
                    GitHub 저장소
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#3182F6", fontWeight: 600 }}>바로가기 →</span>
              </div>

              {/* 미니 링크 버튼 2 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#FFFFFF",
                  padding: "11px 14px",
                  borderRadius: 14,
                  border: "1px solid #E5E8EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#191F28" }}>
                    기술 블로그 & 포트폴리오
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#3182F6", fontWeight: 600 }}>바로가기 →</span>
              </div>
            </div>
          </div>

          {/* 하단 푸터 바 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #E5E8EB",
              paddingTop: 18,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, color: "#8B95A1", fontWeight: 500 }}>
                my-link-hy · Toss Design System Architecture
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#3182F6",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(49, 130, 246, 0.3)",
              }}
            >
              <span>나만의 마이링크 만들기</span>
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

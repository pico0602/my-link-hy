import type { Metadata } from "next";
import { LandingClient } from "./LandingClient";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 나만의 감성 링크와 프로필을 하나로",
  description:
    "흩어져 있는 SNS, 포트폴리오, 깃허브, 블로그 링크를 하나의 프로필 링크로 완성하세요. 실시간 방문자 클릭 통계와 세련된 미니멀 디자인을 무료로 제공합니다.",
  keywords: [
    "마이링크",
    "MyLink",
    "링크트리",
    "인스타 링크",
    "프로필 링크",
    "멀티링크",
    "바이오링크",
    "포트폴리오",
    "링크 모음",
    "방문자 통계",
    "한양대학교",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "마이링크 (MyLink) | 나만의 감성 링크와 프로필을 하나로",
    description:
      "흩어져 있는 SNS, 포트폴리오, 깃허브, 블로그 링크를 하나의 프로필 링크로 완성하세요. 실시간 방문자 클릭 통계와 세련된 미니멀 디자인을 무료로 제공합니다.",
    url: siteUrl,
    type: "website",
    locale: "ko_KR",
    siteName: "마이링크",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 (MyLink) | 나만의 감성 링크와 프로필을 하나로",
    description:
      "흩어져 있는 SNS, 포트폴리오, 깃허브, 블로그 링크를 하나의 프로필 링크로 완성하세요. 실시간 방문자 클릭 통계와 세련된 미니멀 디자인을 무료로 제공합니다.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "마이링크 (MyLink)",
    url: siteUrl,
    description: "흩어져 있는 나의 모든 링크를 하나의 고유한 프로필 주소로 연결하는 올인원 링크 서비스",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/{displayName}`,
      "query-input": "required name=displayName",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingClient />
    </>
  );
}

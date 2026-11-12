import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findUserByDisplayName, getLinksFromFirestore } from "@/lib/firestore";
import { DEFAULT_PROFILE } from "@/lib/storage";
import { PublicProfileView } from "./PublicProfileView";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName || "").trim();

  if (!decodedName) {
    return {
      title: "사용자를 찾을 수 없습니다",
      description: "요청하신 프로필을 찾을 수 없습니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const user = await findUserByDisplayName(decodedName).catch(() => null);

  if (!user || !user.username) {
    return {
      title: "사용자를 찾을 수 없습니다",
      description: "요청하신 프로필을 찾을 수 없습니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${user.displayName} (@${user.username})`;
  const description =
    user.bio?.trim() || `${user.displayName}님의 공식 프로필 및 링크 모음입니다. 마이링크에서 확인해보세요.`;
  const canonicalUrl = `/${encodeURIComponent(decodedName)}`;

  return {
    title,
    description,
    keywords: [
      user.displayName,
      user.username,
      "마이링크",
      "MyLink",
      "프로필 링크",
      "링크트리",
      ...(user.badge ? [user.badge] : []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: `${title} | 마이링크`,
      description,
      url: canonicalUrl,
      type: "profile",
      username: user.username,
      siteName: "마이링크",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 마이링크`,
      description,
    },
  };
}

export default async function DisplayNamePage({ params }: PageProps) {
  const { displayName } = await params;
  const decodedName = decodeURIComponent(displayName || "").trim();

  // 1. 유효하지 않은 이름인 경우 404
  if (!decodedName) {
    notFound();
  }

  // 2. displayName으로 유저 검색
  const user = await findUserByDisplayName(decodedName).catch((err) => {
    console.error("findUserByDisplayName error:", err);
    return null;
  });

  // 3. username 없으면 404 페이지
  if (!user || !user.username) {
    notFound();
  }

  // 4. 링크: users/{userId}/links 조회
  let links = await getLinksFromFirestore(user.userId).catch((err) => {
    console.error("getLinksFromFirestore error:", err);
    return [];
  });

  // 기본 데모 계정인 경우 fallback 링크 적용
  if (links.length === 0 && user.userId === "anonymous") {
    links = DEFAULT_PROFILE.links;
  }

  // 5. Schema.org ProfilePage 구조화 데이터
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.displayName,
      alternateName: user.username,
      description: user.bio || undefined,
      image: user.avatarUrl || undefined,
      url: `${siteUrl}/${encodeURIComponent(user.displayName)}`,
      sameAs: links.map((link) => link.url).filter(Boolean),
    },
  };

  // 6. 상단: 프로필 카드 (이름, 소개글) / 하단: 링크 목록 (클릭 시 탭)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <PublicProfileView user={user} initialLinks={links} />
    </>
  );
}

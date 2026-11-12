import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 링크 관리",
  description: "내 프로필과 링크를 자유롭게 편집하고 실시간으로 관리하는 마이링크 대시보드입니다.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "내 링크 관리 | 마이링크",
    description: "내 프로필과 링크를 자유롭게 편집하고 실시간으로 관리하세요.",
  },
};

export default function MyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

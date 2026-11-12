import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "링크 클릭 통계 및 분석",
  description: "등록된 링크의 실시간 클릭 수와 인기 순위, 방문자 유입 흐름을 분석할 수 있는 대시보드입니다.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "링크 클릭 통계 및 분석 | 마이링크",
    description: "등록된 링크의 실시간 클릭 수와 인기 순위를 한눈에 확인하세요.",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  ArrowLeft,
  MousePointerClick,
  TrendingUp,
  Link2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LinkItem } from "@/types/link";
import {
  subscribeFirestoreLinks,
  getUserProfileFromFirestore,
  UserProfileData,
} from "@/lib/firestore";
import { TopBar } from "@/components/profile/TopBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const barChartConfig = {
  clicks: {
    label: "클릭 수",
    color: "#3182F6",
  },
} satisfies ChartConfig;

const categoryChartConfig = {
  project: {
    label: "프로젝트",
    color: "#3182F6",
  },
  blog: {
    label: "블로그",
    color: "#00B460",
  },
  social: {
    label: "소셜",
    color: "#F67731",
  },
  contact: {
    label: "연락처",
    color: "#8B5CF6",
  },
  etc: {
    label: "기타",
    color: "#8B95A1",
  },
} satisfies ChartConfig;

const CATEGORY_NAMES: Record<string, string> = {
  project: "프로젝트",
  blog: "블로그",
  social: "소셜",
  contact: "연락처",
  all: "전체",
};

const CATEGORY_COLORS: Record<string, string> = {
  project: "#3182F6", // Toss Blue
  blog: "#00B460",    // Mint Green
  social: "#F67731",  // Warm Orange
  contact: "#8B5CF6", // Purple
  etc: "#8B95A1",     // Slate Grey
};

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. 비로그인 시 즉시 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // 2. 로그인된 사용자의 실시간 링크 및 프로필 데이터 로드
  useEffect(() => {
    if (!user) return;

    setIsLoadingData(true);

    // 프로필 정보 조회
    getUserProfileFromFirestore(user.uid)
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => {
        console.error("통계 페이지 프로필 조회 에러:", err);
      });

    // users/{user.uid}/links 컬렉션 실시간 구독
    const unsubscribe = subscribeFirestoreLinks(user.uid, (firestoreLinks) => {
      setLinks(firestoreLinks);
      setIsLoadingData(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // 통계 연산
  const {
    totalClicks,
    totalLinks,
    activeLinks,
    avgClicks,
    sortedLinks,
    chartData,
    categoryChartData,
    topLink,
  } = useMemo(() => {
    const total = links.reduce(
      (sum, item) => sum + (item.clickCount ?? item.clicks ?? 0),
      0
    );
    const count = links.length;
    const active = links.filter((item) => item.isActive).length;
    const avg = count > 0 ? (total / count).toFixed(1) : "0";

    const sorted = [...links].sort((a, b) => {
      const aClicks = a.clickCount ?? a.clicks ?? 0;
      const bClicks = b.clickCount ?? b.clicks ?? 0;
      return bClicks - aClicks;
    });

    // 상위 8개 링크 차트 데이터
    const cData = sorted.slice(0, 8).map((link) => {
      const name =
        link.title.length > 10 ? `${link.title.slice(0, 10)}…` : link.title;
      return {
        id: link.id,
        name,
        fullName: link.title,
        clicks: link.clickCount ?? link.clicks ?? 0,
        category: link.category || "project",
      };
    });

    // 카테고리별 클릭 분포
    const catMap: Record<string, number> = {};
    links.forEach((l) => {
      const cat = l.category || "etc";
      const clicks = l.clickCount ?? l.clicks ?? 0;
      catMap[cat] = (catMap[cat] || 0) + clicks;
    });

    const catData = Object.entries(catMap)
      .filter(([, clicks]) => clicks > 0)
      .map(([cat, clicks]) => ({
        name: CATEGORY_NAMES[cat] || "기타",
        categoryKey: cat,
        clicks,
        fill: CATEGORY_COLORS[cat] || CATEGORY_COLORS.etc,
      }));

    return {
      totalClicks: total,
      totalLinks: count,
      activeLinks: active,
      avgClicks: avg,
      sortedLinks: sorted,
      chartData: cData,
      categoryChartData: catData,
      topLink: sorted.length > 0 && (sorted[0].clickCount ?? sorted[0].clicks ?? 0) > 0 ? sorted[0] : null,
    };
  }, [links]);

  // 로딩 상태 (인증 중이거나 데이터 로드 중)
  if (authLoading || (!user && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F6] px-4">
        <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white border border-[#E5E8EB]/70 shadow-sm max-w-sm w-full text-center">
          <Loader2 className="w-8 h-8 text-[#3182F6] animate-spin" />
          <h2 className="text-[17px] font-bold text-[#191F28]">
            로그인 상태를 확인하는 중입니다
          </h2>
          <p className="text-[13px] text-[#8B95A1]">
            잠시만 기다려주세요. 비로그인 시 메인 페이지로 이동합니다.
          </p>
        </div>
      </div>
    );
  }

  // 비로그인 방어 화면 (리다이렉트 전 찰나)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F6] px-4">
        <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white border border-[#E5E8EB]/70 shadow-sm max-w-sm w-full text-center">
          <ShieldAlert className="w-10 h-10 text-[#F04452]" />
          <h2 className="text-[17px] font-bold text-[#191F28]">
            로그인이 필요한 페이지입니다
          </h2>
          <p className="text-[13px] text-[#8B95A1]">
            통계 페이지는 본인 확인 후 접근 가능합니다. 메인으로 이동합니다.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#3182F6] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#1B64DA] transition-all"
          >
            메인 페이지로 이동
          </Link>
        </div>
      </div>
    );
  }

  const userDisplayName =
    profile?.displayName || user.displayName || user.email?.split("@")[0] || "사용자";
  const userUsername = profile?.username;
  const publicPageHref = userUsername
    ? `/${encodeURIComponent(userUsername)}`
    : `/${encodeURIComponent(userDisplayName)}`;

  return (
    <div className="relative min-h-screen w-full bg-[#F2F4F6] text-[#191F28] pb-24">
      {/* 1. 통일된 상단 탑바 (내 링크 / 통계 페이지 탭 및 사용자 메뉴) */}
      <TopBar
        username={userUsername}
        displayName={userDisplayName}
        userPageHref={publicPageHref}
        onLogoutSuccess={() => {
          router.replace("/");
        }}
        onShare={() => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.origin + publicPageHref);
            alert("공개 프로필 주소가 복사되었어요!");
          }
        }}
      />

      {/* 2. 메인 대시보드 컨테이너 */}
      <main className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-5 space-y-5">
        {/* 상단 브레드크럼 및 뒤로가기 */}
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7684] hover:text-[#191F28] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>내 링크 목록으로</span>
          </Link>

          <span className="text-[12px] text-[#8B95A1] font-medium">
            마이링크 &gt; 통계 대시보드
          </span>
        </div>
        {/* 상단 프로필 환영 배너 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 rounded-3xl bg-white border border-[#E5E8EB]/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] sm:text-[20px] font-bold text-[#191F28]">
                {userDisplayName}님의 실시간 성과 지표
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                <Sparkles className="w-3 h-3" />
                실시간
              </span>
            </div>
            <p className="text-[13px] text-[#8B95A1] mt-1">
              등록된 모든 링크의 클릭 수와 방문자 유입 통계를 분석합니다.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-[#4E5968] bg-[#F9FAFB] px-3 py-1.5 rounded-xl border border-[#F2F4F6] self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-[#00B460] animate-pulse" />
            <span>Firestore 자동 동기화 활성</span>
          </div>
        </div>

        {/* 3. 핵심 지표 카드 그리드 (총 클릭 수 강조) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* 총 클릭 수 (가장 핵심 지표 - Toss Blue 강조) */}
          <div className="col-span-2 sm:col-span-1 rounded-[24px] bg-gradient-to-br from-[#3182F6] to-[#1B64DA] p-5 text-white shadow-[0_4px_16px_rgba(49,130,246,0.25)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white/80">
                총 클릭 수
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
                <MousePointerClick className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-none">
                {totalClicks.toLocaleString()}
                <span className="text-[16px] font-medium ml-1">회</span>
              </div>
              <p className="text-[11px] text-white/70 mt-1.5">
                모든 등록 링크 합산
              </p>
            </div>
          </div>

          {/* 전체 링크 수 */}
          <div className="rounded-[24px] bg-white border border-[#E5E8EB]/70 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#8B95A1]">
                등록된 링크
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F4F6] text-[#4E5968]">
                <Link2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[24px] sm:text-[28px] font-extrabold text-[#191F28] tracking-tight leading-none">
                {totalLinks}
                <span className="text-[14px] font-medium text-[#8B95A1] ml-1">개</span>
              </div>
              <p className="text-[11px] text-[#8B95A1] mt-1.5">
                활성 {activeLinks}개 / 비활성 {totalLinks - activeLinks}개
              </p>
            </div>
          </div>

          {/* 링크당 평균 클릭 수 */}
          <div className="rounded-[24px] bg-white border border-[#E5E8EB]/70 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#8B95A1]">
                평균 클릭 수
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F3FF] text-[#3182F6]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[24px] sm:text-[28px] font-extrabold text-[#191F28] tracking-tight leading-none">
                {avgClicks}
                <span className="text-[14px] font-medium text-[#8B95A1] ml-1">회</span>
              </div>
              <p className="text-[11px] text-[#8B95A1] mt-1.5">
                링크 1개당 평균 유입
              </p>
            </div>
          </div>

          {/* 최다 클릭 링크 */}
          <div className="col-span-1 rounded-[24px] bg-white border border-[#E5E8EB]/70 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#8B95A1]">
                인기 링크 #1
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F8F0] text-[#00B460]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              {topLink ? (
                <>
                  <div className="text-[15px] font-bold text-[#191F28] truncate" title={topLink.title}>
                    {topLink.title}
                  </div>
                  <p className="text-[11px] text-[#00B460] font-semibold mt-1">
                    {(topLink.clickCount ?? topLink.clicks ?? 0).toLocaleString()}회 클릭 달성
                  </p>
                </>
              ) : (
                <>
                  <div className="text-[15px] font-medium text-[#8B95A1]">
                    클릭 기록 없음
                  </div>
                  <p className="text-[11px] text-[#8B95A1] mt-1">
                    링크를 공유해보세요
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 4. shadcn 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 주요 차트: 링크별 클릭 수 BarChart (2열 차지) */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-[17px]">
                  <BarChart3 className="w-4 h-4 text-[#3182F6]" />
                  링크별 클릭 수 비교
                </CardTitle>
                <CardDescription>
                  상위 링크들의 누적 클릭 수 성과를 비교합니다.
                </CardDescription>
              </div>
              <span className="text-[11px] font-semibold text-[#8B95A1] bg-[#F2F4F6] px-2.5 py-1 rounded-full">
                클릭 수 높은 순
              </span>
            </CardHeader>

            <CardContent>
              {chartData.length === 0 || totalClicks === 0 ? (
                <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E5E8EB] rounded-2xl bg-[#F9FAFB]">
                  <BarChart3 className="w-10 h-10 text-[#B0B8C1] mb-2" />
                  <p className="text-[14px] font-semibold text-[#4E5968]">
                    아직 집계된 클릭 데이터가 없어요
                  </p>
                  <p className="text-[12px] text-[#8B95A1] mt-1">
                    내 프로필 링크를 공유하고 방문자를 유치해보세요!
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={barChartConfig}
                  className="h-[280px] w-full"
                >
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 25 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F2F4F6"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#8B95A1"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      angle={-15}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis
                      stroke="#8B95A1"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelKey="fullName"
                          formatter={(value, _name, item) => (
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="text-[#6B7684]">
                                {item.payload.fullName}
                              </span>
                              <span className="font-bold text-[#3182F6]">
                                {Number(value).toLocaleString()}회
                              </span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar
                      dataKey="clicks"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={48}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.id || index}`}
                          fill={index === 0 ? "#3182F6" : "#70A9FF"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* 보조 차트: 카테고리별 클릭 점유율 (1열 차지) */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[17px]">
                <PieChartIcon className="w-4 h-4 text-[#00B460]" />
                카테고리별 비중
              </CardTitle>
              <CardDescription>
                어떤 분야의 링크가 가장 많은 관심을 받았는지 확인하세요.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {categoryChartData.length === 0 ? (
                <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E5E8EB] rounded-2xl bg-[#F9FAFB]">
                  <Layers className="w-10 h-10 text-[#B0B8C1] mb-2" />
                  <p className="text-[13px] font-semibold text-[#4E5968]">
                    카테고리 클릭 데이터 없음
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ChartContainer
                    config={categoryChartConfig}
                    className="h-[180px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => (
                              <div className="flex items-center justify-between gap-3">
                                <span>{name}</span>
                                <span className="font-bold">
                                  {Number(value).toLocaleString()}회
                                </span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Pie
                        data={categoryChartData}
                        dataKey="clicks"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {categoryChartData.map((entry) => (
                          <Cell
                            key={`cat-${entry.categoryKey}`}
                            fill={entry.fill}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  {/* 범례 리스트 */}
                  <div className="w-full mt-2 space-y-1.5">
                    {categoryChartData.map((item) => {
                      const percentage =
                        totalClicks > 0
                          ? Math.round((item.clicks / totalClicks) * 100)
                          : 0;
                      return (
                        <div
                          key={item.categoryKey}
                          className="flex items-center justify-between text-[12px] px-2 py-1 rounded-lg hover:bg-[#F9FAFB]"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="font-medium text-[#4E5968]">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#191F28]">
                              {item.clicks.toLocaleString()}회
                            </span>
                            <span className="text-[11px] text-[#8B95A1] min-w-[32px] text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 5. 전체 링크 상세 클릭 순위 테이블 리스트 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-[17px] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3182F6]" />
                전체 링크 클릭 순위
              </CardTitle>
              <CardDescription>
                등록된 모든 링크의 개별 클릭 수 및 비중 상세 리스트입니다.
              </CardDescription>
            </div>
            <span className="text-[12px] font-bold text-[#3182F6]">
              합계 {totalClicks.toLocaleString()}회
            </span>
          </CardHeader>

          <CardContent>
            {sortedLinks.length === 0 ? (
              <div className="py-12 text-center text-[#8B95A1] text-[13px]">
                등록된 링크가 없습니다. 메인 화면에서 링크를 추가해보세요.
              </div>
            ) : (
              <div className="divide-y divide-[#F2F4F6]">
                {sortedLinks.map((link, idx) => {
                  const clicks = link.clickCount ?? link.clicks ?? 0;
                  const ratio =
                    totalClicks > 0 ? (clicks / totalClicks) * 100 : 0;

                  return (
                    <div
                      key={link.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#F9FAFB] px-2 -mx-2 rounded-xl transition-colors"
                    >
                      {/* 좌측 순위 및 링크 정보 */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            idx === 0
                              ? "bg-[#3182F6] text-white"
                              : idx === 1
                              ? "bg-[#60A5FA] text-white"
                              : idx === 2
                              ? "bg-[#93C5FD] text-[#191F28]"
                              : "bg-[#F2F4F6] text-[#8B95A1]"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[14px] font-bold text-[#191F28] truncate">
                              {link.title}
                            </h4>
                            {link.category && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#F2F4F6] text-[#6B7684]">
                                {CATEGORY_NAMES[link.category] || link.category}
                              </span>
                            )}
                            {!link.isActive && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FEECEE] text-[#F04452]">
                                숨김
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#8B95A1] truncate mt-0.5 font-mono">
                            {link.url}
                          </p>
                        </div>
                      </div>

                      {/* 우측 클릭 수 & 프로그레스 바 */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-9 sm:pl-0">
                        {/* 프로그레스 바 */}
                        <div className="w-24 sm:w-32 bg-[#F2F4F6] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#3182F6] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>

                        <div className="text-right min-w-[70px]">
                          <div className="text-[15px] font-extrabold text-[#191F28] tabular-nums">
                            {clicks.toLocaleString()}
                            <span className="text-[12px] font-normal text-[#8B95A1] ml-0.5">
                              회
                            </span>
                          </div>
                          <div className="text-[11px] text-[#8B95A1] tabular-nums">
                            {ratio.toFixed(1)}%
                          </div>
                        </div>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[#8B95A1] hover:text-[#3182F6] transition-colors"
                          title="새 창에서 열기"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

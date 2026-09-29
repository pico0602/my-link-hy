import { NextRequest, NextResponse } from "next/server";
import dummyData from "@/data/links.json";

// In-memory 데이터 복사본 (Mock 서버 상태 유지용)
let mockDatabase = {
  ...dummyData,
  links: [...dummyData.links],
};

/**
 * GET /api/links
 * 
 * Query Parameters:
 * - category: "all" | "project" | "blog" | "social" | "contact"
 * - sort: "order" | "popular" | "latest"
 * - search: string (title, subtitle 검색)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "order";
  const search = searchParams.get("search")?.toLowerCase().trim();

  let filteredLinks = [...mockDatabase.links];

  // 1. 활성화 상태 필터링
  filteredLinks = filteredLinks.filter((link) => link.isActive);

  // 2. 카테고리 필터링
  if (category && category !== "all") {
    filteredLinks = filteredLinks.filter((link) => link.category === category);
  }

  // 3. 검색어 필터링
  if (search) {
    filteredLinks = filteredLinks.filter(
      (link) =>
        link.title.toLowerCase().includes(search) ||
        link.subtitle.toLowerCase().includes(search) ||
        link.badge?.toLowerCase().includes(search)
    );
  }

  // 4. 정렬
  if (sort === "popular") {
    filteredLinks.sort((a, b) => b.clickCount - a.clickCount);
  } else if (sort === "latest") {
    filteredLinks.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else {
    // 기본 정렬: 고정(isPinned) 우선 -> order 기준
    filteredLinks.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return a.order - b.order;
    });
  }

  return NextResponse.json({
    success: true,
    code: 200,
    message: "링크 목록을 성공적으로 조회했습니다.",
    data: {
      profile: mockDatabase.profile,
      categories: mockDatabase.categories,
      links: filteredLinks,
      totalCount: filteredLinks.length,
    },
    meta: {
      timestamp: new Date().toISOString(),
      filters: {
        category: category || "all",
        sort,
        search: search || null,
      },
    },
  });
}

/**
 * POST /api/links
 * 링크 클릭 수 증가 (Mock API)
 * Request Body: { linkId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId } = body;

    if (!linkId) {
      return NextResponse.json(
        {
          success: false,
          code: 400,
          message: "linkId 필드가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const linkIndex = mockDatabase.links.findIndex((l) => l.id === linkId);
    if (linkIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          code: 404,
          message: "해당 ID의 링크를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 클릭수 1 증가
    mockDatabase.links[linkIndex].clickCount += 1;

    return NextResponse.json({
      success: true,
      code: 200,
      message: "링크 클릭수가 반영되었습니다.",
      data: {
        link: mockDatabase.links[linkIndex],
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: 500,
        message: "요청 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

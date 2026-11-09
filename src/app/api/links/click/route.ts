import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { USERS_COLLECTION, LINKS_SUBCOLLECTION, ANONYMOUS_DOC_ID } from "@/lib/firestore";

/**
 * POST /api/links/click
 * 
 * 링크 클릭 시 클릭 카운트를 서버에서 처리합니다.
 * - users/{userId}/links/{linkId} 문서의 clickCount 필드를 increment(1)로 원자적 증가
 * - 로그인 확인 (userId 검증)
 * - 권한 오류(Missing or insufficient permissions) 발생 시 원인 분석 및 안전한 에러 반환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, linkId } = body;

    // 1. 에러 처리: 로그인 확인 (userId가 없거나 익명인 경우)
    if (
      !userId ||
      typeof userId !== "string" ||
      userId.trim() === "" ||
      userId === ANONYMOUS_DOC_ID
    ) {
      console.error("[API /api/links/click] 로그인 확인 실패: userId 누락 또는 익명 사용자", {
        userId,
        linkId,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "로그인이 필요하거나 유효하지 않은 사용자 계정입니다.",
        },
        { status: 401 }
      );
    }

    if (!linkId || typeof linkId !== "string" || linkId.trim() === "") {
      console.error("[API /api/links/click] 유효하지 않은 linkId", { linkId });
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request",
          message: "linkId 필드가 올바르지 않습니다.",
        },
        { status: 400 }
      );
    }

    // 2. Firestore에 클릭 카운트 원자적 저장 (동시 클릭에도 정확하게 카운트)
    const linkDocRef = doc(db, USERS_COLLECTION, userId.trim(), LINKS_SUBCOLLECTION, linkId.trim());

    await updateDoc(linkDocRef, {
      clickCount: increment(1),
      clicks: increment(1), // 하위 호환성 유지
      lastClickedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "클릭 카운트가 성공적으로 반영되었습니다.",
      data: {
        userId,
        linkId,
      },
    });
  } catch (error: any) {
    // 3. 에러 처리: 권한 부족(Missing or insufficient permissions) 등
    const isPermissionError = error?.code === "permission-denied" || error?.message?.includes("permissions");
    if (isPermissionError) {
      console.warn(
        "[API /api/links/click] Firestore 권한 부족: 서버 세션에는 Firebase Auth 정보가 없으므로 클라이언트 인증 SDK(recordLinkClick)를 통해 저장해야 합니다."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Permission Denied",
          message: "Firestore 보안 규칙에 의해 서버 직접 쓰기 권한이 제한되었습니다. 클라이언트 인증을 통해 기록하세요.",
        },
        { status: 403 }
      );
    }

    console.error("[API Error] Firestore 클릭 카운트 저장 처리 중 예외 발생:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "서버에서 클릭 카운트를 저장하는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}


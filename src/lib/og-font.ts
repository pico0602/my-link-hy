/**
 * Next.js ImageResponse (Satori) 용 Pretendard 폰트 로더
 * 한글 및 영문 텍스트가 깨지지 않도록 Pretendard 폰트 바이너리를 로드합니다.
 */

let fontCache: { bold: ArrayBuffer; regular: ArrayBuffer } | null = null;

async function fetchWithTimeout(url: string, ms = 3000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getOgFonts() {
  if (fontCache) {
    return [
      {
        name: "Pretendard",
        data: fontCache.bold,
        style: "normal" as const,
        weight: 700 as const,
      },
      {
        name: "Pretendard",
        data: fontCache.regular,
        style: "normal" as const,
        weight: 400 as const,
      },
    ];
  }

  try {
    const [boldRes, regularRes] = await Promise.all([
      fetchWithTimeout(
        "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff",
        3000
      ),
      fetchWithTimeout(
        "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff",
        3000
      ),
    ]);

    if (!boldRes.ok || !regularRes.ok) {
      console.warn("일부 Pretendard 폰트 로드 실패, 기본 폰트로 대체됩니다.");
      return [];
    }

    const [bold, regular] = await Promise.all([
      boldRes.arrayBuffer(),
      regularRes.arrayBuffer(),
    ]);

    fontCache = { bold, regular };

    return [
      {
        name: "Pretendard",
        data: bold,
        style: "normal" as const,
        weight: 700 as const,
      },
      {
        name: "Pretendard",
        data: regular,
        style: "normal" as const,
        weight: 400 as const,
      },
    ];
  } catch (error) {
    console.warn("OG 폰트 로딩 타임아웃 또는 오류 (기본 폰트로 계속 진행):", error);
    return [];
  }
}

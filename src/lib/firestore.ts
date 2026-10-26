import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkItem } from "@/types/link";

// Firestore 경로: users/anonymous/links
export const USERS_COLLECTION = "users";
export const ANONYMOUS_DOC_ID = "anonymous";
export const LINKS_SUBCOLLECTION = "links";

/**
 * users/anonymous/links 컬렉션 레퍼런스를 반환합니다.
 */
export function getAnonymousLinksCollection() {
  return collection(db, USERS_COLLECTION, ANONYMOUS_DOC_ID, LINKS_SUBCOLLECTION);
}

/**
 * users/anonymous/links/{id} 문서 레퍼런스를 반환합니다.
 */
export function getAnonymousLinkDoc(id: string) {
  return doc(db, USERS_COLLECTION, ANONYMOUS_DOC_ID, LINKS_SUBCOLLECTION, id);
}

export interface AddLinkInput {
  title: string;
  url: string;
  subtitle?: string;
  category?: "project" | "blog" | "social" | "contact";
  badge?: string;
  badgeColor?: string;
  iconType?: string;
}

export type UpdateLinkInput = Partial<AddLinkInput>;

/**
 * URL 프로토콜 보정 (http, https, mailto 등이 없으면 https:// 추가)
 */
export function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("mailto:") &&
    !trimmed.startsWith("tel:")
  ) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * 새 링크를 Firestore의 `users/anonymous/links`에 저장합니다.
 */
export async function addLinkToFirestore(data: AddLinkInput): Promise<LinkItem> {
  const linksCol = getAnonymousLinksCollection();
  const formattedUrl = formatUrl(data.url);

  // Firestore는 undefined 필드를 허용하지 않으므로 값 정제
  const docData: Record<string, any> = {
    title: data.title.trim(),
    url: formattedUrl,
    category: data.category || "project",
    iconType: data.iconType || "custom",
    isPinned: false,
    isActive: true,
    order: 0,
    clicks: 0,
    clickCount: 0,
    createdAt: new Date().toISOString(),
  };

  if (data.subtitle && data.subtitle.trim().length > 0) {
    docData.subtitle = data.subtitle.trim();
  }

  if (data.badge && data.badge.trim().length > 0) {
    docData.badge = data.badge.trim();
    docData.badgeColor =
      data.badgeColor ||
      (data.badge === "신규"
        ? "#00B460"
        : data.badge === "대표"
        ? "#3182F6"
        : "#333D4B");
  }

  const docRef = await addDoc(linksCol, docData);

  return {
    id: docRef.id,
    ...(docData as Omit<LinkItem, "id">),
  };
}

/**
 * Firestore의 `users/anonymous/links/{id}` 문서를 수정합니다.
 */
export async function updateLinkInFirestore(
  id: string,
  data: UpdateLinkInput
): Promise<void> {
  const docRef = getAnonymousLinkDoc(id);
  const updateData: Record<string, any> = {};

  if (data.title !== undefined) {
    updateData.title = data.title.trim();
  }
  if (data.url !== undefined) {
    updateData.url = formatUrl(data.url);
  }
  if (data.subtitle !== undefined) {
    const trimmed = data.subtitle.trim();
    updateData.subtitle = trimmed.length > 0 ? trimmed : deleteField();
  }
  if (data.category !== undefined) {
    updateData.category = data.category;
  }
  if (data.badge !== undefined) {
    const trimmed = data.badge.trim();
    if (trimmed.length > 0) {
      updateData.badge = trimmed;
      updateData.badgeColor =
        data.badgeColor ||
        (trimmed === "신규"
          ? "#00B460"
          : trimmed === "대표"
          ? "#3182F6"
          : "#333D4B");
    } else {
      updateData.badge = deleteField();
      updateData.badgeColor = deleteField();
    }
  }
  if (data.iconType !== undefined) {
    updateData.iconType = data.iconType;
  }

  updateData.updatedAt = new Date().toISOString();

  await updateDoc(docRef, updateData);
}

/**
 * Firestore의 `users/anonymous/links/{id}` 문서를 삭제합니다.
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const docRef = getAnonymousLinkDoc(id);
  await deleteDoc(docRef);
}

/**
 * Firestore 문서를 안전하게 LinkItem 형태로 변환합니다.
 * Timestamp 객체, 문자열, 날짜 등을 표준 ISO 문자열로 변환합니다.
 */
export function parseFirestoreLinkDoc(docSnap: any): LinkItem {
  const data = docSnap.data() || {};
  let createdAt = new Date().toISOString();

  if (data.createdAt) {
    if (typeof data.createdAt === "string") {
      createdAt = data.createdAt;
    } else if (typeof data.createdAt.toDate === "function") {
      createdAt = data.createdAt.toDate().toISOString();
    } else if (data.createdAt.seconds !== undefined) {
      createdAt = new Date(data.createdAt.seconds * 1000).toISOString();
    } else if (data.createdAt instanceof Date) {
      createdAt = data.createdAt.toISOString();
    }
  }

  return {
    id: docSnap.id,
    title: data.title || "",
    url: data.url || "",
    subtitle: data.subtitle,
    category: data.category || "project",
    badge: data.badge,
    badgeColor: data.badgeColor,
    iconType: data.iconType || "custom",
    isPinned: data.isPinned ?? false,
    isActive: data.isActive ?? true,
    order: data.order ?? 0,
    clicks: data.clicks ?? data.clickCount ?? 0,
    clickCount: data.clickCount ?? data.clicks ?? 0,
    createdAt,
  };
}

/**
 * createdAt 기준 최신순(내림차순) 정렬 비교 함수
 */
export function sortByCreatedAtDesc(a: LinkItem, b: LinkItem): number {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return bTime - aTime;
}

/**
 * Firestore의 `users/anonymous/links`에서 링크 목록을 1회 조회합니다.
 * createdAt 기준 최신순 정렬
 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  const linksCol = getAnonymousLinksCollection();
  try {
    const q = query(linksCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map(parseFirestoreLinkDoc);
    return items.sort(sortByCreatedAtDesc);
  } catch (error) {
    console.warn("Firestore getLinks orderBy query failed, fallback to in-memory sort:", error);
    const snapshot = await getDocs(linksCol);
    const items = snapshot.docs.map(parseFirestoreLinkDoc);
    return items.sort(sortByCreatedAtDesc);
  }
}

/**
 * Firestore의 `users/anonymous/links` 실시간 리스너를 구독합니다.
 * 새 링크 추가 시 또는 데이터 변경 시 createdAt 최신순으로 자동 갱신됩니다.
 */
export function subscribeFirestoreLinks(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksCol = getAnonymousLinksCollection();
  let unsubFallback: Unsubscribe | null = null;

  try {
    const q = query(linksCol, orderBy("createdAt", "desc"));
    const unsubPrimary = onSnapshot(
      q,
      (snapshot) => {
        const links: LinkItem[] = snapshot.docs
          .map(parseFirestoreLinkDoc)
          .sort(sortByCreatedAtDesc);
        onUpdate(links);
      },
      (error) => {
        console.warn(
          "Firestore onSnapshot with orderBy failed, fallback to in-memory sorted listener:",
          error
        );
        try {
          unsubFallback = onSnapshot(
            linksCol,
            (snapshot) => {
              const links: LinkItem[] = snapshot.docs
                .map(parseFirestoreLinkDoc)
                .sort(sortByCreatedAtDesc);
              onUpdate(links);
            },
            (fallbackErr) => {
              console.error("Firestore subscribe fallback error:", fallbackErr);
              if (onError) onError(fallbackErr);
            }
          );
        } catch (innerErr) {
          if (onError) onError(innerErr as Error);
        }
      }
    );

    return () => {
      unsubPrimary();
      if (unsubFallback) {
        unsubFallback();
      }
    };
  } catch (err) {
    if (onError) onError(err as Error);
    return () => {};
  }
}


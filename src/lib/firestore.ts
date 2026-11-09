import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkItem } from "@/types/link";

// Firestore 기본 컬렉션 상수
export const USERS_COLLECTION = "users";
export const ANONYMOUS_DOC_ID = "anonymous";
export const LINKS_SUBCOLLECTION = "links";
export const PROFILE_SUBCOLLECTION = "profile";
export const PROFILE_DOC_ID = "profile";
export const USERNAMES_COLLECTION = "usernames";

/**
 * users/{userId}/links 컬렉션 레퍼런스를 반환합니다.
 */
export function getUserLinksCollection(userId: string = ANONYMOUS_DOC_ID) {
  return collection(db, USERS_COLLECTION, userId, LINKS_SUBCOLLECTION);
}

/**
 * users/{userId}/links/{id} 문서 레퍼런스를 반환합니다.
 */
export function getUserLinkDoc(userId: string = ANONYMOUS_DOC_ID, id: string) {
  return doc(db, USERS_COLLECTION, userId, LINKS_SUBCOLLECTION, id);
}

/**
 * 익명 사용자용 호환 함수 (users/anonymous/links)
 */
export function getAnonymousLinksCollection() {
  return getUserLinksCollection(ANONYMOUS_DOC_ID);
}

export function getAnonymousLinkDoc(id: string) {
  return getUserLinkDoc(ANONYMOUS_DOC_ID, id);
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
 * 새 링크를 Firestore의 `users/{userId}/links`에 저장합니다.
 */
export async function addLinkToFirestore(
  userId: string,
  data: AddLinkInput
): Promise<LinkItem> {
  const linksCol = getUserLinksCollection(userId);
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
 * Firestore의 `users/{userId}/links/{id}` 문서를 수정합니다.
 */
export async function updateLinkInFirestore(
  userId: string,
  id: string,
  data: UpdateLinkInput
): Promise<void> {
  const docRef = getUserLinkDoc(userId, id);
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
 * Firestore의 `users/{userId}/links/{id}` 문서를 삭제합니다.
 */
export async function deleteLinkFromFirestore(
  userId: string,
  id: string
): Promise<void> {
  const docRef = getUserLinkDoc(userId, id);
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

  let updatedAt: string | undefined = undefined;
  if (data.updatedAt) {
    if (typeof data.updatedAt === "string") {
      updatedAt = data.updatedAt;
    } else if (typeof data.updatedAt.toDate === "function") {
      updatedAt = data.updatedAt.toDate().toISOString();
    } else if (data.updatedAt.seconds !== undefined) {
      updatedAt = new Date(data.updatedAt.seconds * 1000).toISOString();
    } else if (data.updatedAt instanceof Date) {
      updatedAt = data.updatedAt.toISOString();
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
    updatedAt,
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
 * Firestore의 `users/{userId}/links`에서 링크 목록을 1회 조회합니다.
 * createdAt 기준 최신순 정렬
 */
export async function getLinksFromFirestore(
  userId: string = ANONYMOUS_DOC_ID
): Promise<LinkItem[]> {
  const linksCol = getUserLinksCollection(userId);
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
 * Firestore의 `users/{userId}/links` 실시간 리스너를 구독합니다.
 * 새 링크 추가 시 또는 데이터 변경 시 createdAt 최신순으로 자동 갱신됩니다.
 */
export function subscribeFirestoreLinks(
  userId: string = ANONYMOUS_DOC_ID,
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksCol = getUserLinksCollection(userId);
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

/* =========================================================================
   프로필 (Profile) 관리 함수들
   경로: users/{userId}/profile (서브컬렉션 문서: users/{userId}/profile/profile)
   중복 체크: usernames/{username}
   ========================================================================= */

export interface UserProfileData {
  username: string;
  displayName: string;
  bio: string;
  email?: string;
  avatarUrl?: string;
  badge?: string;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * users/{userId}/profile/profile 문서 레퍼런스를 반환합니다.
 */
export function getUserProfileDoc(userId: string) {
  return doc(db, USERS_COLLECTION, userId, PROFILE_SUBCOLLECTION, PROFILE_DOC_ID);
}

/**
 * users/{userId} 루트 문서 레퍼런스를 반환합니다.
 */
export function getUserDoc(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}

/**
 * usernames/{username} 문서 레퍼런스를 반환합니다 (중복 검사용).
 */
export function getUsernameDoc(username: string) {
  return doc(db, USERNAMES_COLLECTION, username.trim().toLowerCase());
}

/**
 * username 사용 가능 여부 (중복 체크)
 * @param username 확인할 사용자 아이디
 * @param currentUserId 현재 로그인한 사용자의 UID (본인의 기존 아이디인 경우 사용 가능 처리)
 * @returns true면 사용 가능, false면 이미 다른 사람이 사용 중(중복)
 */
export async function checkUsernameAvailable(
  username: string,
  currentUserId?: string
): Promise<boolean> {
  const normalized = username.trim().toLowerCase();
  if (!normalized || normalized.length < 2) {
    return false;
  }

  try {
    // 1. usernames/{username} 인덱스 문서 확인
    const usernameRef = getUsernameDoc(normalized);
    const snap = await getDoc(usernameRef);

    if (snap.exists()) {
      const data = snap.data();
      // 본인이 점유한 username이면 허용
      if (currentUserId && data?.uid === currentUserId) {
        return true;
      }
      return false;
    }

    // 2. 혹시 usernames 컬렉션에 등록되지 않은 기존 users 컬렉션 문서 확인 (폴백 방어)
    const usersCol = collection(db, USERS_COLLECTION);
    const q = query(usersCol, where("username", "==", normalized));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const otherUser = snapshot.docs.find((d) => d.id !== currentUserId);
      if (otherUser) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("username 중복 확인 중 오류:", error);
    // 권한 에러 등으로 쿼리 불가 시 기본적으로 허용하지 않고 재시도 유도
    return false;
  }
}

/**
 * 이메일 주소에서 기본 username을 자동 생성합니다.
 * 예: "chaeyoon.lim@gmail.com" -> "chaeyoon.lim"
 */
export function generateDefaultUsername(email?: string | null): string {
  if (!email) {
    return `user_${Math.random().toString(36).slice(2, 8)}`;
  }

  const prefix = email.split("@")[0] || "";
  // 영문, 숫자, _, -, . 제외한 특수문자 제거
  const sanitized = prefix.replace(/[^a-zA-Z0-9_.-]/g, "").toLowerCase();

  if (sanitized.length >= 2) {
    return sanitized.slice(0, 30);
  }

  return `user_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Firestore에서 사용자의 프로필 정보를 1회 조회합니다.
 * users/{userId}/profile/profile 먼저 확인 후, 없으면 users/{userId} 확인.
 */
export async function getUserProfileFromFirestore(
  userId: string
): Promise<UserProfileData | null> {
  try {
    // 1. users/{userId}/profile/profile 확인
    const profileDocRef = getUserProfileDoc(userId);
    const profileSnap = await getDoc(profileDocRef);

    if (profileSnap.exists()) {
      const data = profileSnap.data();
      return {
        username: data.username || "",
        displayName: data.displayName || "",
        bio: data.bio || "",
        email: data.email,
        avatarUrl: data.avatarUrl,
        badge: data.badge,
        updatedAt: data.updatedAt,
        createdAt: data.createdAt,
      };
    }

    // 2. users/{userId} 루트 문서 확인
    const userDocRef = getUserDoc(userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const uData = userSnap.data();
      const pData = uData.profile || uData;
      if (pData.username || pData.displayName) {
        return {
          username: pData.username || "",
          displayName: pData.displayName || "",
          bio: pData.bio || "",
          email: pData.email || uData.email,
          avatarUrl: pData.avatarUrl || uData.avatarUrl,
          badge: pData.badge || uData.badge,
          updatedAt: pData.updatedAt || uData.updatedAt,
          createdAt: pData.createdAt || uData.createdAt,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Firestore 프로필 조회 실패:", error);
    return null;
  }
}

/**
 * users/{userId}/profile에 프로필 데이터를 저장하고, username 중복 확인 및 인덱싱을 수행합니다.
 */
export async function saveUserProfileToFirestore(
  userId: string,
  data: {
    username: string;
    displayName: string;
    bio: string;
    email?: string;
    avatarUrl?: string;
    badge?: string;
  },
  oldUsername?: string
): Promise<UserProfileData> {
  const trimmedUsername = data.username.trim();
  const trimmedDisplayName = data.displayName.trim();
  const trimmedBio = data.bio ? data.bio.trim() : "";

  // 1. username 중복 체크
  const isAvailable = await checkUsernameAvailable(trimmedUsername, userId);
  if (!isAvailable) {
    throw new Error("이미 사용 중인 사용자 아이디(username)입니다.");
  }

  const now = new Date().toISOString();
  const profileData: UserProfileData = {
    username: trimmedUsername,
    displayName: trimmedDisplayName,
    bio: trimmedBio,
    email: data.email,
    avatarUrl: data.avatarUrl,
    badge: data.badge,
    updatedAt: now,
  };

  // 2. users/{userId}/profile/profile 문서에 저장
  const profileDocRef = getUserProfileDoc(userId);
  await setDoc(
    profileDocRef,
    {
      ...profileData,
      createdAt: now, // 신규 생성 시 유지
    },
    { merge: true }
  );

  // 3. users/{userId} 루트 문서에도 profile 및 기본 필드로 병합 저장
  const userDocRef = getUserDoc(userId);
  await setDoc(
    userDocRef,
    {
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      bio: trimmedBio,
      profile: profileData,
      email: data.email,
      avatarUrl: data.avatarUrl,
      updatedAt: now,
    },
    { merge: true }
  );

  // 4. usernames/{username} 인덱스 문서 등록
  const newUsernameRef = getUsernameDoc(trimmedUsername);
  await setDoc(
    newUsernameRef,
    {
      uid: userId,
      username: trimmedUsername,
      updatedAt: now,
    },
    { merge: true }
  );

  // 5. 만약 기존 username에서 다른 username으로 변경되었다면 이전 인덱스 삭제
  if (
    oldUsername &&
    oldUsername.trim().toLowerCase() !== trimmedUsername.toLowerCase()
  ) {
    try {
      const oldUsernameRef = getUsernameDoc(oldUsername);
      await deleteDoc(oldUsernameRef);
    } catch (delErr) {
      console.warn("이전 username 인덱스 삭제 실패 (무시):", delErr);
    }
  }

  return profileData;
}

/**
 * 로그인 시 사용자의 프로필이 Firestore에 존재하는지 확인하고,
 * 없으면 이메일 앞부분 기반 username과 구글 이름을 기본값으로 자동 생성하여 저장합니다.
 */
export async function ensureUserProfileInitialized(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<UserProfileData> {
  // 1. 기존 저장된 프로필이 있는지 조회
  const existing = await getUserProfileFromFirestore(user.uid);
  if (existing && existing.username) {
    return existing;
  }

  // 2. 없으면 기본값 자동 생성
  let baseUsername = generateDefaultUsername(user.email);
  let finalUsername = baseUsername;

  // 중복 체크 및 충돌 시 유니크한 username 생성
  let isAvail = await checkUsernameAvailable(finalUsername, user.uid);
  let counter = 1;
  while (!isAvail && counter <= 5) {
    finalUsername = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
    isAvail = await checkUsernameAvailable(finalUsername, user.uid);
    counter++;
  }

  const initialProfile: UserProfileData = {
    username: finalUsername,
    displayName:
      user.displayName || (user.email ? user.email.split("@")[0] : "사용자"),
    bio: "안녕하세요, 반가워요! 저만의 링크 공간입니다.",
    email: user.email || undefined,
    avatarUrl: user.photoURL || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveUserProfileToFirestore(user.uid, initialProfile);
    return initialProfile;
  } catch (err) {
    console.error("초기 프로필 생성 실패:", err);
    return initialProfile;
  }
}



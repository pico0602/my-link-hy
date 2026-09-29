export type LinkCategoryType =
  | "all"
  | "project"
  | "blog"
  | "social"
  | "contact";

export interface CategoryItem {
  id: LinkCategoryType;
  name: string;
}

export interface ProfileInfo {
  name: string;
  handle: string;
  role: string;
  bio: string;
  email: string;
  avatarUrl: string;
  status: string;
  focusArea: string;
}

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  category?: "project" | "blog" | "social" | "contact";
  badge?: string;
  badgeColor?: string;
  icon?: string;
  iconType?: "github" | "blog" | "notion" | "instagram" | "custom" | string;
  isPinned?: boolean;
  isActive: boolean;
  order: number;
  clicks?: number;
  clickCount?: number;
  createdAt?: string;
}

export interface DailyAnalytics {
  date: string; // YYYY-MM-DD
  views: number;
  clicks: number;
}

export interface SocialLinks {
  github?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

export interface ThemeSettings {
  presetId: "toss" | "dark" | "pastel" | "neon";
  buttonStyle: "rounded" | "sharp" | "pill";
  primaryColor: string;
}

export interface UserLinkPage {
  username: string;
  displayName: string;
  bio: string;
  badge: string;
  avatarUrl?: string;
  email: string;
  status?: string;
  focusArea?: string;
  likes: number;
  views: number;
  tags: string[];
  socials: SocialLinks;
  theme: ThemeSettings;
  links: LinkItem[];
  analyticsHistory?: DailyAnalytics[];
}

export interface LinksApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    profile: ProfileInfo;
    categories: CategoryItem[];
    links: LinkItem[];
    totalCount: number;
  };
  meta: {
    timestamp: string;
    filters: {
      category: string;
      sort: string;
      search: string | null;
    };
  };
}

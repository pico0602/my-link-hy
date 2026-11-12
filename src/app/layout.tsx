import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "마이링크 (MyLink) | 나만의 프로필 및 링크 모음",
    template: "%s | 마이링크",
  },
  description: "토스 감성의 미니멀 디자인으로 나만의 링크와 프로필을 하나의 공간에서 공유하세요.",
  openGraph: {
    title: "마이링크 (MyLink)",
    description: "토스 감성의 미니멀 디자인으로 나만의 링크와 프로필을 하나의 공간에서 공유하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "마이링크",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 (MyLink)",
    description: "토스 감성의 미니멀 디자인으로 나만의 링크와 프로필을 하나의 공간에서 공유하세요.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F2F4F6] text-[#191F28] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

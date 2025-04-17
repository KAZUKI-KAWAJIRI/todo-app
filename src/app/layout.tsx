import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "タスク管理アプリ | シンプルなTodo",
  description: "タスクを効率的に管理し、期限や優先度を設定して生産性を向上させるシンプルなTodoアプリケーション",
  keywords: ["Todo", "タスク管理", "生産性", "React", "Next.js"],
  authors: [{ name: "タスク管理アプリ開発チーム" }],
  viewport: "width=device-width, initial-scale=1.0",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="ja" 
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "J2ME Web Emulator - Эмулятор Java ME в браузере",
  description: "Запускайте классические Java ME игры и приложения прямо в браузере. Загрузите JAR/JAD файлы и играйте без установки.",
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}

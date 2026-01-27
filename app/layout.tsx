import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "死了么 DieLeMe - 互联网一站式白事服务平台",
  description: "专业的终极关怀服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* AMap API Loader */}
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"
        ></script>
      </head>
      <body className={cn(inter.className, "bg-slate-900 text-zinc-400 min-h-screen antialiased")}>
        {children}
      </body>
    </html>
  );
}

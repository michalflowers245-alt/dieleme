import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dieleme - Global Funeral Services Concierge",
  description: "Professional, transparent, and dignified global funeral services.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-slate-900 text-zinc-400 min-h-screen antialiased")}>
        {children}
      </body>
    </html>
  );
}

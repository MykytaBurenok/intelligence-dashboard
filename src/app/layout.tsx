import "./globals.css";
import { WatchlistProvider } from "@/components/providers/WatchlistProvider";
import ScrollReset from "@/components/layout/ScrollReset";
import ScrollReset from "@/components/layout/ScrollReset";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence Dashboard",
  description: "AI platform for reality shifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="default" suppressHydrationWarning>
      <body>
        <ScrollReset />
        <WatchlistProvider>{children}</WatchlistProvider>
      </body>
    </html>
  );
}

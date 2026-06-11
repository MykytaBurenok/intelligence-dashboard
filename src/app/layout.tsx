import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}

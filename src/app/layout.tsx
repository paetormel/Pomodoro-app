import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../shared/components/layout/providers";
import LayoutContent from "../shared/components/layout/layoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FocusFlow | Deep Work Dashboard",
  description: "Stay focused with Pomodoro and Spotify vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {/* Gagamit tayo ng hiwalay na component para sa logic ng AppShell */}
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
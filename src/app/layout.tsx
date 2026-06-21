import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/src/shared/components/layout/providers";

export const metadata: Metadata = {
  title: "Yanidoro",
  description: "Stay focused with Pomodoro and Spotify vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

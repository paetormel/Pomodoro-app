import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../shared/components/layout/providers";
import LayoutContent from "../shared/components/layout/layoutContent";

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
        <Providers>
          {/* Gagamit tayo ng hiwalay na component para sa logic ng AppShell */}
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}

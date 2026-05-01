import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jothish Gandham — Analyst & Builder",
  description:
    "Security-focused portfolio of Jothish Gandham, showcasing analytical systems, technical skills, and interactive projects.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body 
        className="min-h-full flex flex-col bg-black text-zinc-200 selection:bg-cyan-500/30 overflow-x-hidden"
      >
        {/* Hardware Accelerated Wrapper for Native App Speed */}
        <div id="app-root" className="flex-1 flex flex-col relative w-full pb-safe">
          {children}
        </div>

        {/* 
            FIX: Use a standard style tag for Server Components. 
            This provides the same 'native app' feel without the styled-jsx error.
        */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            scrollbar-gutter: stable;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: none;
          }
          
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
          }

          .transition-fast {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}} />
      </body>
    </html>
  );
}
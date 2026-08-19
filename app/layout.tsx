import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeInit from "@/components/ThemeInit";
import Navbar from "@/components/ui/Navbar";
import AnalyticsTracker from "@/components/AnalyticsTracker";

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
  metadataBase: new URL('https://www.webjothishanalyst.site'),
  title: "Jothish Gandham — Cybersecurity Analyst & Detection Engineer",
  description: "Cybersecurity portfolio of Jothish Gandham (Gandham Jothish Guru Karthikeya Reddy). Showcasing expertise in SOC Operations, Threat Detection, Incident Response, SIEM (Splunk, Microsoft Sentinel, Wazuh), and Security Automation.",
  keywords: [
    "Jothish Gandham", "Gandham Jothish", "Gandham Jothish Guru Karthikeya Reddy", "Cybersecurity Analyst", "SOC Analyst",
    "Blue Team", "Detection Engineer", "Security Research", "Threat Detection", "Threat Hunting",
    "SIEM", "SOC Operations", "Incident Response", "Malware Analysis", "Digital Forensics",
    "Network Security", "Cloud Security", "Linux", "Windows Security", "MITRE ATT&CK",
    "Splunk", "Microsoft Sentinel", "Wazuh", "Security Automation", "Detection Engineering",
    "Purple Team", "Portfolio", "Cybersecurity Portfolio"
  ],
  authors: [{ name: "Jothish Gandham", url: "https://www.webjothishanalyst.site" }],
  creator: "Jothish Gandham",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.webjothishanalyst.site",
    title: "Jothish Gandham — Cybersecurity Analyst Portfolio",
    description: "Cybersecurity portfolio showcasing expertise in SOC Operations, Threat Detection, Incident Response, SIEM, and Security Automation.",
    siteName: "Jothish Gandham",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jothish Gandham - Cybersecurity Portfolio",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jothish Gandham — Cybersecurity Analyst Portfolio",
    description: "Cybersecurity portfolio showcasing expertise in SOC Operations, Threat Detection, Incident Response, SIEM, and Security Automation.",
    creator: "@JothishGandham",
    images: ["/assets/images/og-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", // Replace this with your actual code from Search Console if using meta tag
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors antialiased">
        
        {/* Theme initialization (client-side) */}
        <ThemeInit />

        {/* Main App */}
        <div className="flex-1 flex flex-col pb-safe">
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
        </div>

      </body>
    </html>
  );
}
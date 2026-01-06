import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YC Hiring | Scout YC Startups",
  description: "Direct access to founders at the world's most innovative YC companies. Discover startups hiring and power your career with Gemini-powered scouting.",
  openGraph: {
    title: "YC Hiring | Scout YC Startups",
    description: "Direct access to founders at the world's most innovative YC companies. Powered by Gemini for natural language scouting.",
    type: "website",
    locale: "en_US",
    siteName: "YC Hiring",
  },
  twitter: {
    card: "summary_large_image",
    title: "YC Hiring | Scout YC Startups",
    description: "Direct access to founders at the world's most innovative YC companies.",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}



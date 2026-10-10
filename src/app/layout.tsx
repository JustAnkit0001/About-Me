import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./project-nova.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ankitbelbase.com.np"),
  title: "ANKIT BELBASE PORTFOLIO | Personal Universe",
  description:
    "A cinematic personal portfolio with a navigable universe, selected work, and accessible content for every visitor.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "ANKIT BELBASE PORTFOLIO | Personal Universe",
    description:
      "A cinematic personal portfolio built around a digital universe and a clear, accessible information architecture.",
    url: "https://ankitbelbase.com.np",
    siteName: "ANKIT BELBASE PORTFOLIO",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
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
  metadataBase: new URL("https://ankitbelbase.com.np"),
  title: "Ankit Belbase — Computer Engineering & Software",
  description:
    "Ankit Belbase is a computer engineering student and developer in Nepal, exploring software, game development, and interactive technology.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Ankit Belbase — Computer Engineering & Software",
    description:
      "Exploring software, game development, and interactive technology from Nepal.",
    url: "https://ankitbelbase.com.np",
    siteName: "Ankit Belbase",
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

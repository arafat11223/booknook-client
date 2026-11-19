
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookNook | Online Library",
    template: "%s | BookNook",
  },
  description:
    "BookNook is your small online library. Discover, explore and borrow your favourite books.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Suspense
          fallback={
            <header className="h-16 w-full border-b border-slate-200 bg-white" />
          }
        >
          <Navbar />
        </Suspense>

        <main className="flex flex-1 flex-col">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

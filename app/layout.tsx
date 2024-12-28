'use client'

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/UI/static/Sidebar";
import { useEffect } from "react";

declare global {
  interface Window {
    __TAURI__: any;
  }

  interface Deck {
    id: number;
    name: string;
    description: string;
  }

  interface Card {
    id: Number;
    deckId: number;
    front: string;
    back: string;
    retrievability: number;
    stability: number;
    difficulty: number;
    repetition: number;
    easiness_factor: number;
    interval: number;
    grade: number;
    next_review: Date;
  }
}

const inter = localFont({
  src: "../public/fonts/Inter.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex h-screen select-none overflow-hidden`}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}

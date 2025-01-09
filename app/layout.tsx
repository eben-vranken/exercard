'use client'

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/UI/static/Sidebar";
import { useEffect, useState } from "react";
import useGetAllSettings from "@/hooks/settings/useGetAllSettings";
import { SettingsProvider } from "@/context/SettingsContext";

declare global {
  interface Window {
    __TAURI__: any;
  }

  interface Deck {
    id: number;
    name: string;
    description: string;
    algorithm: string;
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
    next_review: number;
    new: number;
  }

  interface Tag {
    id: number;
    name: string;
  }

  interface CardWithTags extends Card {
    tags: Tag[]
  }

  interface Setting {
    id: number;
    key: string;
    value: string;
    valueType: 'string' | 'number' | 'boolean';
    description: string;
    createdAt: string;
    updatedAt: string;
  }

  interface UserSettings {
    dailyCardLimit: number;
    username: string;
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
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex h-screen select-none overflow-hidden`}>
        <SettingsProvider>
          <Sidebar />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}

"use client";

// src/app/LandingClient.tsx
//
// Isi halaman landing (dulu ada langsung di page.tsx) dipindah ke sini
// supaya page.tsx bisa jadi Server Component dan mengekspor `metadata`
// (title tab browser + Open Graph untuk preview link kalau dibagikan ke
// medsos/WhatsApp) — lihat src/app/page.tsx dan src/app/login/page.tsx
// untuk penjelasan pola yang sama.

import { useState } from "react";

import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { Opening } from "@/components/landing/Opening";
import { Hero } from "@/components/landing/Hero";
import { ProductReveal } from "@/components/landing/ProductReveal";
import { AppJourney } from "@/components/landing/AppJourney";
import { AISenseiDemo } from "@/components/landing/AISenseiDemo";
import { SpeechScene } from "@/components/landing/SpeechScene";
import { FlashcardScene } from "@/components/landing/FlashcardScene";
import { LeaderboardScene } from "@/components/landing/LeaderboardScene";
import { StoryScene } from "@/components/landing/StoryScene";
import { TeamScene } from "@/components/landing/TeamScene";
import { EndingScene } from "@/components/landing/EndingScene";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { SeigaihaBanner } from "@/components/landing/SeigaihaWave";
import { SceneBridge } from "@/components/landing/SceneBridge";

// Komponen utama landing page — dipanggil dari src/app/page.tsx.
export default function LandingClient() {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothScroll>
      {!opened && <Opening onDone={() => setOpened(true)} />}
      <LandingNav />
      <main id="main-content" className="relative">
        <Hero />
        <ProductReveal />
        <AppJourney />
        <AISenseiDemo />
        <SpeechScene />
        {/* Smooth transition yozora → cream ke FlashcardScene */}
        <SceneBridge from="yozora" to="cream" />
        <FlashcardScene />
        <SeigaihaBanner />
        <LeaderboardScene />
        <StoryScene />
        {/* Transition: cream → yozora untuk TeamScene */}
        <SceneBridge from="cream" to="yozora" />
        <TeamScene />
        {/* Transition: yozora → cream untuk EndingScene */}
        <SceneBridge from="yozora" to="cream" />
        <EndingScene />
        <SeigaihaBanner />
        <LandingFooter />
      </main>
    </SmoothScroll>
  );
}

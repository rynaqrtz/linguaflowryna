"use client";

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
import { JourneyProgress } from "@/components/landing/JourneyProgress";

export default function LandingClient() {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothScroll>
      {!opened && <Opening onDone={() => setOpened(true)} />}
      <LandingNav />
      <JourneyProgress />
      <main id="main-content" className="relative">
        <Hero />
        <ProductReveal />
        <AppJourney />
        <AISenseiDemo />
        <SpeechScene />
        <SceneBridge from="yozora" to="cream" />
        <FlashcardScene />
        <SeigaihaBanner />
        <LeaderboardScene />
        <StoryScene />
        <SceneBridge from="cream" to="yozora" />
        <TeamScene />
        <SceneBridge from="yozora" to="cream" />
        <EndingScene />
        <SeigaihaBanner />
        <LandingFooter />
      </main>
    </SmoothScroll>
  );
}

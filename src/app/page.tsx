import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "LinguaFlow School — Belajar Bahasa Jepang untuk Murid SMK",
  description:
    "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia. AI Sensei, flashcard, kuis, dan tracking progres real-time.",
  openGraph: {
    title: "LinguaFlow School — Belajar Bahasa Jepang untuk Murid SMK",
    description:
      "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia. AI Sensei, flashcard, kuis, dan tracking progres real-time.",
    siteName: "LinguaFlow School",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinguaFlow School — Belajar Bahasa Jepang untuk Murid SMK",
    description: "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia.",
  },
};

export default function Page() {
  return <LandingClient />;
}

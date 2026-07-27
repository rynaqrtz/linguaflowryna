import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Masuk — LinguaFlow School",
  description:
    "Masuk ke akun LinguaFlow School untuk melanjutkan belajar Bahasa Jepang: flashcard, kuis, dan AI Sensei.",
};

export default function LoginPage() {
  return <LoginClient />;
}

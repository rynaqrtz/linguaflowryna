import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { UserProvider } from "@/lib/user-context";

export const metadata: Metadata = {
  title: "LinguaFlow School — Belajar Bahasa Jepang",
  description:
    "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia. AI Sensei, flashcard, kuis, dan tracking progress real-time.",
};

const themeScript = `
(function(){try{var t=localStorage.getItem('lf-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="font-sans antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-warm-white text-ink transition-colors duration-300">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-btn focus:bg-sora focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:shadow-soft-lg"
        >
          Langsung ke konten utama
        </a>
        <ThemeProvider>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

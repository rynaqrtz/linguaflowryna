import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

const links = [
  { label: "Fitur", href: "#fitur" },
  { label: "Untuk Sekolah", href: "#sekolah" },
  { label: "Harga", href: "#harga" },
  { label: "FAQ", href: "#faq" },
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-warm-white/90 backdrop-blur-md border-b border-line/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-sora"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/register-sekolah">
            <Button variant="outline" size="sm">
              Daftarkan Sekolah
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Masuk</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  const cols = [
    {
      title: "Produk",
      items: ["Fitur", "Flashcard", "AI Sensei", "Latihan Ucapan"],
    },
    {
      title: "Perusahaan",
      items: ["Tentang", "Karier", "Blog", "Kontak"],
    },
    {
      title: "Sumber Daya",
      items: ["Panduan Guru", "JLPT", "Bantuan", "Status"],
    },
    {
      title: "Kontak",
      items: ["hello@linguaflow.id", "+62 21 5000 1234", "Jakarta, Indonesia"],
    },
  ];
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-5 md:px-8">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Platform belajar Bahasa Jepang untuk sekolah Indonesia.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 text-sm font-bold text-ink">{c.title}</h4>
            <ul className="space-y-2">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-ink-soft transition-colors hover:text-sora">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-sm text-ink-soft md:flex-row md:px-8">
          <span>© 2026 LinguaFlow School</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sora">Instagram</a>
            <a href="#" className="hover:text-sora">YouTube</a>
            <a href="#" className="hover:text-sora">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { Building2, Bell, Palette, Globe, Save, Moon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTheme } from "@/lib/theme";
import { useUser } from "@/lib/user-context";

export default function PengaturanSekolah() {
  const [name, setName] = useState("SMK Texar");
  const [npsn, setNpsn] = useState("12345678");
  const [email, setEmail] = useState("admin@smktn.sch.id");
  const [notif, setNotif] = useState({ tugas: true, laporan: false, murid: true });
  const { theme, toggle: toggleTheme } = useTheme();
  const dark = theme === "dark";
  const router = useRouter();
  const { logout } = useUser();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={"relative h-6 w-11 rounded-full transition-colors " + (on ? "bg-sora" : "bg-line")}
      >
        <span className={"absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all " + (on ? "left-[22px]" : "left-0.5")} />
      </button>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-ink jp-rule">Pengaturan Sekolah</h1>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card padded>
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-sora" />
            <h2 className="text-base font-bold text-ink">Profil Sekolah</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Nama Sekolah</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">NPSN</label>
              <Input value={npsn} onChange={(e) => setNpsn(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Email Admin</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card padded>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-sora" />
            <h2 className="text-base font-bold text-ink">Notifikasi</h2>
          </div>
          <div className="mt-4 space-y-3">
            {([
              { k: "tugas", label: "Tugas baru masuk", desc: "Saat murid kumpulkan tugas" },
              { k: "murid", label: "Murid tidak aktif", desc: "Peringatan murid &gt; 3 hari tidak login" },
              { k: "laporan", label: "Laporan mingguan", desc: "Kirim ringkasan tiap Senin" },
            ] as const).map((n) => (
              <div key={n.k} className="flex items-center justify-between rounded-btn bg-sora-tint-soft/30 px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-ink">{n.label}</p>
                  <p className="text-xs text-ink-soft">{n.desc}</p>
                </div>
                <Toggle on={notif[n.k]} onClick={() => setNotif((p) => ({ ...p, [n.k]: !p[n.k] }))} />
              </div>
            ))}
          </div>
        </Card>

        <Card padded>
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-sora" />
            <h2 className="text-base font-bold text-ink">Tampilan</h2>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-btn bg-sora-tint-soft/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Moon size={16} className="text-sora" />
              <div>
                <p className="text-sm font-semibold text-ink">Mode Gelap</p>
                <p className="text-xs text-ink-soft">Berlaku di seluruh dashboard admin</p>
              </div>
            </div>
            <Toggle on={dark} onClick={toggleTheme} />
          </div>
        </Card>

        <Card padded>
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-sora" />
            <h2 className="text-base font-bold text-ink">Bahasa & Region</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Bahasa Antarmuka</label>
              <Select>
                <option>Bahasa Indonesia</option>
                <option>English</option>
                <option>日本語</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Zona Waktu</label>
              <Select>
                <option>Asia/Jakarta (WIB)</option>
                <option>Asia/Makassar (WITA)</option>
                <option>Asia/Jayapura (WIT)</option>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-bold text-sakura hover:underline"
        >
          <LogOut size={16} /> Keluar dari Akun
        </button>
        <Button>
          <Save size={16} /> Simpan Pengaturan
        </Button>
      </div>
    </>
  );
}

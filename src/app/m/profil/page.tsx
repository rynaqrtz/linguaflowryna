"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Pencil,
  Moon,
  LogOut,
  Settings,
  Shield,
  Bell,
  Star,
  Flame,
  BookOpen,
  Check,
  Camera,
  User as UserIcon,
} from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/lib/theme";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useProgress } from "@/lib/progress";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";

const stats = [
  { v: "2.450", l: "Total XP", icon: Star },
  { v: "12 Hari", l: "Streak", icon: Flame },
  { v: "156", l: "Kata Dikuasai", icon: BookOpen },
  { v: "24", l: "Kuis Selesai", icon: Check },
];

const activity = [20, 35, 28, 45, 60, 40, 75, 55, 80, 65, 90, 70, 85, 100];

const languages = ["Indonesia", "English", "日本語"] as const;

type SheetKind = "profile" | "password" | "notif" | "language" | "logout" | null;

export default function Profil() {
  const { theme, toggle: toggleTheme } = useTheme();
  const dark = theme === "dark";
  const router = useRouter();
  const { logout } = useUser();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const [name, setName] = useLocalStorage<string>("lf-name", "Ahmad Fauzi");

  const [school, setSchool] = useLocalStorage<string>("lf-profile-school", "XII RPL 1 · SMK Texar");
  const [avatarColor, setAvatarColor] = useLocalStorage<string>("lf-avatar-color", "");
  const [language, setLanguage] = useLocalStorage<string>("lf-language", "Indonesia");
  const [notifOn, setNotifOn] = useLocalStorage<boolean>("lf-notif", true);
  const [progress] = useProgress();

  const [sheet, setSheet] = useState<SheetKind>(null);
  const [draftName, setDraftName] = useState(name);
  const [draftSchool, setDraftSchool] = useState(school);
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setName(draftName.trim() || "Ahmad Fauzi");
    setSchool(draftSchool.trim() || "XII RPL 1 · SMK Texar");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setSheet(null);
  }

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="relative flex flex-col items-center pt-4 text-center">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Avatar name={name} size={88} color={avatarColor || undefined} />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setSheet("profile")}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper bg-sora text-white shadow-soft transition-colors hover:bg-sora-tint"
                aria-label="Edit foto"
              >
                <Pencil size={14} />
              </motion.button>
            </motion.div>
            <motion.h1
              className="mt-3 text-xl font-bold text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {name}
            </motion.h1>
            <motion.p
              className="text-sm text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {school}
            </motion.p>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-6 grid grid-cols-2 gap-3">
            {[
              { v: progress.xp.toLocaleString(), l: "Total XP", icon: Star },
              { v: `${progress.streak} Hari`, l: "Streak", icon: Flame },
              { v: progress.reviewed.length, l: "Kata Dikuasai", icon: BookOpen },
              { v: progress.totalSessions, l: "Sesi Selesai", icon: Check },
            ].map((s) => (
              <motion.div
                key={s.l}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="text-center transition-all hover:shadow-soft-lg">
                  <s.icon size={24} className="mx-auto text-sora/60" />
                  <p className="mt-1 text-2xl lf-stat lf-stat-sora">{s.v}</p>
                  <p className="text-xs text-ink-soft">{s.l}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="mt-4 transition-all hover:shadow-soft-lg" padded>
              <div className="flex items-center justify-between">
                <h2 className="lf-section-rule text-sm font-bold text-ink">Aktivitas 14 Hari</h2>
                <span className="text-[11px] font-semibold text-sora">+12%</span>
              </div>
              <div className="mt-4 flex items-end gap-1.5">
                {activity.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full rounded-t-sm"
                      style={{
                        background: `linear-gradient(to top, var(--color-sora), var(--color-sora-tint-2))`,
                        opacity: 0.6 + (v / 100) * 0.4,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${v * 0.55}px` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    />
                    {i % 2 === 0 && <span className="text-[8px] text-ink-soft">{i + 1}</span>}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-4 space-y-1">
            {[
              { icon: Pencil, label: "Edit Profil", desc: "Nama, foto, kelas", kind: "profile" as const },
              { icon: Shield, label: "Ganti Password", desc: "Keamanan akun", kind: "password" as const },
              { icon: Bell, label: "Notifikasi", desc: notifOn ? "Aktif" : "Nonaktif", kind: "notif" as const },
              { icon: Moon, label: "Mode Gelap", toggle: true },
              { icon: Settings, label: "Bahasa", desc: language, kind: "language" as const },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.label}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (s.kind ? setSheet(s.kind) : toggleTheme())}
                  className="flex w-full items-center gap-3 rounded-btn px-3 py-3.5 text-left transition-colors hover:bg-sora-tint-soft/60"
                >
                  <span className="flex h-9 w-9 items-center justify-center text-sora/60">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{s.label}</p>
                    {"desc" in s && s.desc && (
                      <p className="text-[11px] text-ink-soft">{s.desc}</p>
                    )}
                  </div>
                  <div className="ml-auto">
                    {s.toggle ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTheme();
                        }}
                        className={
                          "relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 " +
                          (dark ? "bg-sora" : "bg-line")
                        }
                      >
                        <motion.span
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft"
                          animate={{ left: dark ? 22 : 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      </span>
                    ) : (
                      <ChevronRight size={18} className="text-ink-soft" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="mt-2 transition-all hover:shadow-soft-lg" padded>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setSheet("logout")}
                className="flex w-full items-center gap-3 text-sm font-bold text-sakura"
              >
                <LogOut size={18} /> Keluar
              </motion.button>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatedPage>

      <BottomSheet open={sheet === "profile"} onClose={() => setSheet(null)} title="Edit Profil">
        <div className="space-y-4 pb-2">
          <div className="flex flex-col items-center">
            <Avatar name={draftName || "Ahmad Fauzi"} size={72} color={avatarColor || undefined} />
            <p className="mt-2 text-[11px] text-ink-soft">Warna avatar (demo)</p>
            <div className="mt-1 flex gap-2">
              {["#3d7dae", "#c24d77", "#e3ac4c", "#10b981", "#7fadd1"].map((c) => (
                <button
                  key={c}
                  onClick={() => setAvatarColor(c)}
                  className={
                    "h-7 w-7 rounded-full ring-2 transition-all " +
                    (avatarColor === c ? "ring-sora" : "ring-transparent")
                  }
                  style={{ backgroundColor: c }}
                  aria-label={`Warna ${c}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft">Nama</label>
            <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Nama" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft">Kelas / Sekolah</label>
            <Input value={draftSchool} onChange={(e) => setDraftSchool(e.target.value)} placeholder="Kelas / Sekolah" />
          </div>
          <Button fullWidth size="lg" onClick={saveProfile}>
            {saved ? <Check size={18} /> : <UserIcon size={18} />} {saved ? "Tersimpan" : "Simpan Profil"}
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "password"} onClose={() => setSheet(null)} title="Ganti Password">
        <div className="space-y-3 pb-2">
          {["Password saat ini", "Password baru", "Konfirmasi password baru"].map((ph) => (
            <Input key={ph} type="password" placeholder={ph} />
          ))}
          <Button fullWidth size="lg" disabled className="opacity-60">
            <Shield size={18} /> Simpan (Segera Hadir)
          </Button>
          <p className="text-center text-[11px] text-ink-soft/60">
            Fitur ini membutuhkan server autentikasi.
          </p>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "notif"} onClose={() => setSheet(null)} title="Notifikasi">
        <div className="space-y-3 pb-2">
          <div className="flex items-center justify-between rounded-card border border-line bg-paper p-3">
            <div>
              <p className="text-sm font-semibold text-ink">Pengingat belajar</p>
              <p className="text-[11px] text-ink-soft">Tiap hari 19:00 WIB</p>
            </div>
            <span
              onClick={() => setNotifOn(!notifOn)}
              className={
                "relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 " +
                (notifOn ? "bg-sora" : "bg-line")
              }
            >
              <motion.span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft"
                animate={{ left: notifOn ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </span>
          </div>
          <p className="text-center text-[11px] text-ink-soft/60">
            Status tersimpan di perangkat ini.
          </p>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "language"} onClose={() => setSheet(null)} title="Bahasa">
        <div className="space-y-2 pb-2">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLanguage(l);
                setSheet(null);
              }}
              className={
                "flex w-full items-center justify-between rounded-card border px-4 py-3 text-left text-sm font-semibold transition-colors " +
                (language === l
                  ? "border-sora bg-sora-tint-soft text-sora"
                  : "border-line bg-paper text-ink hover:bg-sora-tint-soft/40")
              }
            >
              {l}
              {language === l && <Check size={18} />}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "logout"} onClose={() => setSheet(null)} title="Keluar">
        <div className="space-y-3 pb-2">
          <p className="text-center text-sm text-ink-soft">
            Kamu akan keluar dari sesi ini. (Demo — belum ada backend login.)
          </p>
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={handleLogout}
            className="bg-sakura"
          >
            <LogOut size={18} /> Ya, Keluar
          </Button>
          <Button fullWidth variant="outline" onClick={() => setSheet(null)}>
            Batal
          </Button>
        </div>
      </BottomSheet>
    </StudentShell>
  );
}

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Pencil,
  Moon,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Users,
  ClipboardList,
  FileQuestion,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import { useTheme } from "@/lib/theme";
import { useUser } from "@/lib/user-context";

const stats = [
  { v: "3", l: "Kelas Diajar", icon: Users },
  { v: "84", l: "Total Murid", icon: ClipboardList },
  { v: "12", l: "Tugas Aktif", icon: FileQuestion },
  { v: "78%", l: "Rata² Skor", icon: Award },
];

const subjects = ["XII RPL 1", "XII RPL 2", "XI TKJ 1"];

const settings = [
  { icon: Pencil, label: "Edit Profil", desc: "Nama, foto, biodata" },
  { icon: Shield, label: "Ganti Password", desc: "Keamanan akun" },
  { icon: Bell, label: "Notifikasi", desc: "Submission & pengingat" },
  { icon: Moon, label: "Mode Gelap", toggle: true },
  { icon: SettingsIcon, label: "Bahasa", desc: "Indonesia, English, 日本語" },
];

export default function TeacherProfile() {
  const router = useRouter();
  const { theme, toggle: toggleTheme } = useTheme();
  const dark = theme === "dark";
  const { user, logout } = useUser();
  const name = user?.name ?? "Guru";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <AnimatedPage>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={staggerItem} className="relative flex flex-col items-center pt-2 text-center">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Avatar name={name} size={88} />
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper bg-sora text-white shadow-soft transition-colors hover:bg-sora-tint"
              aria-label="Edit foto"
            >
              <Pencil size={14} />
            </motion.button>
          </motion.div>
          <motion.h1
            className="mt-3 text-xl font-bold text-ink jp-rule"
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
            Guru Bahasa Jepang · SMK Texar
          </motion.p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {subjects.map((s) => (
              <Badge key={s} tone="soft">
                {s}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mt-6 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <motion.div
              key={s.l}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="text-center transition-all hover:shadow-soft-lg">
                <s.icon size={24} className="mx-auto text-sora/60" />
                <p className="mt-1 text-lg font-bold text-sora">{s.v}</p>
                <p className="text-xs text-ink-soft">{s.l}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerItem} className="mt-4 space-y-1">
          {settings.map((s) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.label}
                whileTap={{ scale: 0.98 }}
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
              className="flex w-full items-center gap-3 text-sm font-bold text-sakura"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Keluar
            </motion.button>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}

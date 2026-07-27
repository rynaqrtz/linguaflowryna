"use client";

import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon, type LucideIcon } from "lucide-react";

export type TimePeriod = "pagi" | "siang" | "sore" | "malam";

export interface TimeGreeting {
  period: TimePeriod;

  greeting: string;

  jpGreeting: string;

  icon: LucideIcon;

  gradient: string;
}

function calcGreeting(): TimeGreeting {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) {
    return {
      period: "pagi",
      greeting: "Selamat Pagi",
      jpGreeting: "おはよう",
      icon: Sunrise,
      gradient: "from-amber-400 via-orange-400 to-rose-400",
    };
  }
  if (h >= 11 && h < 15) {
    return {
      period: "siang",
      greeting: "Selamat Siang",
      jpGreeting: "こんにちは",
      icon: Sun,
      gradient: "from-sora via-sora-tint to-sora-tint-2",
    };
  }
  if (h >= 15 && h < 18) {
    return {
      period: "sore",
      greeting: "Selamat Sore",
      jpGreeting: "こんばんは",
      icon: Sunset,
      gradient: "from-[#d4836a] via-[#b98389] to-[#7c6a8c]",
    };
  }

  return {
    period: "malam",
    greeting: "Selamat Malam",
    jpGreeting: "おやすみ",
    icon: Moon,
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
  };
}

export function useTimeGreeting(): TimeGreeting {

  const [greeting, setGreeting] = useState<TimeGreeting>({
    period: "siang",
    greeting: "Selamat Siang",
    jpGreeting: "こんにちは",
    icon: Sun,
    gradient: "from-sora via-sora-tint to-sora-tint-2",
  });

  useEffect(() => {

    const update = () => setGreeting(calcGreeting());
    update();

    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}

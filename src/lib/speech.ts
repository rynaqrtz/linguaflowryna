interface SpeechRecognitionResultLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultItemLike {
  0: SpeechRecognitionAlternativeLike;
  length: number;
}

interface SpeechRecognitionEventLike extends Event {
  results: {
    0: SpeechRecognitionResultItemLike;
    length: number;
  };
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

function getRecognitionConstructor(): SpeechRecognitionConstructorLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isRecognitionSupported(): boolean {
  return getRecognitionConstructor() !== null;
}

let activeRecognition: SpeechRecognitionLike | null = null;

export function stopJapaneseRecognition() {
  activeRecognition?.stop();
}

export function recognizeJapaneseSpeech(): Promise<SpeechRecognitionResultLike> {
  return new Promise((resolve, reject) => {
    const Ctor = getRecognitionConstructor();
    if (!Ctor) {
      reject(new Error("speech-recognition-unsupported"));
      return;
    }

    const recognition = new Ctor();
    activeRecognition = recognition;
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const alt = event.results[0][0];
      resolve({ transcript: alt.transcript, confidence: alt.confidence });
    };
    recognition.onerror = (event) => {
      reject(new Error(event.error ?? "speech-recognition-error"));
    };
    recognition.onend = () => {
      activeRecognition = null;
    };

    recognition.start();
  });
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function normalizeJapanese(text: string): string {
  return text.replace(/[\s。、!?！？.,]/g, "").trim();
}

export interface PronunciationScore {
  transcript: string;
  accuracy: number;
  confidence: number;
  overall: number;
}

export function scorePronunciation(target: string, recognized: string, confidence: number): PronunciationScore {
  const a = normalizeJapanese(target);
  const b = normalizeJapanese(recognized);
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length, 1);
  const accuracy = Math.max(0, Math.round((1 - distance / maxLen) * 100));
  const confidencePct = Math.round(confidence * 100);
  const overall = Math.round(accuracy * 0.7 + confidencePct * 0.3);
  return { transcript: recognized, accuracy, confidence: confidencePct, overall };
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cachedVoices.length === 0) cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakJapanese(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.9;
  utter.pitch = 1;

  const voices = loadVoices();
  const ja = voices.find((v) => v.lang?.toLowerCase().startsWith("ja"));
  if (ja) utter.voice = ja;

  synth.speak(utter);
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

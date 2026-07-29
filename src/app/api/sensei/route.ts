import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION =
  "Kamu adalah AI Sensei, tutor Bahasa Jepang untuk murid SMK jurusan RPL di Indonesia yang sedang belajar JLPT N5 sampai N3. " +
  "Jawab HANYA pertanyaan seputar Bahasa Jepang: grammar, kosakata, partikel, kanji, dan cara baca. " +
  "Kalau ditanya hal di luar topik Bahasa Jepang, tolak dengan sopan dan arahkan kembali ke pelajaran. " +
  "Jawab dalam Bahasa Indonesia yang santai tapi jelas, sertakan contoh kalimat Jepang dengan romaji dan artinya. " +
  "Jaga jawaban singkat, maksimal 4-5 kalimat, karena ditampilkan di chat bubble di HP.";

const MODEL = "gemini-2.5-flash";

interface ChatTurn {
  role: "user" | "ai";
  text: string;
}

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: GeminiPart[];
    };
    finishReason?: string;
  }[];
  error?: {
    message?: string;
    status?: string;
  };
}

function toGeminiContents(history: ChatTurn[], message: string): GeminiContent[] {
  const contents: GeminiContent[] = history
    .filter((turn) => turn.text.trim().length > 0)
    .map((turn) => ({
      role: turn.role === "ai" ? "model" : "user",
      parts: [{ text: turn.text }],
    }));
  contents.push({ role: "user", parts: [{ text: message }] });
  return contents;
}

function getApiKeys(): string[] {
  return [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(
    (key): key is string => Boolean(key && key.trim().length > 0),
  );
}

async function callGemini(apiKey: string, contents: GeminiContent[]) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 400,
      },
    }),
  });
  const data = (await res.json()) as GeminiResponse;
  return { ok: res.ok, status: res.status, data };
}

function isRateLimitOrQuotaError(status: number, data: GeminiResponse): boolean {
  if (status === 429) return true;
  const code = data.error?.status;
  return code === "RESOURCE_EXHAUSTED";
}

export async function POST(req: NextRequest) {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY belum diatur di environment variable server." },
      { status: 500 },
    );
  }

  let body: { message?: string; history?: ChatTurn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Pesan terlalu panjang." }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const contents = toGeminiContents(history, message);

  let lastError = "Gagal menghubungi AI Sensei.";
  let lastStatus = 502;

  for (let i = 0; i < apiKeys.length; i++) {
    try {
      const { ok, status, data } = await callGemini(apiKeys[i], contents);

      if (ok) {
        const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
        if (reply) return NextResponse.json({ reply });
        lastError = "AI Sensei tidak memberikan balasan.";
        lastStatus = 502;
        continue;
      }

      lastError = data.error?.message ?? "Gagal menghubungi AI Sensei.";
      lastStatus = status;

      if (isRateLimitOrQuotaError(status, data) && i < apiKeys.length - 1) {
        continue;
      }

      return NextResponse.json({ error: lastError }, { status });
    } catch {
      lastError = "Tidak bisa menghubungi AI Sensei sekarang.";
      lastStatus = 502;
    }
  }

  return NextResponse.json({ error: lastError }, { status: lastStatus });
}

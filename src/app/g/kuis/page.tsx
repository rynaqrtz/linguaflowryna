"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  GripVertical,
  Trash2,
  Download,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useRouter } from "next/navigation";
import { useSchool, type SchoolQuiz } from "@/lib/school";

import { vocabulary as bank, type Word } from "@/lib/vocabulary";

function SortableWord({ w, index, onRemove }: { w: Word; index: number; onRemove: (kanji: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: w.kanji,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "flex items-center gap-2 rounded-btn bg-sora-tint-soft/40 p-2 " +
        (isDragging ? "shadow-soft-lg ring-2 ring-sora" : "")
      }
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-ink-soft active:cursor-grabbing"
        aria-label="Urutkan soal"
      >
        <GripVertical size={16} />
      </button>
      <span className="text-xs font-bold text-sora">{index + 1}.</span>
      <div className="min-w-0 flex-1">
        <p className="jp-bold text-sm text-sora">{w.kanji}</p>
        <p className="text-xs text-ink-soft">
          {w.furigana} · {w.arti}
        </p>
      </div>
      <button
        onClick={() => onRemove(w.kanji)}
        className="text-ink-soft hover:text-error"
        aria-label="Hapus"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function QuizCreator() {
  const router = useRouter();
  const [school, setSchool] = useSchool();
  const [selected, setSelected] = useState<Word[]>([bank[0], bank[1], bank[2]]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("Kuis Kata Kerja Bab 3");
  const [level, setLevel] = useState("N5");
  const [passing, setPassing] = useState("75");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const filtered = bank.filter(
    (w) =>
      w.kanji.includes(q) ||
      w.furigana.includes(q) ||
      w.arti.toLowerCase().includes(q.toLowerCase()),
  );

  function add(w: Word) {
    if (!selected.find((s) => s.kanji === w.kanji)) setSelected((s) => [...s, w]);
  }

  function remove(kanji: string) {
    setSelected((s) => s.filter((x) => x.kanji !== kanji));
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setSelected((items) => {
        const oldIndex = items.findIndex((i) => i.kanji === active.id);
        const newIndex = items.findIndex((i) => i.kanji === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handlePublish() {
    if (selected.length === 0) return;
    const quiz: SchoolQuiz = {
      id: `q-${Date.now()}`,
      title: title || "Kuis Tanpa Judul",
      level,
      passingGrade: Number(passing) || 75,
      words: selected.map((w) => ({ kanji: w.kanji, furigana: w.furigana, arti: w.arti, level: w.level })),
      classId: "xii-rpl-1",
      className: "XII RPL 1",
      teacher: "Bu Siti Rahma",
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    setSchool((prev) => ({ ...prev, quizzes: [quiz, ...prev.quizzes] }));
    router.push("/g/dashboard");
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink jp-rule">Buat Kuis Baru</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/g/dashboard")}>
            Simpan Draft
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Download size={15} /> Publish
          </Button>
        </div>
      </div>

      <Card className="mt-5" padded>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-ink">Judul Kuis</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kuis Kata Kerja Bab 3" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Level</label>
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>N5</option>
              <option>N4</option>
              <option>N3</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Passing Grade (%)</label>
            <Input type="number" value={passing} onChange={(e) => setPassing(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2" padded>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kata..." className="pl-10" />
          </div>
          <p className="mb-2 mt-3 text-xs font-semibold text-ink-soft">Bank Kata</p>
          <div className="space-y-2">
            {filtered.map((w) => (
              <div key={w.kanji} className="flex items-center gap-2 rounded-btn border border-line p-2 transition-colors hover:border-sora/40 hover:bg-sora-tint-soft/30">
                <div className="min-w-0 flex-1">
                  <p className="jp-bold text-sm text-sora">{w.kanji}</p>
                  <p className="text-xs text-ink-soft">
                    {w.furigana} · {w.arti}
                  </p>
                </div>
                <Badge tone="sora">{w.level}</Badge>
                <button
                  onClick={() => add(w)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-sora text-white transition-transform hover:scale-105 active:scale-95"
                  aria-label="Tambah"
                >
                  <Plus size={15} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3" padded>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Soal Terpilih</p>
            <Badge tone="gold">{selected.length} soal dipilih · Target: 10-15</Badge>
          </div>
          {selected.length === 0 ? (
            <p className="mt-3 text-center text-sm text-ink-soft">
              Belum ada soal. Tambah dari Bank Kata di samping.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selected.map((w) => w.kanji)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mt-3 space-y-2">
                  {selected.map((w, i) => (
                    <SortableWord key={w.kanji} w={w} index={i} onRemove={remove} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </Card>
      </div>
    </>
  );
}

import type { AnalysisRecord } from "./types";
import { analyzeChat } from "./order-analyzer";

const NAMES = [
  "Budi", "Siti", "Andi", "Rina", "Dewi", "Agus", "Putri", "Eka", "Yusuf", "Wulan",
  "Hadi", "Maya", "Rangga", "Indah", "Bayu", "Lestari", "Fajar", "Nina", "Tono", "Sari",
];

const MENU_POOL = [
  { key: "sate ayam", label: "Sate Ayam", qtyRange: [10, 30] as const },
  { key: "sate kambing", label: "Sate Kambing", qtyRange: [5, 20] as const },
  { key: "lontong", label: "Lontong", qtyRange: [2, 8] as const },
  { key: "teh manis", label: "Teh Manis", qtyRange: [1, 5] as const },
  { key: "es teh", label: "Es Teh", qtyRange: [1, 5] as const },
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildChat(params: {
  name: string;
  items: { key: string; qty: number; revised?: number }[];
  pickup: boolean;
  time: string;
  revisedTime?: string;
  phone: string;
}): string {
  const lines: string[] = [];
  lines.push(`Customer: Halo Pak Mail, saya ${params.name}`);
  const first = params.items[0];
  lines.push(`Customer: Pesan ${first.qty} ${first.key} ya`);

  for (let i = 1; i < params.items.length; i++) {
    lines.push(`Customer: Tambah ${params.items[i].qty} ${params.items[i].key}`);
  }

  for (const item of params.items) {
    if (item.revised && item.revised !== item.qty) {
      lines.push(`Customer: Eh ${item.key}nya jadi ${item.revised} ya`);
    }
  }

  if (params.pickup) {
    lines.push(`Customer: Saya ambil jam ${params.time}`);
    if (params.revisedTime) {
      lines.push(`Customer: Jadinya ambil jam ${params.revisedTime} saja`);
    }
  } else {
    lines.push(`Customer: Tolong antar jam ${params.time}`);
    lines.push(`Customer: Alamat Jl. Mawar No. 12`);
  }

  lines.push(`Sate Pak Mail: Siap ${params.name}, ditunggu ya`);
  lines.push(`Customer: No HP ${params.phone}`);

  return lines.join("\n");
}

export function generateDemoRecords(count = 100): AnalysisRecord[] {
  const rand = seedRand(2026);
  const now = Date.now();
  const records: AnalysisRecord[] = [];

  for (let i = 0; i < count; i++) {
    const name = NAMES[Math.floor(rand() * NAMES.length)];
    const pickup = rand() < 0.84;
    const itemCount = 1 + Math.floor(rand() * 3);
    const picked = new Set<number>();
    const items: { key: string; qty: number; revised?: number }[] = [];

    for (let j = 0; j < itemCount; j++) {
      let idx = Math.floor(rand() * MENU_POOL.length);
      while (picked.has(idx)) idx = (idx + 1) % MENU_POOL.length;
      picked.add(idx);
      const menu = MENU_POOL[idx];
      const qty =
        menu.qtyRange[0] + Math.floor(rand() * (menu.qtyRange[1] - menu.qtyRange[0] + 1));
      const revised =
        rand() < 0.35 && menu.key.startsWith("sate")
          ? qty + Math.floor(rand() * 5) + 1
          : undefined;
      items.push({ key: menu.key, qty, revised });
    }

    const peak = rand() < 0.65;
    const hour = peak ? 17 + Math.floor(rand() * 3) : 10 + Math.floor(rand() * 6);
    const minute = ["00", "15", "30", "45"][Math.floor(rand() * 4)];
    const time = `${hour}.${minute}`;
    const revisedTime =
      rand() < 0.25 ? `${Math.min(hour + 1, 20)}.${minute}` : undefined;

    const phone = `0812-${String(1000 + Math.floor(rand() * 8999))}-${String(1000 + Math.floor(rand() * 8999))}`;
    const chat = buildChat({ name, items, pickup, time, revisedTime, phone });
    const result = analyzeChat(chat);
    const dayOffset = Math.floor(rand() * 30);

    records.push({
      id: `SEED-${1000 + i}`,
      chat,
      analyzedAt: new Date(now - dayOffset * 86400000 - i * 3600000).toISOString(),
      source: "seed",
      result,
    });
  }

  return records.sort((a, b) => +new Date(b.analyzedAt) - +new Date(a.analyzedAt));
}

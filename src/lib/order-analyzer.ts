import type {
  AnalysisResult,
  ExtractionStep,
  FieldConfidence,
  StructuredRevision,
} from "./types";
import type { FulfillmentType, OrderItem, Revision } from "./mock-data";

const MENU_KEYWORDS: Record<string, string> = {
  "sate ayam": "Sate Ayam",
  "sate kambing": "Sate Kambing",
  lontong: "Lontong",
  "teh manis": "Teh Manis",
  "es teh": "Es Teh",
  "jeruk hangat": "Jeruk Hangat",
  "jeruk anget": "Jeruk Hangat",
};

const PRICES: Record<string, number> = {
  "Sate Ayam": 25000,
  "Sate Kambing": 35000,
  Lontong: 8000,
  "Teh Manis": 5000,
  "Es Teh": 6000,
  "Jeruk Hangat": 8000,
};

const EVENING_WORDS = /(malam|pm|sore|nanti malam)/i;
const MORNING_WORDS = /(pagi|siang|sore hari)/i;

function normalizeLine(line: string) {
  return line.replace(/^(customer|pelanggan|buyer|sate pak mail|warung)[:\s-]+/i, "").trim();
}

function parseTimeFromLine(line: string): string | null {
  const l = line.toLowerCase();

  const explicit = [...line.matchAll(/(\d{1,2})[:.](\d{2})/g)];
  if (explicit.length) {
    const m = explicit[explicit.length - 1];
    return `${m[1].padStart(2, "0")}:${m[2]}`;
  }

  const jamMatch = l.match(/jam\s*(\d{1,2})(?:\s*(?:\.|:)\s*(\d{2}))?\s*(malam|sore|siang|pagi)?/);
  if (jamMatch) {
    let hour = parseInt(jamMatch[1], 10);
    const minute = jamMatch[2] ? jamMatch[2] : "00";
    const period = jamMatch[3] ?? (EVENING_WORDS.test(l) ? "malam" : MORNING_WORDS.test(l) ? "siang" : null);

    if (period === "malam" || period === "sore") {
      if (hour >= 1 && hour <= 11) hour += 12;
    } else if (period === "pagi" && hour === 12) {
      hour = 0;
    } else if (!period && hour >= 1 && hour <= 11 && EVENING_WORDS.test(l)) {
      hour += 12;
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  return null;
}

function extractQtyForKeyword(line: string, kw: string): number | null {
  const l = line.toLowerCase();
  if (!l.includes(kw)) return null;

  const patterns = [
    new RegExp(`(\\d{1,3})\\s*(?:porsi|tusuk|pcs|buah|gelas|x|bungkus)?\\s*${kw.replace(" ", "\\s+")}`, "i"),
    new RegExp(`${kw.replace(" ", "\\s+")}\\s*(?:jadi|nya jadi|=|:)?\\s*(\\d{1,3})`, "i"),
    new RegExp(`(?:tambah|plus|\\+)\\s*(\\d{1,3})\\s*${kw.replace(" ", "\\s+")}`, "i"),
  ];

  for (const re of patterns) {
    const m = l.match(re);
    if (m?.[1]) return parseInt(m[1], 10);
  }

  if (/(tambah|pesan|order|mau)/i.test(l)) return 1;
  return null;
}

function parseItemsFromChat(chat: string) {
  const itemFinal: Record<string, { qty: number; history: number[]; firstSeen: number }> = {};
  const lines = chat.split(/\n+/).map(normalizeLine).filter(Boolean);

  lines.forEach((line, lineIdx) => {
    const l = line.toLowerCase();
    for (const [kw, canonical] of Object.entries(MENU_KEYWORDS)) {
      if (!l.includes(kw)) continue;

      const qty = extractQtyForKeyword(line, kw);
      if (qty && qty > 0) {
        if (!itemFinal[canonical]) {
          itemFinal[canonical] = { qty, history: [qty], firstSeen: lineIdx };
        } else {
          itemFinal[canonical].history.push(qty);
          itemFinal[canonical].qty = qty;
        }
      } else if (!itemFinal[canonical] && /(tambah|pesan|mau|order)/i.test(l)) {
        itemFinal[canonical] = { qty: 1, history: [1], firstSeen: lineIdx };
      }
    }
  });

  return { itemFinal, lines };
}

function parseFulfillmentHistory(chat: string) {
  const text = chat.toLowerCase();
  const lines = chat.split(/\n+/).map(normalizeLine);
  const history: FulfillmentType[] = [];

  for (const line of lines) {
    const l = line.toLowerCase();
    const isDelivery = /(antar|delivery|kirim|diantar|gojek|grab)/i.test(l);
    const isPickup = /(ambil|pickup|takeaway|jemput|saya ambil)/i.test(l);
    if (isDelivery && !isPickup) history.push("delivery");
    else if (isPickup) history.push("pickup");
  }

  if (history.length === 0) {
    const isDelivery = /(antar|delivery|kirim|diantar|gojek|grab)/i.test(text);
    const isPickup = /(ambil|pickup|takeaway|jemput|saya ambil)/i.test(text);
    if (isDelivery && !isPickup) history.push("delivery");
    else history.push("pickup");
  }

  return history;
}

function parseTimeHistory(chat: string) {
  return chat
    .split(/\n+/)
    .map(normalizeLine)
    .map(parseTimeFromLine)
    .filter((t): t is string => Boolean(t));
}

function buildStructuredRevisions(
  itemFinal: Record<string, { qty: number; history: number[]; firstSeen: number }>,
  timeHistory: string[],
  fulfillmentHistory: ReturnType<typeof parseFulfillmentHistory>,
  now: string,
): StructuredRevision[] {
  const revisions: StructuredRevision[] = [];

  for (const [name, v] of Object.entries(itemFinal)) {
    if (v.history.length > 1) {
      const first = v.history[0];
      const last = v.history[v.history.length - 1];
      if (first !== last) {
        revisions.push({
          ts: now,
          type: "qty",
          label: name,
          from: `${first} ${name}`,
          to: `${last} ${name}`,
          text: `${name}: ${first} → ${last}`,
        });
      }
    } else if (v.history.length === 1 && v.firstSeen > 0) {
      revisions.push({
        ts: now,
        type: "add",
        label: name,
        to: `${v.qty} ${name}`,
        text: `Ditambahkan: ${v.qty} ${name}`,
      });
    }
  }

  if (timeHistory.length > 1 && timeHistory[0] !== timeHistory[timeHistory.length - 1]) {
    revisions.push({
      ts: now,
      type: "time",
      label: "Jam Pengambilan",
      from: timeHistory[0],
      to: timeHistory[timeHistory.length - 1],
      text: `Waktu: ${timeHistory[0]} → ${timeHistory[timeHistory.length - 1]}`,
    });
  }

  if (fulfillmentHistory.length > 1 && fulfillmentHistory[0] !== fulfillmentHistory[fulfillmentHistory.length - 1]) {
    const label = (f: FulfillmentType) => (f === "pickup" ? "Ambil Sendiri" : "Antar");
    revisions.push({
      ts: now,
      type: "fulfillment",
      label: "Metode",
      from: label(fulfillmentHistory[0]),
      to: label(fulfillmentHistory[fulfillmentHistory.length - 1]),
      text: `Metode: ${label(fulfillmentHistory[0])} → ${label(fulfillmentHistory[fulfillmentHistory.length - 1])}`,
    });
  }

  return revisions;
}

function buildLegacyRevisions(structured: StructuredRevision[]): Revision[] {
  return structured.map((r) => ({
    ts: r.ts,
    type: r.type,
    text: r.text,
  }));
}

function computeConfidences(
  chat: string,
  items: OrderItem[],
  fulfillment: "pickup" | "delivery",
  time?: string,
  structuredRevisions: StructuredRevision[] = [],
): { overall: number; reason: string; fields: FieldConfidence[] } {
  const fields: FieldConfidence[] = [];

  if (items.length > 0) {
    const explicitQty = items.every((it) => /\d/.test(chat) && chat.toLowerCase().includes(it.name.toLowerCase().split(" ")[1] ?? it.name.toLowerCase()));
    const itemConf = explicitQty ? 94 : 78;
    fields.push({
      field: "Item Pesanan",
      confidence: itemConf,
      reason: explicitQty
        ? "Menu dan jumlah disebutkan secara eksplisit dalam chat."
        : "Menu terdeteksi dari kata kunci, jumlah menggunakan default.",
    });
  } else {
    fields.push({
      field: "Item Pesanan",
      confidence: 35,
      reason: "Tidak ada menu yang cocok dengan katalog Sate Pak Mail.",
    });
  }

  const qtyRevisions = structuredRevisions.filter((r) => r.type === "qty").length;
  if (qtyRevisions > 0) {
    fields.push({
      field: "Revisi Jumlah",
      confidence: 96,
      reason: "Jumlah pesanan disebut secara eksplisit dan direvisi minimal satu kali.",
    });
  }

  fields.push({
    field: "Metode Pengambilan",
    confidence: /(ambil|antar|pickup|delivery)/i.test(chat) ? 92 : 75,
    reason: /(ambil|antar|pickup|delivery)/i.test(chat)
      ? "Metode ambil/antar disebutkan jelas oleh pelanggan."
      : "Metode default ambil sendiri karena tidak ada indikasi antar.",
  });

  if (time) {
    fields.push({
      field: "Waktu",
      confidence: /(\d{1,2})[:.](\d{2})|jam\s*\d/i.test(chat) ? 95 : 88,
      reason: "Waktu pengambilan diekstrak dari format jam dalam percakapan.",
    });
  } else {
    fields.push({
      field: "Waktu",
      confidence: 45,
      reason: "Waktu pengambilan tidak disebutkan dalam chat.",
    });
  }

  const fieldAvg =
    fields.length > 0 ? fields.reduce((s, f) => s + f.confidence, 0) / fields.length : 50;
  const overall = Math.min(99, Math.round(fieldAvg));

  const reason =
    qtyRevisions > 0
      ? "Jumlah pesanan disebut secara eksplisit dan direvisi satu kali."
      : items.length > 0
        ? "Pesanan terstruktur dengan menu dan metode yang jelas."
        : "Analisis terbatas — periksa kembali teks chat.";

  return { overall, reason, fields };
}

export function analyzeChat(chat: string): AnalysisResult {
  const text = chat.toLowerCase();
  const now = new Date().toISOString();

  const nameMatch =
    chat.match(/nama[:\s]+([A-Za-z]+)/i) ||
    chat.match(/saya\s+([A-Za-z]+)/i) ||
    chat.match(/atas nama\s+([A-Za-z]+)/i);
  const phoneMatch =
    chat.match(/(\+?62[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/) ||
    chat.match(/(08\d{2}[\s-]?\d{3,4}[\s-]?\d{3,4})/);

  const { itemFinal } = parseItemsFromChat(chat);
  const items: OrderItem[] = Object.entries(itemFinal).map(([name, v]) => ({
    name,
    qty: v.qty,
    price: PRICES[name] ?? 0,
  }));

  const fulfillmentHistory = parseFulfillmentHistory(chat);
  const fulfillment = fulfillmentHistory[fulfillmentHistory.length - 1] ?? "pickup";

  const timeHistory = parseTimeHistory(chat);
  const finalTime = timeHistory[timeHistory.length - 1];

  const addrMatch = chat.match(/alamat[:\s]+([^\n]+)/i) || chat.match(/(jl\.?\s+[^\n,]+)/i);

  const payment = /transfer|bca|mandiri|bni|bri/i.test(text)
    ? "Transfer"
    : /qris/i.test(text)
      ? "QRIS"
      : "Cash";
  const paymentStatus = /(sudah transfer|lunas|paid|sudah bayar)/i.test(text)
    ? "Paid"
    : /(nanti bayar|cod|bayar di tempat)/i.test(text)
      ? "Pending"
      : "Pending";

  const structuredRevisions = buildStructuredRevisions(itemFinal, timeHistory, fulfillmentHistory, now);
  const revisions = buildLegacyRevisions(structuredRevisions);
  const total = items.reduce((s, it) => s + it.qty * it.price, 0);

  const { overall, reason, fields } = computeConfidences(
    chat,
    items,
    fulfillment,
    finalTime,
    structuredRevisions,
  );

  const notes = structuredRevisions.length
    ? `${structuredRevisions.length} revisi terdeteksi. Gunakan jumlah final untuk dapur.`
    : "Pesanan tanpa revisi. Langsung proses sesuai item.";

  return {
    customer: nameMatch?.[1] ?? "Pelanggan",
    phone: phoneMatch?.[1] ?? "—",
    fulfillment,
    items,
    pickupTime: fulfillment === "pickup" ? finalTime : undefined,
    deliveryTime: fulfillment === "delivery" ? finalTime : undefined,
    deliveryAddress: fulfillment === "delivery" ? addrMatch?.[1]?.trim() : undefined,
    payment,
    paymentStatus,
    revisions,
    structuredRevisions,
    total,
    rawSummary: `${items.length} item, ${revisions.length} revisi terdeteksi`,
    confidence: overall,
    confidenceReason: reason,
    fieldConfidences: fields,
    notes,
    status: "Siap Diproses",
  };
}

export async function analyzeChatWithSteps(
  chat: string,
  onStep: (step: ExtractionStep) => void,
): Promise<AnalysisResult> {
  const steps: ExtractionStep[] = [
    { id: "tokenize", label: "Membaca baris percakapan", status: "pending" },
    { id: "items", label: "Mengekstrak menu dan jumlah", status: "pending" },
    { id: "revisions", label: "Mendeteksi revisi pesanan", status: "pending" },
    { id: "fulfillment", label: "Menentukan metode ambil/antar", status: "pending" },
    { id: "time", label: "Mengekstrak waktu pengambilan", status: "pending" },
    { id: "confidence", label: "Menghitung tingkat kepercayaan AI", status: "pending" },
  ];

  const runStep = async (idx: number, detail?: string) => {
    steps[idx] = { ...steps[idx], status: "running", detail };
    onStep({ ...steps[idx] });
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    steps[idx] = { ...steps[idx], status: "done", detail };
    onStep({ ...steps[idx] });
  };

  await runStep(0, `${chat.split(/\n+/).filter(Boolean).length} baris diproses`);

  const { itemFinal } = parseItemsFromChat(chat);
  await runStep(1, `${Object.keys(itemFinal).length} menu terdeteksi`);

  const timeHistory = parseTimeHistory(chat);
  const fulfillmentHistory = parseFulfillmentHistory(chat);
  const structured = buildStructuredRevisions(itemFinal, timeHistory, fulfillmentHistory, new Date().toISOString());
  await runStep(2, `${structured.length} revisi ditemukan`);

  await runStep(3, fulfillmentHistory[fulfillmentHistory.length - 1] === "pickup" ? "Ambil Sendiri" : "Antar");

  await runStep(4, timeHistory[timeHistory.length - 1] ?? "Tidak ada waktu");

  const result = analyzeChat(chat);
  await runStep(5, `${result.confidence}% kepercayaan`);

  return result;
}

export const SAMPLE_CHAT = `Pak pesan 20 sate ayam
Tambah 5 lontong
Sate ayamnya jadi 25 ya
Ambil jam 7 malam`;

export const SAMPLE_CHAT_FULL = `Customer: Halo Pak Mail, saya Budi mau pesan sate ayam 20 tusuk
Sate Pak Mail: Baik Pak Budi, untuk kapan?
Customer: Hari ini, saya ambil jam 18:00
Sate Pak Mail: Siap, ada tambahan?
Customer: Tambah lontong 5 ya
Customer: Eh maaf, sate ayamnya jadi 25 saja
Sate Pak Mail: Baik, total Rp 665.000. Pembayaran?
Customer: Transfer BCA, nanti saya kirim bukti
Customer: Oh ya, jadinya ambil jam 19:00 saja ya pak
Sate Pak Mail: Oke siap, ditunggu jam 19:00. No HP saya catat 0812-3456-7890`;

export { MENU_KEYWORDS, PRICES };

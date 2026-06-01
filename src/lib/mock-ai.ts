import type { Order, OrderItem, Revision } from "./mock-data";

export type AnalysisResult = Omit<Order, "id" | "status" | "createdAt"> & {
  rawSummary: string;
};

const MENU_KEYWORDS: Record<string, string> = {
  "sate ayam": "Sate Ayam",
  "sate kambing": "Sate Kambing",
  "lontong": "Lontong",
  "teh manis": "Teh Manis",
  "es teh": "Es Teh",
  "jeruk hangat": "Jeruk Hangat",
  "jeruk anget": "Jeruk Hangat",
};

const PRICES: Record<string, number> = {
  "Sate Ayam": 25000,
  "Sate Kambing": 35000,
  "Lontong": 8000,
  "Teh Manis": 5000,
  "Es Teh": 6000,
  "Jeruk Hangat": 8000,
};

export function analyzeChat(chat: string): AnalysisResult {
  const text = chat.toLowerCase();

  // customer + phone
  const nameMatch = chat.match(/nama[:\s]+([A-Z][a-zA-Z]+)/i) ||
    chat.match(/saya\s+([A-Z][a-zA-Z]+)/) ||
    chat.match(/atas nama\s+([A-Z][a-zA-Z]+)/i);
  const phoneMatch = chat.match(/(\+?62[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/) ||
    chat.match(/(08\d{2}[\s-]?\d{3,4}[\s-]?\d{3,4})/);

  // items — track qty changes
  const itemFinal: Record<string, { qty: number; history: number[] }> = {};
  const lines = chat.split(/\n+/);

  for (const line of lines) {
    const l = line.toLowerCase();
    for (const [kw, canonical] of Object.entries(MENU_KEYWORDS)) {
      if (l.includes(kw)) {
        // find number nearest to keyword
        const re = new RegExp(`(\\d{1,3})\\s*(?:porsi|tusuk|pcs|buah|gelas|x)?\\s*${kw.replace(" ", "\\s+")}|${kw.replace(" ", "\\s+")}\\s*(?:jadi|=|:)?\\s*(\\d{1,3})`, "i");
        const m = l.match(re);
        const n = m ? parseInt(m[1] || m[2], 10) : null;
        if (n && n > 0) {
          if (!itemFinal[canonical]) itemFinal[canonical] = { qty: n, history: [n] };
          else {
            itemFinal[canonical].history.push(n);
            itemFinal[canonical].qty = n; // latest wins
          }
        } else if (!itemFinal[canonical]) {
          itemFinal[canonical] = { qty: 1, history: [1] };
        }
      }
    }
  }

  const items: OrderItem[] = Object.entries(itemFinal).map(([name, v]) => ({
    name,
    qty: v.qty,
    price: PRICES[name] ?? 0,
  }));

  // fulfillment
  const isDelivery = /(antar|delivery|kirim|diantar|gojek|grab)/i.test(text);
  const isPickup = /(ambil|pickup|takeaway|jemput|saya ambil)/i.test(text);
  const fulfillment: "pickup" | "delivery" = isDelivery && !isPickup ? "delivery" : "pickup";

  // time
  const timeMatches = [...chat.matchAll(/(\d{1,2})[:.](\d{2})/g)].map((m) =>
    `${m[1].padStart(2, "0")}:${m[2]}`
  );
  const finalTime = timeMatches[timeMatches.length - 1];

  // address
  const addrMatch = chat.match(/alamat[:\s]+([^\n]+)/i) || chat.match(/(jl\.?\s+[^\n,]+)/i);

  // payment
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

  // revisions
  const revisions: Revision[] = [];
  const now = new Date().toISOString();
  for (const [name, v] of Object.entries(itemFinal)) {
    if (v.history.length > 1) {
      const first = v.history[0];
      const last = v.history[v.history.length - 1];
      if (first !== last) {
        revisions.push({ ts: now, type: "qty", text: `${name}: ${first} → ${last}` });
      }
    }
  }
  if (timeMatches.length > 1 && timeMatches[0] !== timeMatches[timeMatches.length - 1]) {
    revisions.push({
      ts: now,
      type: "time",
      text: `Waktu ${fulfillment}: ${timeMatches[0]} → ${timeMatches[timeMatches.length - 1]}`,
    });
  }
  if (isDelivery && isPickup) {
    revisions.push({
      ts: now,
      type: "fulfillment",
      text: `Fulfillment: Pickup → Delivery`,
    });
  }

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);

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
    total,
    rawSummary: `${items.length} item, ${revisions.length} revisi terdeteksi`,
  };
}

export const SAMPLE_CHAT = `Customer: Halo Pak Mail, saya Budi mau pesan sate ayam 20 tusuk
Sate Pak Mail: Baik Pak Budi, untuk kapan?
Customer: Hari ini, saya ambil jam 18:00
Sate Pak Mail: Siap, ada tambahan?
Customer: Tambah lontong 5 ya
Customer: Eh maaf, sate ayamnya jadi 25 saja
Sate Pak Mail: Baik, total Rp 665.000. Pembayaran?
Customer: Transfer BCA, nanti saya kirim bukti
Customer: Oh ya, jadinya ambil jam 19:00 saja ya pak
Sate Pak Mail: Oke siap, ditunggu jam 19:00. No HP saya catat 0812-3456-7890`;

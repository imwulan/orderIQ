export type FulfillmentType = "pickup" | "delivery";

export type OrderItem = { name: string; qty: number; price: number; note?: string };

export type Revision = {
  ts: string;
  type: "qty" | "add" | "remove" | "time" | "fulfillment" | "address";
  text: string;
};

export type Order = {
  id: string;
  customer: string;
  phone: string;
  fulfillment: FulfillmentType;
  items: OrderItem[];
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  payment: "Transfer" | "Cash" | "QRIS";
  paymentStatus: "Paid" | "Unpaid" | "Pending";
  status: "Ready for Preparation" | "In Progress" | "Completed";
  revisions: Revision[];
  total: number;
  createdAt: string; // ISO
  notes?: string;
};

const MENU = [
  { name: "Sate Ayam", price: 25000 },
  { name: "Sate Kambing", price: 35000 },
  { name: "Lontong", price: 8000 },
  { name: "Teh Manis", price: 5000 },
  { name: "Es Teh", price: 6000 },
  { name: "Jeruk Hangat", price: 8000 },
];

const NAMES = [
  "Budi", "Siti", "Andi", "Rina", "Dewi", "Agus", "Putri", "Eka", "Yusuf", "Wulan",
  "Hadi", "Maya", "Rangga", "Indah", "Bayu", "Lestari", "Fajar", "Nina", "Tono", "Sari",
  "Dimas", "Citra", "Joko", "Anggun", "Reza", "Tika", "Galih", "Mira", "Hendra", "Ayu",
];

const ADDRESSES = [
  "Jl. Mawar No. 12, Jakarta",
  "Jl. Melati No. 7, Bandung",
  "Perum Griya Asri Blok C2",
  "Jl. Sudirman No. 88",
  "Apartemen Casablanca Tower 3",
  "Jl. Anggrek No. 4",
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateOrders(count = 120): Order[] {
  const rand = seedRand(42);
  const orders: Order[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isPickup = rand() < 0.82; // pickup dominance
    const itemCount = 1 + Math.floor(rand() * 4);
    const items: OrderItem[] = [];
    const picked = new Set<number>();
    for (let j = 0; j < itemCount; j++) {
      let idx = Math.floor(rand() * MENU.length);
      while (picked.has(idx)) idx = (idx + 1) % MENU.length;
      picked.add(idx);
      const m = MENU[idx];
      const qty = m.name.startsWith("Sate")
        ? 5 + Math.floor(rand() * 25)
        : 1 + Math.floor(rand() * 6);
      items.push({ name: m.name, qty, price: m.price });
    }
    const total = items.reduce((s, it) => s + it.qty * it.price, 0);

    const revisions: Revision[] = [];
    const revCount = rand() < 0.55 ? 1 + Math.floor(rand() * 3) : 0;
    for (let r = 0; r < revCount; r++) {
      const t = rand();
      if (t < 0.5 && items.length > 0) {
        const it = items[Math.floor(rand() * items.length)];
        const oldQ = Math.max(1, it.qty - (2 + Math.floor(rand() * 5)));
        revisions.push({
          ts: new Date(now - i * 3600_000 + r * 60_000).toISOString(),
          type: "qty",
          text: `${it.name}: ${oldQ} → ${it.qty}`,
        });
      } else if (t < 0.75) {
        revisions.push({
          ts: new Date(now - i * 3600_000 + r * 60_000).toISOString(),
          type: "add",
          text: `Added: ${1 + Math.floor(rand() * 3)} Lontong`,
        });
      } else if (t < 0.9) {
        revisions.push({
          ts: new Date(now - i * 3600_000 + r * 60_000).toISOString(),
          type: "time",
          text: `Waktu ${isPickup ? "pickup" : "antar"}: 18:00 → 19:00`,
        });
      } else {
        revisions.push({
          ts: new Date(now - i * 3600_000 + r * 60_000).toISOString(),
          type: "fulfillment",
          text: `Fulfillment: ${isPickup ? "Delivery → Pickup" : "Pickup → Delivery"}`,
        });
      }
    }

    // Bias hours toward 17-20
    const peak = rand() < 0.62;
    const hour = peak ? 17 + Math.floor(rand() * 4) : 10 + Math.floor(rand() * 11);
    const minute = Math.floor(rand() * 60);
    const day = Math.floor(rand() * 30);
    const createdAt = new Date(now - day * 86400_000 - (24 - hour) * 3600_000).toISOString();
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    orders.push({
      id: `ORD-${String(1000 + i)}`,
      customer: NAMES[Math.floor(rand() * NAMES.length)],
      phone: `+62 812-${String(Math.floor(rand() * 9000) + 1000)}-${String(Math.floor(rand() * 9000) + 1000)}`,
      fulfillment: isPickup ? "pickup" : "delivery",
      items,
      pickupTime: isPickup ? time : undefined,
      deliveryAddress: !isPickup ? ADDRESSES[Math.floor(rand() * ADDRESSES.length)] : undefined,
      deliveryTime: !isPickup ? time : undefined,
      payment: rand() < 0.55 ? "Transfer" : rand() < 0.8 ? "QRIS" : "Cash",
      paymentStatus: rand() < 0.7 ? "Paid" : rand() < 0.9 ? "Pending" : "Unpaid",
      status: rand() < 0.6 ? "Completed" : rand() < 0.85 ? "In Progress" : "Ready for Preparation",
      revisions,
      total,
      createdAt,
    });
  }
  return orders.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export const ORDERS = generateOrders(120);

export function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

import type { AnalysisRecord, ComputedInsight } from "./types";

function countMenu(records: AnalysisRecord[]) {
  const counts: Record<string, number> = {};
  for (const r of records) {
    for (const item of r.result.items) {
      counts[item.name] = (counts[item.name] ?? 0) + item.qty;
    }
  }
  return counts;
}

function revisionHourBucket(records: AnalysisRecord[]) {
  const buckets: Record<string, number> = { pagi: 0, siang: 0, sore: 0, malam: 0 };
  for (const r of records) {
    if (r.result.revisions.length === 0) continue;
    const hour = new Date(r.analyzedAt).getHours();
    if (hour < 11) buckets.pagi++;
    else if (hour < 15) buckets.siang++;
    else if (hour < 18) buckets.sore++;
    else buckets.malam++;
  }
  return buckets;
}

export function computeInsights(records: AnalysisRecord[]): ComputedInsight[] {
  if (records.length === 0) {
    return [
      {
        id: "empty",
        category: "Data",
        title: "Belum ada data analisis",
        description: "Analisis chat terlebih dahulu atau muat dataset demo untuk melihat insight.",
      },
    ];
  }

  const insights: ComputedInsight[] = [];
  const pickupCount = records.filter((r) => r.result.fulfillment === "pickup").length;
  const pickupPct = Math.round((pickupCount / records.length) * 100);
  insights.push({
    id: "pickup",
    category: "Perilaku",
    title: `${pickupPct}% pelanggan memilih ambil sendiri`,
    description: "Mayoritas pelanggan UMKM kuliner mengambil pesanan langsung, bukan delivery.",
    value: `${pickupPct}%`,
  });

  const menuCounts = countMenu(records);
  const topMenu = Object.entries(menuCounts).sort((a, b) => b[1] - a[1])[0];
  if (topMenu) {
    insights.push({
      id: "top-menu",
      category: "Menu",
      title: `Menu paling sering dipesan adalah ${topMenu[0]}`,
      description: `Total ${topMenu[1]} porsi terdeteksi dari ${records.length} analisis tersimpan.`,
      value: topMenu[0],
    });
  }

  const lontongOrders = records.filter((r) => r.result.items.some((i) => i.name === "Lontong"));
  const sateKambingWithLontong = records.filter(
    (r) =>
      r.result.items.some((i) => i.name === "Sate Kambing") &&
      r.result.items.some((i) => i.name === "Lontong"),
  );
  if (sateKambingWithLontong.length > 0 && lontongOrders.length > 0) {
    const pct = Math.round((sateKambingWithLontong.length / lontongOrders.length) * 100);
    insights.push({
      id: "bundle",
      category: "Pola",
      title: `${pct}% order lontong menyertakan sate kambing`,
      description: "Pelanggan cenderung menambahkan lontong saat memesan sate kambing.",
      value: `${pct}%`,
    });
  }

  const buckets = revisionHourBucket(records);
  const peakBucket = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
  if (peakBucket && peakBucket[1] > 0) {
    const labelMap: Record<string, string> = {
      pagi: "pagi hari (06.00–11.00)",
      siang: "siang hari (11.00–15.00)",
      sore: "sore hari (15.00–18.00)",
      malam: "malam hari (18.00–22.00)",
    };
    insights.push({
      id: "revision-time",
      category: "Revisi",
      title: `Sebagian besar revisi pesanan terjadi pada ${labelMap[peakBucket[0]]}`,
      description: `${peakBucket[1]} dari ${records.filter((r) => r.result.revisions.length > 0).length || 1} order dengan revisi terjadi di periode ini.`,
      value: peakBucket[0],
    });
  }

  const withRevisions = records.filter((r) => r.result.revisions.length > 0).length;
  const revisionPct = Math.round((withRevisions / records.length) * 100);
  insights.push({
    id: "revision-rate",
    category: "Revisi",
    title: `${revisionPct}% pesanan mengalami revisi`,
    description: "Pelanggan sering mengubah jumlah atau menambah menu sebelum pesanan final.",
    value: `${revisionPct}%`,
  });

  const avgItems = records.reduce((s, r) => s + r.result.items.length, 0) / records.length;
  insights.push({
    id: "avg-items",
    category: "Operasional",
    title: `Rata-rata pesanan berisi ${avgItems.toFixed(1)} item`,
    description: "Membantu estimasi persiapan bahan dan waktu packing per order.",
    value: avgItems.toFixed(1),
  });

  const avgConfidence = Math.round(
    records.reduce((s, r) => s + r.result.confidence, 0) / records.length,
  );
  insights.push({
    id: "confidence",
    category: "AI",
    title: `Rata-rata kepercayaan ekstraksi AI: ${avgConfidence}%`,
    description: "Skor dihitung dari kejelasan menu, revisi, metode, dan waktu dalam chat.",
    value: `${avgConfidence}%`,
  });

  return insights;
}

export function computeMenuStats(records: AnalysisRecord[]) {
  const counts = countMenu(records);
  return Object.entries(counts)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);
}

export function computeFulfillmentStats(records: AnalysisRecord[]) {
  const pickup = records.filter((r) => r.result.fulfillment === "pickup").length;
  const delivery = records.length - pickup;
  return [
    { name: "Ambil Sendiri", value: pickup },
    { name: "Antar", value: delivery },
  ];
}

export function computeRevisionByHour(records: AnalysisRecord[]) {
  const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, revisions: 0 }));
  for (const r of records) {
    if (r.result.revisions.length === 0) continue;
    const h = new Date(r.analyzedAt).getHours();
    hours[h].revisions++;
  }
  return hours.filter((h) => {
    const hourNum = parseInt(h.hour, 10);
    return hourNum >= 15 && hourNum <= 21;
  });
}

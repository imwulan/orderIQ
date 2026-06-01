import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  TrendingUp,
  Clock,
  ShoppingBag,
  GitBranch,
  Calendar,
  Coins,
  Brain,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ORDERS } from "@/lib/mock-data";
import { useMemo } from "react";

export const Route = createFileRoute("/app/insights")({
  head: () => ({ meta: [{ title: "Insights · OrderIQ" }] }),
  component: Insights,
});

function Insights() {
  const insights = [
    {
      icon: ShoppingBag,
      tag: "Behavior",
      title: "82% pelanggan memilih pickup",
      desc: "Mayoritas pelanggan ambil sendiri. Pertimbangkan optimasi area pickup dan parkir motor.",
      color: "text-primary",
    },
    {
      icon: GitBranch,
      tag: "Order pattern",
      title: "Pelanggan sering tambah lontong",
      desc: "63% order besar termasuk lontong sebagai tambahan. Siapkan stok ekstra di jam ramai.",
      color: "text-chart-3",
    },
    {
      icon: Clock,
      tag: "Peak hours",
      title: "Aktivitas tertinggi 17:00–20:00",
      desc: "Alokasikan tukang bakar tambahan dan kasir kedua selama jendela 3 jam ini.",
      color: "text-chart-2",
    },
    {
      icon: Coins,
      tag: "Revenue",
      title: "Sate Ayam penyumbang revenue terbesar",
      desc: "Kontribusi 54% dari total revenue. Promo bundling Sate Ayam + Lontong potensial.",
      color: "text-chart-4",
    },
    {
      icon: GitBranch,
      tag: "Revisions",
      title: "55% pelanggan mengubah pesanan",
      desc: "Pelanggan kerap menaikkan kuantitas sebelum konfirmasi. AI revisi menghindari salah catat.",
      color: "text-chart-5",
    },
    {
      icon: Calendar,
      tag: "Seasonality",
      title: "Sabtu malam puncak mingguan",
      desc: "Order pickup Sabtu 70% lebih tinggi dari rata-rata weekday. Tambah persiapan bumbu.",
      color: "text-primary",
    },
  ];

  const menuRevenue = useMemo(() => {
    const m: Record<string, number> = {};
    ORDERS.forEach((o) => o.items.forEach((it) => (m[it.name] = (m[it.name] || 0) + it.qty * it.price)));
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const weekday = useMemo(() => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const arr = days.map((d) => ({ day: d, orders: 0 }));
    ORDERS.forEach((o) => arr[new Date(o.createdAt).getDay()].orders++);
    return arr;
  }, []);

  const recommendations = [
    {
      icon: Brain,
      title: "Siapkan ekstra lontong di jam sibuk",
      body: "63% order besar memuat lontong. Pre-prep 2× porsi normal antara 17:00–19:30.",
    },
    {
      icon: Brain,
      title: "Atur shift pickup khusus 18:00–19:00",
      body: "Sebagian besar pelanggan pickup datang di window ini. Tugaskan 1 staf khusus serah-terima.",
    },
    {
      icon: Brain,
      title: "Promo bundle Sate Ayam + Lontong",
      body: "Kombinasi ini menyumbang revenue tertinggi. Bundle hemat dapat menaikkan AOV 12–18%.",
    },
    {
      icon: Brain,
      title: "Aktifkan pre-order Sabtu sore",
      body: "Sabtu malam jadi peak mingguan. Buka slot pre-order H-1 untuk meratakan beban dapur.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">AI Business Insights</h1>
          <p className="text-sm text-muted-foreground">
            Wawasan operasional otomatis dari semua percakapan & order yang dianalisis
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Lightbulb className="h-3 w-3 text-primary" />
          {insights.length} insights baru
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((i) => (
          <Card key={i.title} className="group transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ${i.color}`}>
                  <i.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  {i.tag}
                </Badge>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold leading-snug">
                {i.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" /> Revenue per menu
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={menuRevenue} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  formatter={(v: number) => "Rp " + v.toLocaleString("id-ID")}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {menuRevenue.map((_, i) => (
                    <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Order per hari
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="orders" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-chart-1)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Operational recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((r) => (
            <div key={r.title} className="flex gap-4 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <r.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{r.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Bike,
  GitBranch,
  TrendingUp,
  Clock,
  Receipt,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ORDERS, formatIDR } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard · OrderIQ" }] }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useMemo(() => {
    const total = ORDERS.length;
    const pickup = ORDERS.filter((o) => o.fulfillment === "pickup").length;
    const delivery = total - pickup;
    const revenue = ORDERS.reduce((s, o) => s + o.total, 0);
    const avg = revenue / total;
    const revised = ORDERS.filter((o) => o.revisions.length > 0).length;
    const counts: Record<string, number> = {};
    ORDERS.forEach((o) => o.items.forEach((it) => (counts[it.name] = (counts[it.name] || 0) + it.qty)));
    const topMenu = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    const hours: Record<number, number> = {};
    ORDERS.forEach((o) => {
      const h = new Date(o.createdAt).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });
    const peakHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      pickup,
      delivery,
      revenue,
      avg,
      revised,
      topMenu: topMenu?.[0] ?? "—",
      peakHour: peakHour ? `${peakHour[0]}:00` : "—",
      revisionRate: Math.round((revised / total) * 100),
    };
  }, []);

  const trend = useMemo(() => {
    const map = new Map<string, { day: string; orders: number; revenue: number }>();
    [...ORDERS].reverse().forEach((o) => {
      const d = new Date(o.createdAt);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      const cur = map.get(key) ?? { day: key, orders: 0, revenue: 0 };
      cur.orders += 1;
      cur.revenue += o.total;
      map.set(key, cur);
    });
    return Array.from(map.values()).slice(-14);
  }, []);

  const hourly = useMemo(() => {
    const arr = Array.from({ length: 14 }, (_, i) => ({ hour: `${i + 9}`, orders: 0 }));
    ORDERS.forEach((o) => {
      const h = new Date(o.createdAt).getHours();
      const idx = h - 9;
      if (idx >= 0 && idx < arr.length) arr[idx].orders += 1;
    });
    return arr;
  }, []);

  const fulfillmentData = [
    { name: "Pickup", value: stats.pickup, color: "var(--color-chart-1)" },
    { name: "Delivery", value: stats.delivery, color: "var(--color-chart-2)" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan operasional Sate Pak Mail · 30 hari terakhir
          </p>
        </div>
        <Button asChild>
          <Link to="/analyze">
            <Sparkles className="mr-1.5 h-4 w-4" /> Analisis Chat Baru
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total Orders" value={stats.total.toString()} icon={Receipt} accent="text-primary" />
        <Kpi label="Pickup Orders" value={stats.pickup.toString()} sub={`${Math.round((stats.pickup / stats.total) * 100)}%`} icon={ShoppingBag} accent="text-chart-1" />
        <Kpi label="Delivery Orders" value={stats.delivery.toString()} sub={`${Math.round((stats.delivery / stats.total) * 100)}%`} icon={Bike} accent="text-chart-2" />
        <Kpi label="Avg Order Value" value={formatIDR(Math.round(stats.avg))} icon={TrendingUp} accent="text-chart-3" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Orders & Revenue</CardTitle>
              <p className="text-xs text-muted-foreground">14 hari terakhir</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> Tren naik
            </Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="orders" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pickup vs Delivery</CardTitle>
            <p className="text-xs text-muted-foreground">Dominasi pickup</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fulfillmentData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {fulfillmentData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-5 text-xs">
              {fulfillmentData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name} · {d.value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Peak Ordering Hours</CardTitle>
            <p className="text-xs text-muted-foreground">Jumlah order per jam</p>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="orders" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <MiniStat title="Most Ordered" value={stats.topMenu} icon={ShoppingBag} note="Bulan ini" />
          <MiniStat title="Peak Hour" value={stats.peakHour} icon={Clock} note="Jam tersibuk" />
          <MiniStat title="Order Revision Rate" value={`${stats.revisionRate}%`} icon={GitBranch} note="Pelanggan ubah pesanan" />
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/orders">
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {ORDERS.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center gap-4 py-3 text-sm">
                <div className="font-mono text-xs text-muted-foreground">{o.id}</div>
                <div className="flex-1">
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.items.map((it) => `${it.qty}× ${it.name}`).join(" · ")}
                  </div>
                </div>
                <Badge variant={o.fulfillment === "pickup" ? "default" : "secondary"} className="uppercase">
                  {o.fulfillment}
                </Badge>
                <div className="hidden text-right sm:block">
                  <div className="font-medium">{formatIDR(o.total)}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.revisions.length > 0 ? `${o.revisions.length} revisi` : "tidak ada revisi"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <Icon className={`h-4 w-4 ${accent}`} />
        </div>
        <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function MiniStat({
  title,
  value,
  icon: Icon,
  note,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  note: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
          <div className="truncate font-display text-lg font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground">{note}</div>
        </div>
      </CardContent>
    </Card>
  );
}

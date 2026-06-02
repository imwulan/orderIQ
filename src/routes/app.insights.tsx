import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  ShoppingBag,
  GitBranch,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  computeInsights,
  computeMenuStats,
  computeFulfillmentStats,
} from "@/lib/insights-engine";
import { getAnalysisHistory, initOrderStorage, seedDemoDataset } from "@/lib/order-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/app/insights")({
  head: () => ({ meta: [{ title: "Insight Bisnis · OrderIQ" }] }),
  component: Insights,
});

function Insights() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initOrderStorage();
  }, []);

  const records = useMemo(() => getAnalysisHistory(), [refreshKey]);
  const insights = useMemo(() => computeInsights(records), [records]);
  const menuStats = useMemo(() => computeMenuStats(records), [records]);
  const fulfillmentStats = useMemo(() => computeFulfillmentStats(records), [records]);

  function handleRefreshData() {
    seedDemoDataset(true);
    setRefreshKey((k) => k + 1);
    toast.success("Dataset demo dimuat ulang (100 order)");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Insight Bisnis AI</h1>
          <p className="text-sm text-muted-foreground">
            Wawasan dihitung dari {records.length} analisis tersimpan — bukan angka hardcode.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Lightbulb className="h-3 w-3 text-primary" />
            {insights.length} insight
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Muat Ulang Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((i) => (
          <Card key={i.id} className="transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {i.category === "Revisi" ? (
                    <GitBranch className="h-5 w-5" />
                  ) : i.category === "Menu" ? (
                    <ShoppingBag className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  {i.category}
                </Badge>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold leading-snug">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Menu Paling Dipesan</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {menuStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={menuStats.slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip
                    formatter={(v: number) => `${v} porsi`}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
                    {menuStats.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ambil Sendiri vs Antar</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fulfillmentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

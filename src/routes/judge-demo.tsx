import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { ChatAnalyzer } from "@/components/chat-analyzer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevisionTimeline } from "@/components/revision-timeline";
import { computeInsights } from "@/lib/insights-engine";
import { analyzeChat, SAMPLE_CHAT } from "@/lib/order-analyzer";
import { getAnalysisHistory, getHistoryStats, initOrderStorage } from "@/lib/order-storage";
import { ArrowRight, BrainCircuit, Flame, GitBranch, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/judge-demo")({
  head: () => ({
    meta: [{ title: "Demo Juri · OrderIQ" }],
  }),
  component: JudgeDemoPage,
});

const demoResult = analyzeChat(SAMPLE_CHAT);

function JudgeDemoPage() {
  useEffect(() => {
    initOrderStorage();
  }, []);

  const insights = useMemo(() => computeInsights(getAnalysisHistory()), []);
  const stats = useMemo(() => getHistoryStats(), []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <span className="font-display font-semibold">OrderIQ</span>
              <Badge variant="secondary" className="ml-2 text-[10px]">Mode Juri</Badge>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/analyze">
                Coba Langsung <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        <section className="rounded-3xl border border-border bg-card p-8">
          <Badge className="mb-4">AI Innovation · UMKM Kuliner Indonesia</Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight">
            OrderIQ: AI yang Mengubah Chat WhatsApp Menjadi Operasional Kuliner
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Produk ini dibuat untuk penjual sate, warung, katering, dan UMKM kuliner yang menerima
            pesanan lewat WhatsApp — bukan POS, bukan chatbot, bukan delivery app.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <ProblemCard
            step="1"
            title="Masalah"
            body="Pelanggan mengubah jumlah, menambah menu, dan mengganti jam ambil — semua dalam satu chat panjang."
          />
          <ProblemCard
            step="2"
            title="Solusi AI"
            body="OrderIQ membaca percakapan, mendeteksi revisi, dan menghasilkan pesanan final siap proses."
          />
          <ProblemCard
            step="3"
            title="Hasil"
            body="Kurang salah catat, hemat waktu baca chat, dan dapat insight bisnis dari data pesanan."
          />
        </section>

        <section>
          <SectionTitle icon={BrainCircuit} title="Live Analyzer — Coba Sekarang" />
          <p className="mb-6 text-sm text-muted-foreground">
            Tempel chat di bawah atau gunakan contoh. Analisis menggunakan parser nyata, bukan mock delay.
          </p>
          <ChatAnalyzer compact showHistory={false} />
        </section>

        <section>
          <SectionTitle icon={GitBranch} title="Deteksi Revisi — Fitur Unggulan" />
          <p className="mb-4 text-sm text-muted-foreground">
            Contoh output dari chat: &quot;20 sate ayam → jadi 25&quot; + tambah lontong + jam 7 malam
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">Pesanan Final</span>
                <Badge>{demoResult.confidence}% kepercayaan AI</Badge>
              </div>
              <RevisionTimeline revisions={demoResult.structuredRevisions} />
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionTitle icon={Sparkles} title="Business Insights — Dari Data Nyata" />
          <p className="mb-4 text-sm text-muted-foreground">
            Insight dihitung dari {stats.total} analisis tersimpan (termasuk 100 dataset demo Sate Pak Mail).
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 6).map((insight) => (
              <Card key={insight.id}>
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="w-fit text-[10px]">{insight.category}</Badge>
                  <CardTitle className="text-base leading-snug">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle icon={Target} title="Contoh Use Case" />
          <div className="grid gap-4 md:grid-cols-2">
            {USE_CASES.map((uc) => (
              <Card key={uc.title}>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{uc.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{uc.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const USE_CASES = [
  {
    title: "Penjual Sate di Jam Sibuk",
    body: "15 chat masuk bersamaan. OrderIQ mengekstrak jumlah final tanpa baca ulang setiap thread.",
  },
  {
    title: "Katering Rumahan",
    body: "Pelanggan revisi menu dan waktu ambil. Timeline revisi menunjukkan perubahan secara jelas.",
  },
  {
    title: "Evaluasi Bisnis Mingguan",
    body: "Insight engine menunjukkan menu terlaris, jam revisi, dan persentase ambil sendiri dari data nyata.",
  },
  {
    title: "Screenshot WhatsApp",
    body: "Upload screenshot → OCR ekstrak teks → analisis pesanan. Arsitektur siap integrasi OCR production.",
  },
];

function SectionTitle({ icon: Icon, title }: { icon: typeof BrainCircuit; title: string }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 font-display text-2xl font-semibold">
      <Icon className="h-5 w-5 text-primary" />
      {title}
    </h2>
  );
}

function ProblemCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-2 font-mono text-xs text-primary">Langkah {step}</div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

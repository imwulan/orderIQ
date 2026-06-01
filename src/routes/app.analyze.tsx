import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Upload,
  User,
  Phone,
  Clock,
  MapPin,
  CreditCard,
  GitBranch,
  ChefHat,
  ShoppingBag,
  Bike,
  RefreshCcw,
} from "lucide-react";
import { analyzeChat, SAMPLE_CHAT, type AnalysisResult } from "@/lib/mock-ai";
import { formatIDR } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/analyze")({
  head: () => ({ meta: [{ title: "Analyze Chat · OrderIQ" }] }),
  component: Analyze,
});

function Analyze() {
  const [chat, setChat] = useState(SAMPLE_CHAT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!chat.trim()) {
      toast.error("Tempel percakapan dulu");
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setResult(analyzeChat(chat));
    setLoading(false);
    toast.success("Analisis selesai");
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      toast.info("Screenshot diterima. Demo: gunakan area teks.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Analyze Chat</h1>
        <p className="text-sm text-muted-foreground">
          Tempel chat WhatsApp atau unggah screenshot. AI akan ekstrak order, revisi, & fulfillment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Input Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Tempel chat WhatsApp di sini..."
              className="min-h-[320px] font-mono text-xs"
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-muted/60">
              <Upload className="h-4 w-4" />
              Upload screenshot WhatsApp (PNG/JPG)
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
            <div className="flex gap-2">
              <Button onClick={handleAnalyze} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Analyze
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setChat(SAMPLE_CHAT)}>
                Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {!result && !loading && <EmptyState />}
          {loading && <LoadingState />}
          {result && <ResultPanel result={result} />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">Siap menganalisis</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Klik <span className="font-medium text-foreground">Analyze</span> untuk melihat order yang
        diekstrak dari contoh chat di sebelah kiri.
      </p>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
      <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">AI sedang membaca percakapan...</p>
    </Card>
  );
}

function ResultPanel({ result }: { result: AnalysisResult }) {
  const Fulfill = result.fulfillment === "pickup" ? ShoppingBag : Bike;
  return (
    <div className="space-y-4">
      {/* Hero fulfillment */}
      <Card className="overflow-hidden border-primary/30">
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Fulfill className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Fulfillment
                </div>
                <div className="font-display text-2xl font-semibold uppercase tracking-tight">
                  {result.fulfillment}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Total</div>
              <div className="font-display text-2xl font-semibold tracking-tight">
                {formatIDR(result.total)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow icon={User} label="Nama" value={result.customer} />
            <InfoRow icon={Phone} label="Phone" value={result.phone} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {result.fulfillment === "pickup" ? "Pickup" : "Delivery"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {result.fulfillment === "pickup" ? (
              <InfoRow icon={Clock} label="Waktu pickup" value={result.pickupTime ?? "—"} />
            ) : (
              <>
                <InfoRow icon={MapPin} label="Alamat" value={result.deliveryAddress ?? "—"} />
                <InfoRow icon={Clock} label="Waktu antar" value={result.deliveryTime ?? "—"} />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ChefHat className="h-4 w-4 text-primary" /> Final Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada item terdeteksi.</p>
          ) : (
            <div className="divide-y divide-border">
              {result.items.map((it) => (
                <div key={it.name} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    {it.note && <div className="text-xs text-muted-foreground">{it.note}</div>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-muted-foreground">×{it.qty}</span>
                    <span className="w-28 text-right font-mono">{formatIDR(it.qty * it.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <GitBranch className="h-4 w-4 text-primary" /> Revision Timeline
            <Badge variant="secondary" className="ml-1">
              {result.revisions.length} perubahan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.revisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada revisi terdeteksi.</p>
          ) : (
            <ol className="relative ml-3 space-y-4 border-l border-border pl-5">
              {result.revisions.map((r, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                    <GitBranch className="h-2.5 w-2.5" />
                  </span>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {r.type}
                  </div>
                  <div className="text-sm font-medium">{r.text}</div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-primary" /> Payment & Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Metode</div>
            <div className="mt-1 font-medium">{result.payment}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Status bayar</div>
            <div className="mt-1">
              <Badge
                variant={result.paymentStatus === "Paid" ? "default" : "secondary"}
                className={result.paymentStatus === "Paid" ? "bg-success text-success-foreground" : ""}
              >
                {result.paymentStatus}
              </Badge>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Operasional</div>
            <div className="mt-1">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                Ready for Preparation
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

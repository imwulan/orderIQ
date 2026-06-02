import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { OrderCardPrint } from "@/components/order-card-print";
import { RevisionTimeline } from "@/components/revision-timeline";
import {
  analyzeChatWithSteps,
  SAMPLE_CHAT,
  SAMPLE_CHAT_FULL,
} from "@/lib/order-analyzer";
import { saveAnalysis, getAnalysisHistory } from "@/lib/order-storage";
import { extractTextFromImage } from "@/lib/ocr";
import type { AnalysisRecord, AnalysisResult, ExtractionStep } from "@/lib/types";
import { formatIDR } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  BrainCircuit,
  Check,
  GitBranch,
  Loader2,
  Printer,
  Sparkles,
  Upload,
  History,
} from "lucide-react";

type ChatAnalyzerProps = {
  compact?: boolean;
  showHistory?: boolean;
  defaultChat?: string;
  onAnalyzed?: (record: AnalysisRecord) => void;
};

const STEP_IDS = ["tokenize", "items", "revisions", "fulfillment", "time", "confidence"];

export function ChatAnalyzer({
  compact = false,
  showHistory = true,
  defaultChat = SAMPLE_CHAT,
  onAnalyzed,
}: ChatAnalyzerProps) {
  const [chat, setChat] = useState(defaultChat);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [steps, setSteps] = useState<ExtractionStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>(() => getAnalysisHistory());

  async function handleAnalyze() {
    if (!chat.trim()) {
      toast.error("Tempel percakapan WhatsApp terlebih dahulu");
      return;
    }

    setLoading(true);
    setResult(null);
    setSteps(STEP_IDS.map((id) => ({ id, label: id, status: "pending" as const })));

    try {
      const analysis = await analyzeChatWithSteps(chat, (step) => {
        setSteps((prev) => {
          const idx = prev.findIndex((s) => s.id === step.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = step;
            return next;
          }
          return [...prev, step];
        });
      });

      setResult(analysis);
      const record = saveAnalysis(chat, "manual", analysis);
      setHistory(getAnalysisHistory());
      onAnalyzed?.(record);
      toast.success("Pesanan final siap diproses");
    } catch {
      toast.error("Gagal menganalisis chat");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const ocr = await extractTextFromImage(file);
      setChat(ocr.text);
      setResult(null);
      toast.success(`OCR selesai (${ocr.confidence}% akurasi · ${ocr.provider})`);
    } catch {
      toast.error("Gagal membaca screenshot");
    } finally {
      setOcrLoading(false);
      e.target.value = "";
    }
  }

  function handlePrint() {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    if (!win) {
      toast.error("Izinkan pop-up untuk mencetak");
      return;
    }
    win.document.write(`
      <!DOCTYPE html><html><head><title>Kartu Pesanan OrderIQ</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-mono { font-family: monospace; }
        .divide-y > * + * { border-top: 1px solid #ddd; }
        .py-2 { padding-top: 8px; padding-bottom: 8px; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  const doneSteps = steps.filter((s) => s.status === "done").length;
  const progressPct = loading ? Math.round((doneSteps / STEP_IDS.length) * 100) : result ? 100 : 0;

  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-5"}`}>
      <Card className={compact ? "" : "lg:col-span-2"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Input Percakapan WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={chat}
            onChange={(e) => {
              setChat(e.target.value);
              setResult(null);
            }}
            placeholder="Tempel chat WhatsApp di sini..."
            className="min-h-[280px] font-mono text-sm"
          />

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-muted/60">
            {ocrLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                OCR memproses screenshot...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Unggah screenshot WhatsApp (PNG/JPG)
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={ocrLoading} />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void handleAnalyze()} disabled={loading || ocrLoading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Analisis Pesanan
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setChat(SAMPLE_CHAT)} disabled={loading}>
              Contoh Singkat
            </Button>
            <Button variant="outline" onClick={() => setChat(SAMPLE_CHAT_FULL)} disabled={loading}>
              Contoh Lengkap
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className={compact ? "space-y-4" : "space-y-4 lg:col-span-3"}>
        {(loading || steps.length > 0) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Langkah Ekstraksi AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={progressPct} className="h-2" />
              <div className="space-y-2">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 text-sm">
                    {step.status === "done" ? (
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                    ) : step.status === "running" ? (
                      <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <div className="mt-1 h-3 w-3 rounded-full border border-muted-foreground/40" />
                    )}
                    <div>
                      <div className={step.status === "pending" ? "text-muted-foreground" : "font-medium"}>
                        {stepLabel(step.id)}
                      </div>
                      {step.detail && <div className="text-xs text-muted-foreground">{step.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!result && !loading && (
          <Card className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
            <BrainCircuit className="h-10 w-10 text-primary" />
            <h3 className="mt-4 font-display text-lg font-semibold">Siap Menganalisis</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Tempel chat WhatsApp lalu klik <strong>Analisis Pesanan</strong>. AI akan mengekstrak pesanan final,
              mendeteksi revisi, dan menghasilkan kartu pesanan siap dapur.
            </p>
          </Card>
        )}

        {result && <AnalysisResultPanel result={result} printRef={printRef} onPrint={handlePrint} />}

        {showHistory && history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <History className="h-4 w-4" />
                Riwayat Analisis
                <Badge variant="secondary">{history.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {history.slice(0, 12).map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => {
                      setChat(record.chat);
                      setResult(record.result);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left text-sm transition hover:border-primary/40 hover:bg-muted/40"
                  >
                    <div>
                      <div className="font-medium">{record.result.customer}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(record.analyzedAt).toLocaleString("id-ID")} · {record.result.items.length} item
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {record.result.fulfillment === "pickup" ? "Ambil" : "Antar"}
                      </Badge>
                      {record.result.revisions.length > 0 && (
                        <Badge className="bg-primary/10 text-xs text-primary">
                          {record.result.revisions.length} revisi
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function stepLabel(id: string) {
  const labels: Record<string, string> = {
    tokenize: "Membaca baris percakapan",
    items: "Mengekstrak menu dan jumlah",
    revisions: "Mendeteksi revisi pesanan",
    fulfillment: "Menentukan metode ambil/antar",
    time: "Mengekstrak waktu pengambilan",
    confidence: "Menghitung tingkat kepercayaan AI",
  };
  return labels[id] ?? id;
}

function AnalysisResultPanel({
  result,
  printRef,
  onPrint,
}: {
  result: AnalysisResult;
  printRef: React.RefObject<HTMLDivElement | null>;
  onPrint: () => void;
}) {
  const time = result.fulfillment === "pickup" ? result.pickupTime : result.deliveryTime;
  const method = result.fulfillment === "pickup" ? "Ambil Sendiri" : "Antar";

  return (
    <div className="space-y-4">
      <Card className="border-primary/30">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">Pesanan Final</CardTitle>
            <Badge className="bg-primary text-primary-foreground">{result.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Metode</div>
              <div className="font-semibold">{method}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Waktu</div>
              <div className="font-semibold">{time ?? "—"}</div>
            </div>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border">
            {result.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="font-mono font-semibold">×{item.qty}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Kepercayaan AI</div>
              <div className="font-display text-2xl font-bold text-primary">{result.confidence}%</div>
              <p className="mt-1 text-xs text-muted-foreground">{result.confidenceReason}</p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase text-muted-foreground">Total</div>
              <div className="font-display text-xl font-semibold">{formatIDR(result.total)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <GitBranch className="h-4 w-4 text-primary" />
            Deteksi Revisi
            <Badge variant="secondary">{result.structuredRevisions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RevisionTimeline revisions={result.structuredRevisions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Detail Kepercayaan per Field</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.fieldConfidences.map((fc) => (
            <div key={fc.field} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{fc.field}</span>
                <span className="font-semibold text-primary">{fc.confidence}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{fc.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Kartu Pesanan Dapur</CardTitle>
          <Button size="sm" variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </CardHeader>
        <CardContent>
          <OrderCardPrint ref={printRef} result={result} />
        </CardContent>
      </Card>
    </div>
  );
}

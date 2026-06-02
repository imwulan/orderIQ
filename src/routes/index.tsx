import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeChat, type AnalysisResult } from "@/lib/mock-ai";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Check,
  ChefHat,
  ClipboardList,
  Flame,
  GitBranch,
  HelpCircle,
  Loader2,
  MessageCircleMore,
  Play,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

const LANDING_DEMO_CHAT = `Customer: Pak pesan 20 sate ayam
Customer: Tambah 5 lontong ya
Customer: Eh sate ayamnya jadi 25
Customer: Saya ambil jam 19.00`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrderIQ — AI Operasional WhatsApp untuk UMKM Kuliner" },
      {
        name: "description",
        content:
          "OrderIQ mengubah percakapan WhatsApp yang berantakan menjadi pesanan final siap proses untuk UMKM kuliner Indonesia.",
      },
      { property: "og:title", content: "OrderIQ — AI untuk Pesanan WhatsApp UMKM Kuliner" },
      {
        property: "og:description",
        content:
          "Pahami revisi pesanan, jumlah final, dan jam ambil pelanggan secara otomatis dari chat WhatsApp.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <PainPoints />
      <WhyAI />
      <FounderStory />
      <DemoSection />
      <OutcomeFeatures />
      <InsightExamples />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Flame className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">OrderIQ</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#masalah" className="hover:text-foreground">Masalah</a>
          <a href="#kenapa-ai" className="hover:text-foreground">Kenapa AI</a>
          <a href="#demo" className="hover:text-foreground">Demo</a>
          <a href="#fitur" className="hover:text-foreground">Nilai Nyata</a>
          <a href="#insight" className="hover:text-foreground">Insight AI</a>
        </nav>
        <Button asChild size="sm">
          <Link to="/analyze">
            Coba Demo <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28">
        <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          Dibangun khusus untuk UMKM kuliner Indonesia
        </Badge>
        <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
          Jangan Biarkan Pesanan WhatsApp Berantakan
        </h1>
        <p className="mt-6 max-w-3xl text-balance text-base text-muted-foreground sm:text-lg">
          Pelanggan sering mengubah jumlah pesanan, menambah menu, atau mengganti jam pengambilan.
          OrderIQ menggunakan AI untuk memahami percakapan pelanggan dan menghasilkan pesanan final
          yang siap diproses.
        </p>
        <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link to="/analyze">
              Coba Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
            <a href="#demo">Lihat Cara Kerja</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Tanpa kartu kredit · Pakai contoh chat UMKM kuliner nyata</p>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mt-16">
      <div className="absolute -inset-x-12 -top-8 bottom-0 rounded-[2rem] bg-gradient-to-b from-primary/20 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <div className="ml-3 text-xs text-muted-foreground">Transformasi Chat WhatsApp ke Pesanan Final</div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1.2fr_auto_1fr]">
          <div className="border-b border-border p-5 text-left lg:border-r lg:border-b-0">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <MessageCircleMore className="h-3.5 w-3.5" />
              Percakapan WhatsApp
            </div>
            <div className="space-y-2 text-xs">
              <ChatBubble side="left">Customer: Pak pesan 20 sate ayam</ChatBubble>
              <ChatBubble side="left">Customer: Tambah 5 lontong ya</ChatBubble>
              <ChatBubble side="left">Customer: Eh sate ayamnya jadi 25</ChatBubble>
              <ChatBubble side="left">Customer: Saya ambil jam 7 malam</ChatBubble>
            </div>
          </div>
          <div className="flex items-center justify-center border-b border-border bg-muted/30 p-5 lg:border-r lg:border-b-0">
            <div className="w-full max-w-[220px] rounded-xl border border-primary/30 bg-background p-4 text-center shadow-[0_0_24px_-6px] shadow-primary/25">
              <div className="relative mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BrainCircuit className="h-5 w-5" />
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              </div>
              <div className="text-sm font-semibold">AI Memproses Percakapan</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Memahami revisi, konteks, dan jumlah terbaru.
              </p>
              <div className="mt-3 flex justify-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </div>
            </div>
          </div>
          <div className="p-5 text-left">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ScanSearch className="h-3 w-3 text-primary" />
              Output OrderIQ
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-semibold">Pesanan Final</div>
              <div className="mt-3 space-y-1.5 text-sm">
                <Row label="Sate Ayam" value="25" />
                <Row label="Lontong" value="5" />
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <InfoRow label="Metode" value="Ambil Sendiri" />
                <InfoRow label="Jam Pengambilan" value="19.00" />
                <InfoRow label="Status" value="Siap Diproses" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  return (
    <div className={side === "left" ? "flex" : "flex justify-end"}>
      <div
        className={`max-w-[90%] rounded-2xl px-3 py-2 ${
          side === "left" ? "rounded-bl-sm bg-muted text-foreground" : "rounded-br-sm bg-primary text-primary-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground">{label}</span>
      <span className="font-mono text-muted-foreground">×{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function PainPoints() {
  const pains = [
    {
      icon: MessageCircleMore,
      title: "Pesanan tercecer di WhatsApp",
      desc: "Order masuk dari banyak chat sekaligus. Sulit tahu mana yang sudah final dan mana yang masih berubah.",
    },
    {
      icon: GitBranch,
      title: "Pelanggan sering mengubah pesanan",
      desc: "Jumlah ditambah, menu baru diminta, jam ambil digeser — semua dalam satu thread panjang.",
    },
    {
      icon: HelpCircle,
      title: "Sulit mengetahui pesanan final",
      desc: "Pemilik usaha harus scroll ke atas-bawah berulang kali hanya untuk memastikan versi terakhir.",
    },
    {
      icon: AlertTriangle,
      title: "Kesalahan pencatatan saat jam ramai",
      desc: "Saat antrian penuh, satu angka salah bisa berarti dapur masak jumlah yang tidak sesuai.",
    },
    {
      icon: ClipboardList,
      title: "Tidak ada data untuk evaluasi bisnis",
      desc: "Chat tidak bisa dianalisis. Pola pelanggan, jam ramai, dan menu favorit hilang begitu saja.",
    },
  ];

  return (
    <section id="masalah" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead
        eyebrow="Masalah Harian"
        title="Masalah yang Dialami UMKM Kuliner Setiap Hari"
        desc="Di jam sibuk, satu chat bisa berubah 3-4 kali. Pemilik usaha harus baca ulang dari atas hanya untuk memastikan jumlah akhir."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {pains.map((pain) => (
          <div
            key={pain.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-destructive/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <pain.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold leading-relaxed">{pain.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pain.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyAI() {
  const aiUnderstand = [
    "Bahasa informal pelanggan",
    "Typo dan kalimat tidak baku",
    "Revisi pesanan berulang",
    "Konteks percakapan sebelumnya",
    "Perubahan jumlah terakhir",
    "Perubahan waktu pengambilan",
  ];

  const examples = [
    "Mas sate ayamnya jadi 25 ya, yang 20 sebelumnya batal.",
    "Tambah lontong 3.",
    "Saya ambil jam 7 saja.",
  ];

  return (
    <section id="kenapa-ai" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Alasan Utama"
          title="Kenapa Harus AI?"
          desc="Masalah ini tidak bisa diselesaikan dengan form biasa. Pelanggan memesan lewat chat yang dinamis, tidak terstruktur, dan sering berubah."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium">
              <MessageCircleMore className="h-4 w-4 text-primary" />
              Contoh Percakapan Nyata
            </div>
            <div className="space-y-2">
              {examples.map((line) => (
                <ChatBubble key={line} side="left">
                  Customer: {line}
                </ChatBubble>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-sm font-medium">AI memahami:</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {aiUnderstand.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <CompareCard
              title="Baca Manual"
              points={[
                "Harus scroll chat panjang berulang kali",
                "Rentan salah ambil jumlah terakhir",
                "Sulit melacak revisi saat jam ramai",
                "Tidak ada ringkasan siap proses",
              ]}
              tone="manual"
            />
            <CompareCard
              title="Analisis AI OrderIQ"
              points={[
                "Jumlah akhir terdeteksi otomatis",
                "Revisi langsung ditandai jelas",
                "Jam pengambilan final tampil otomatis",
                "Pesanan final siap diproses dapur",
              ]}
              tone="ai"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderStory() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
        <SectionHead
          align="left"
          eyebrow="Cerita Awal"
          title="Terinspirasi dari Masalah Nyata UMKM Kuliner"
        />
        <div className="mt-6 grid gap-6 text-muted-foreground lg:grid-cols-2">
          <p>
            Banyak UMKM kuliner menerima pesanan lewat WhatsApp: penjual sate, warung makan,
            katering rumahan, sampai usaha kaki lima. Masalahnya bukan menerima order, tapi menjaga
            agar order tetap akurat saat chat terus berubah.
          </p>
          <p>
            Saat jam ramai, pelanggan sering mengubah jumlah, menambah menu, atau mengganti jam
            ambil. Pemilik usaha harus membaca ulang chat berkali-kali. Dari sinilah muncul salah
            catat, waktu terbuang, dan dapur jadi kacau.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-sm">
          OrderIQ dirancang khusus untuk menyelesaikan masalah ini:
          <span className="font-medium text-foreground">
            {" "}
            mengubah percakapan WhatsApp yang berantakan menjadi operasional kuliner yang terstruktur.
          </span>
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  const [chat, setChat] = useState(LANDING_DEMO_CHAT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  const chatLines = chat.split("\n").filter(Boolean);

  async function runAnalysis() {
    setLoading(true);
    setResult(null);
    setVisibleLines(0);

    for (let i = 1; i <= chatLines.length; i++) {
      setVisibleLines(i);
      await new Promise((r) => setTimeout(r, 350));
    }

    await new Promise((r) => setTimeout(r, 600));
    setResult(analyzeChat(chat));
    setLoading(false);
  }

  function resetDemo() {
    setChat(LANDING_DEMO_CHAT);
    setResult(null);
    setLoading(false);
    setVisibleLines(0);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void runAnalysis();
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="demo" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Demo Interaktif"
          title="Coba Sendiri: Chat WhatsApp Menjadi Pesanan Siap Proses"
          desc="Tempel percakapan pelanggan, lalu lihat AI mengekstrak pesanan final beserta jejak revisinya."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium">Input: WhatsApp Chat</div>
              <Badge variant="secondary" className="text-xs">Bisa diedit</Badge>
            </div>
            <Textarea
              value={chat}
              onChange={(e) => {
                setChat(e.target.value);
                setResult(null);
                setVisibleLines(0);
              }}
              rows={8}
              className="mb-4 resize-none font-mono text-sm"
              placeholder="Tempel chat WhatsApp di sini..."
            />
            <div className="mb-4 space-y-2 rounded-xl border border-border bg-muted/30 p-3">
              {chatLines.slice(0, visibleLines || chatLines.length).map((line) => (
                <ChatBubble key={line} side="left">
                  {line}
                </ChatBubble>
              ))}
              {loading && visibleLines < chatLines.length && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Membaca pesan...
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void runAnalysis()} disabled={loading || !chat.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Menganalisis...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Analisis Chat
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetDemo} disabled={loading}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                  loading ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 text-sm font-medium">Output: Pesanan Terstruktur</div>
            {!result && !loading && (
              <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Klik &quot;Analisis Chat&quot; untuk melihat pesanan final dari percakapan di sebelah kiri.
              </div>
            )}
            {loading && !result && (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
                <BrainCircuit className="h-8 w-8 animate-pulse text-primary" />
                <p className="mt-3 text-sm font-medium">AI memproses percakapan...</p>
                <p className="mt-1 text-xs text-muted-foreground">Mendeteksi revisi, jumlah final, dan jam ambil</p>
              </div>
            )}
            {result && (
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Pesanan Final</span>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Siap Diproses</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  {result.items.map((item) => (
                    <InfoRow key={item.name} label={item.name} value={`${item.qty} porsi`} />
                  ))}
                  <InfoRow
                    label="Metode"
                    value={result.fulfillment === "pickup" ? "Ambil Sendiri" : "Antar"}
                  />
                  <InfoRow
                    label="Jam Pengambilan"
                    value={result.pickupTime ?? result.deliveryTime ?? "—"}
                  />
                </div>
                <div className="mt-4 border-t border-border pt-3">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <GitBranch className="h-3.5 w-3.5" />
                    Jejak Revisi
                  </div>
                  {result.revisions.length > 0 ? (
                    <div className="space-y-2">
                      {result.revisions.map((rev) => (
                        <div key={rev.text} className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                          {rev.text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                      <span>20 sate ayam</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">25 sate ayam</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function OutcomeFeatures() {
  const features = [
    {
      icon: Check,
      title: "Temukan Pesanan Final Secara Otomatis",
      desc: "OrderIQ membaca percakapan panjang dan menampilkan jumlah akhir yang benar, tanpa hitung manual.",
    },
    {
      icon: Store,
      title: "Pahami Pola Pemesanan Pelanggan",
      desc: "Lihat kecenderungan jam ramai, metode ambil sendiri, serta menu yang paling sering dipesan.",
    },
    {
      icon: BrainCircuit,
      title: "Temukan Insight yang Tidak Terlihat di Chat",
      desc: "Dapatkan pola tersembunyi yang sulit ditemukan jika hanya membaca chat satu per satu.",
    },
    {
      icon: ChefHat,
      title: "Kurangi Kekacauan Operasional Dapur",
      desc: "Pesanan final siap proses membantu tim dapur bergerak lebih cepat dan minim kesalahan.",
    },
  ];

  return (
    <section id="fitur" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead
        eyebrow="Nilai Utama"
        title="Fitur yang Fokus pada Hasil, Bukan Istilah Teknis"
        desc="Setiap fitur dirancang untuk menjawab masalah nyata pemilik usaha kuliner."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InsightExamples() {
  const insights = [
    {
      stat: "84%",
      text: "pelanggan memilih ambil sendiri.",
      detail: "Bantu siapkan stok dan staf untuk jam ambil, bukan antrian delivery.",
    },
    {
      stat: "Sering",
      text: "pelanggan sate kambing menambahkan lontong.",
      detail: "Pola bundling menu yang tidak terlihat jika hanya baca chat satu per satu.",
    },
    {
      stat: "17.00–18.00",
      text: "jam dengan revisi pesanan terbanyak.",
      detail: "Siapkan tim pencatatan ekstra sebelum jam sibuk dapur.",
    },
    {
      stat: "Tertinggi",
      text: "nilai transaksi dari pesanan keluarga.",
      detail: "Identifikasi paket menu keluarga untuk promosi yang lebih tepat.",
    },
  ];

  return (
    <section id="insight" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Contoh Insight AI"
          title="Insight yang Langsung Bisa Dipakai untuk Keputusan Bisnis"
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <div key={insight.text} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-display text-lg font-semibold text-primary">{insight.stat}</span>{" "}
                    {insight.text}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{insight.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareCard({
  title,
  points,
  tone,
}: {
  title: string;
  points: string[];
  tone: "manual" | "ai";
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        tone === "ai" ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        {tone === "ai" ? (
          <BrainCircuit className="h-4 w-4 text-primary" />
        ) : (
          <UserRound className="h-4 w-4 text-muted-foreground" />
        )}
        {title}
      </div>
      <ul className="space-y-2">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 ${tone === "ai" ? "text-primary" : "text-muted-foreground"}`} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center sm:p-16">
        <div className="absolute inset-0 bg-radial-fade opacity-60" />
        <div className="relative">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Siap hentikan salah catat pesanan WhatsApp?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Coba demo OrderIQ dan lihat sendiri bagaimana chat yang berantakan berubah menjadi
            pesanan final siap diproses.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 px-7 text-base">
            <Link to="/analyze">
              Coba Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Flame className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-semibold">OrderIQ</span>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Kebijakan Privasi</a>
          <a href="#" className="hover:text-foreground">Syarat Layanan</a>
          <a href="#" className="hover:text-foreground">Kontak</a>
        </div>
      </div>
    </footer>
  );
}

function SectionHead({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <div className="text-xs font-medium uppercase tracking-widest text-primary">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-3 text-muted-foreground text-balance">{desc}</p>}
    </div>
  );
}

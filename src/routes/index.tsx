import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageSquareText,
  GitBranch,
  BarChart3,
  ShoppingBag,
  Brain,
  Flame,
  ArrowRight,
  Check,
  Quote,
  ChefHat,
  Bike,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrderIQ — AI Order Intelligence for Culinary SMEs" },
      {
        name: "description",
        content:
          "Turn WhatsApp orders into business intelligence. Extract orders, detect revisions, understand customers — automatically.",
      },
      { property: "og:title", content: "OrderIQ — AI Order Intelligence" },
      {
        property: "og:description",
        content:
          "Automatically extract orders, detect revisions, and generate insights from WhatsApp conversations.",
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
      <LogoBar />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Pricing />
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
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground">Customers</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/app" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link to="/app">
              Try Demo <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 text-center sm:pt-28">
        <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          AI Order Intelligence · Built for Indonesia
        </Badge>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
          Turn WhatsApp Orders
          <br />
          <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            Into Business Intelligence
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          OrderIQ automatically extracts orders, detects revisions, understands customer behavior,
          and generates business insights from WhatsApp conversations — so you stop rereading chats
          and start running a sharper kitchen.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link to="/app/analyze">
              Try Demo Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
            <a href="#how">See how it works</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">No credit card · Demo with real sample data</p>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="absolute -inset-x-12 -top-8 bottom-0 rounded-[2rem] bg-gradient-to-b from-primary/20 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <div className="ml-3 text-xs text-muted-foreground">orderiq.app · Analyze</div>
        </div>
        <div className="grid gap-0 md:grid-cols-2">
          <div className="border-b border-border p-5 text-left md:border-b-0 md:border-r">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              WhatsApp Conversation
            </div>
            <div className="space-y-2 font-mono text-xs">
              <ChatBubble side="left">Pak, sate ayam 20 tusuk ya</ChatBubble>
              <ChatBubble side="right">Siap Bu, ambil jam berapa?</ChatBubble>
              <ChatBubble side="left">Jam 18:00, tambah lontong 5</ChatBubble>
              <ChatBubble side="left">Eh, sate ayamnya jadi 25</ChatBubble>
              <ChatBubble side="left">Ambil jam 19:00 aja ya</ChatBubble>
            </div>
          </div>
          <div className="p-5 text-left">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              AI Extracted Order
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">PICKUP · 19:00</Badge>
                <span className="text-xs text-muted-foreground">2 revisi terdeteksi</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <Row label="Sate Ayam" value="25" />
                <Row label="Lontong" value="5" />
              </div>
              <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <GitBranch className="h-3 w-3" />
                  Sate Ayam: 20 → 25
                </div>
                <div className="flex items-center gap-1.5">
                  <GitBranch className="h-3 w-3" />
                  Pickup: 18:00 → 19:00
                </div>
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
        className={`max-w-[80%] rounded-2xl px-3 py-1.5 ${
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

function LogoBar() {
  const logos = ["Sate Pak Mail", "Warung Bu Ida", "Catering Berkah", "Ayam Geprek Joss", "Mie Pak Tono", "Nasi Uduk Sari"];
  return (
    <div className="border-y border-border/60 bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-5 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Dipercaya UMKM kuliner di seluruh Indonesia
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-60">
          {logos.map((l) => (
            <span key={l} className="font-display text-sm font-medium text-muted-foreground">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  const feats = [
    {
      icon: MessageSquareText,
      title: "AI Chat Analyzer",
      desc: "Paste WhatsApp or upload screenshots. Get clean structured orders in seconds.",
    },
    {
      icon: GitBranch,
      title: "Revision Detection",
      desc: "Spot every quantity change, added item, and shifted pickup time automatically.",
    },
    {
      icon: ChefHat,
      title: "Smart Order Summary",
      desc: "Kitchen-ready operational cards so staff knows exactly what to prep.",
    },
    {
      icon: BarChart3,
      title: "Order Dashboard",
      desc: "Track pickup vs delivery, peak hours, top menu, and order revision rate.",
    },
    {
      icon: Brain,
      title: "AI Business Insights",
      desc: "Discover patterns: bundle behavior, weekend spikes, payment preferences.",
    },
    {
      icon: ShoppingBag,
      title: "Order History",
      desc: "Searchable archive with revisions, AI summaries, and fulfillment status.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead
        eyebrow="Features"
        title="Everything you need to tame WhatsApp orders"
        desc="Designed specifically for Indonesian culinary SMEs where pickup dominates and chats get messy."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {feats.map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Paste atau upload", desc: "Tempel chat WhatsApp atau unggah screenshot." },
    { n: "02", title: "AI menganalisis", desc: "OrderIQ ekstrak item, kuantitas, revisi, dan fulfillment." },
    { n: "03", title: "Siap dapur", desc: "Ringkasan operasional langsung bisa dipakai staf." },
  ];
  return (
    <section id="how" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead eyebrow="How it works" title="From chaotic chat to clear order in 3 steps" />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7">
              <div className="font-mono text-xs text-primary">{s.n}</div>
              <h3 className="mt-2 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    "Kurangi salah pesan dari obrolan panjang WhatsApp",
    "Hemat waktu — tidak perlu baca ulang chat",
    "Deteksi otomatis pickup vs delivery",
    "Pahami perilaku pelanggan lewat insight AI",
    "Optimalkan staf di jam sibuk 17:00–20:00",
    "Cocok untuk warung, katering, sate, hingga home-based",
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHead
            align="left"
            eyebrow="Benefits"
            title="Lebih sedikit kesalahan. Lebih banyak pendapatan."
            desc="OrderIQ dibangun untuk realita UMKM kuliner Indonesia: mayoritas customer ambil sendiri (takeaway), sebagian minta diantar."
          />
          <ul className="mt-8 space-y-3">
            {items.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Pickup" value="82%" icon={ShoppingBag} accent="text-primary" />
          <Stat label="Delivery" value="18%" icon={Bike} accent="text-chart-2" />
          <Stat label="Order revisi" value="55%" icon={GitBranch} accent="text-chart-3" />
          <Stat label="Peak hour" value="18–19" icon={BarChart3} accent="text-chart-4" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Icon className={`h-5 w-5 ${accent}`} />
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Testimonials() {
  const t = [
    {
      quote:
        "Dulu saya selalu salah hitung pesanan sate karena customer ganti-ganti jumlah. Sekarang tinggal paste, semua jelas.",
      name: "Pak Mail",
      role: "Sate Pak Mail, Jakarta",
    },
    {
      quote:
        "Insight peak hour-nya akurat banget. Saya jadi tahu kapan harus tambah tukang bakar sate.",
      name: "Bu Ida",
      role: "Warung Bu Ida, Bandung",
    },
    {
      quote:
        "Kami catering rumahan. Tim kami sekarang cuma butuh 30 detik per order, bukan 5 menit.",
      name: "Mas Reza",
      role: "Catering Berkah, Bekasi",
    },
  ];
  return (
    <section id="testimonials" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead eyebrow="Customers" title="Dipakai pemilik usaha sungguhan" />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.map((x) => (
            <div key={x.name} className="rounded-2xl border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm leading-relaxed text-foreground">{x.quote}</p>
              <div className="mt-5 border-t border-border pt-4">
                <div className="text-sm font-medium">{x.name}</div>
                <div className="text-xs text-muted-foreground">{x.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Gratis",
      desc: "Untuk usaha yang baru mulai.",
      features: ["50 analisis chat / bulan", "Dashboard dasar", "Order history 30 hari"],
      cta: "Mulai gratis",
    },
    {
      name: "Pro",
      price: "Rp 149rb",
      per: "/bulan",
      desc: "Untuk warung & katering aktif.",
      features: [
        "Analisis tanpa batas",
        "AI Business Insights",
        "Order history selamanya",
        "Export laporan",
      ],
      cta: "Coba Pro 14 hari",
      featured: true,
    },
    {
      name: "Business",
      price: "Rp 399rb",
      per: "/bulan",
      desc: "Untuk multi-outlet & franchise.",
      features: ["Multi-outlet", "Tim & role", "API access", "Dedicated support"],
      cta: "Hubungi kami",
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead eyebrow="Pricing" title="Harga jujur, transparan" desc="Mulai gratis. Upgrade kapan saja." />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border p-7 ${
              p.featured
                ? "border-primary bg-card shadow-xl shadow-primary/10"
                : "border-border bg-card"
            }`}
          >
            {p.featured && (
              <Badge className="absolute -top-3 left-7 bg-primary text-primary-foreground hover:bg-primary">
                Most popular
              </Badge>
            )}
            <div className="font-display text-lg font-semibold">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold tracking-tight">{p.price}</span>
              {p.per && <span className="text-sm text-muted-foreground">{p.per}</span>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            <Button
              asChild
              className="mt-5 w-full"
              variant={p.featured ? "default" : "outline"}
            >
              <Link to="/app">{p.cta}</Link>
            </Button>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center sm:p-16">
        <div className="absolute inset-0 bg-radial-fade opacity-60" />
        <div className="relative">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Siap berhenti baca chat panjang?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Coba OrderIQ sekarang dengan data contoh dari Sate Pak Mail. Tidak perlu kartu kredit.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 px-7 text-base">
            <Link to="/app">
              Masuk ke Demo <ArrowRight className="ml-2 h-4 w-4" />
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
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
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

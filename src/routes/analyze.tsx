import { createFileRoute, Link } from "@tanstack/react-router";
import { ChatAnalyzer } from "@/components/chat-analyzer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { initOrderStorage } from "@/lib/order-storage";
import { ArrowRight, Flame } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [{ title: "Analisis Pesanan · OrderIQ" }],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  useEffect(() => {
    initOrderStorage();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Flame className="h-4 w-4" />
            </div>
            <span className="font-display font-semibold">OrderIQ</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/judge-demo" className="hover:text-foreground">Demo Juri</Link>
            <Link to="/app/insights" className="hover:text-foreground">Insight Bisnis</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/judge-demo">
                Mode Juri <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Analisis Pesanan WhatsApp</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Tempel percakapan pelanggan. OrderIQ mengekstrak pesanan final, mendeteksi revisi, dan
            menghasilkan kartu pesanan siap proses untuk dapur.
          </p>
        </div>
        <ChatAnalyzer showHistory />
      </main>
    </div>
  );
}

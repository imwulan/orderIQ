import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChatAnalyzer } from "@/components/chat-analyzer";
import { initOrderStorage } from "@/lib/order-storage";

export const Route = createFileRoute("/app/analyze")({
  head: () => ({ meta: [{ title: "Analisis Chat · OrderIQ" }] }),
  component: Analyze,
});

function Analyze() {
  useEffect(() => {
    initOrderStorage();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Analisis Chat</h1>
        <p className="text-sm text-muted-foreground">
          Tempel chat WhatsApp atau unggah screenshot. AI mengekstrak pesanan final, revisi, dan kartu dapur.
        </p>
      </div>
      <ChatAnalyzer showHistory />
    </div>
  );
}

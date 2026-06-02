import { ArrowDown, GitBranch, Plus } from "lucide-react";
import type { StructuredRevision } from "@/lib/types";

export function RevisionTimeline({ revisions }: { revisions: StructuredRevision[] }) {
  if (revisions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Tidak ada revisi terdeteksi — pesanan sudah final dari awal.</p>
    );
  }

  return (
    <div className="space-y-4">
      {revisions.map((rev, i) => (
        <div key={`${rev.type}-${rev.label}-${i}`} className="relative">
          {rev.type === "qty" && rev.from && rev.to ? (
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5" />
                Perubahan Jumlah
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <span className="rounded-lg bg-background px-4 py-2 text-sm line-through opacity-70">{rev.from}</span>
                <ArrowDown className="h-4 w-4 shrink-0 text-primary sm:rotate-[-90deg]" />
                <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{rev.to}</span>
              </div>
            </div>
          ) : rev.type === "add" ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <Plus className="h-3.5 w-3.5" />
                Penambahan Menu
              </div>
              <p className="text-sm font-medium">{rev.to ?? rev.text}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {rev.label}
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                {rev.from && (
                  <span className="rounded-lg bg-background px-4 py-2 text-sm line-through opacity-70">{rev.from}</span>
                )}
                {rev.from && rev.to && (
                  <ArrowDown className="h-4 w-4 shrink-0 text-primary sm:rotate-[-90deg]" />
                )}
                {rev.to && (
                  <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{rev.to}</span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

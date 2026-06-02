import { forwardRef } from "react";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/lib/types";
import { formatIDR } from "@/lib/mock-data";

type OrderCardPrintProps = {
  result: AnalysisResult;
};

export const OrderCardPrint = forwardRef<HTMLDivElement, OrderCardPrintProps>(function OrderCardPrint(
  { result },
  ref,
) {
  const time = result.fulfillment === "pickup" ? result.pickupTime : result.deliveryTime;
  const method = result.fulfillment === "pickup" ? "Ambil Sendiri" : "Antar";

  return (
    <div
      ref={ref}
      className="rounded-xl border-2 border-dashed border-border bg-white p-6 text-black print:border-black print:shadow-none dark:bg-card dark:text-foreground"
    >
      <div className="border-b border-border pb-4 print:border-black">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">OrderIQ · Kartu Pesanan Dapur</div>
        <h3 className="mt-1 font-display text-xl font-bold">Sate Pak Mail</h3>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <div className="text-xs text-muted-foreground">Pelanggan</div>
          <div className="font-semibold">{result.customer}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Telepon</div>
          <div className="font-semibold">{result.phone}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Metode</div>
          <div className="font-semibold">{method}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Waktu</div>
          <div className="font-semibold">{time ?? "—"}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Item Pesanan</div>
        <div className="mt-2 divide-y divide-border">
          {result.items.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-2">
              <span className="font-medium">{item.name}</span>
              <span className="font-mono text-lg font-bold">×{item.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {result.notes && (
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="text-xs font-medium uppercase text-muted-foreground">Catatan</div>
          <p className="mt-1">{result.notes}</p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 print:border-black">
        <Badge className="bg-primary text-primary-foreground">{result.status}</Badge>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="font-display text-lg font-bold">{formatIDR(result.total)}</div>
        </div>
      </div>
    </div>
  );
});

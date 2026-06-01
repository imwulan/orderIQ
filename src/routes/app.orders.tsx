import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Search, ShoppingBag, Bike, GitBranch, ChevronLeft, ChevronRight } from "lucide-react";
import { ORDERS, formatIDR, type Order } from "@/lib/mock-data";

export const Route = createFileRoute("/app/orders")({
  head: () => ({ meta: [{ title: "Orders · OrderIQ" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "pickup" | "delivery">("all");
  const [status, setStatus] = useState<"all" | Order["status"]>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const perPage = 12;

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (type !== "all" && o.fulfillment !== type) return false;
      if (status !== "all" && o.status !== status) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !o.customer.toLowerCase().includes(s) &&
          !o.id.toLowerCase().includes(s) &&
          !o.items.some((i) => i.name.toLowerCase().includes(s))
        )
          return false;
      }
      return true;
    });
  }, [q, type, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} order ditemukan · klik baris untuk detail
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, ID, atau menu..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={(v: typeof type) => { setType(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Fulfillment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua tipe</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v: typeof status) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="Ready for Preparation">Ready for Preparation</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Items</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-center font-medium">Rev</th>
                </tr>
              </thead>
              <tbody>
                {view.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="cursor-pointer border-b border-border last:border-0 transition hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.customer}</div>
                      <div className="text-xs text-muted-foreground">{o.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.items.map((it) => `${it.qty}× ${it.name}`).join(" · ")}
                    </td>
                    <td className="px-4 py-3">
                      <FulfillmentBadge type={o.fulfillment} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge s={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatIDR(o.total)}</td>
                    <td className="px-4 py-3 text-center">
                      {o.revisions.length > 0 ? (
                        <Badge variant="secondary" className="gap-1">
                          <GitBranch className="h-3 w-3" />
                          {o.revisions.length}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
            <span>
              Halaman {page} dari {pages}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display">{selected.id}</SheetTitle>
                <SheetDescription>
                  {selected.customer} · {selected.phone}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <FulfillmentBadge type={selected.fulfillment} />
                  <StatusBadge s={selected.status} />
                  <Badge variant="outline">{selected.payment}</Badge>
                </div>

                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Items
                  </div>
                  <div className="divide-y divide-border rounded-xl border border-border">
                    {selected.items.map((it) => (
                      <div key={it.name} className="flex items-center justify-between p-3 text-sm">
                        <span>{it.name}</span>
                        <span className="text-muted-foreground">
                          ×{it.qty} · {formatIDR(it.qty * it.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>{formatIDR(selected.total)}</span>
                  </div>
                </div>

                {selected.fulfillment === "pickup" ? (
                  <Info label="Pickup time" value={selected.pickupTime ?? "—"} />
                ) : (
                  <>
                    <Info label="Address" value={selected.deliveryAddress ?? "—"} />
                    <Info label="Delivery time" value={selected.deliveryTime ?? "—"} />
                  </>
                )}

                <div>
                  <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Revision history
                  </div>
                  {selected.revisions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Tidak ada revisi.</p>
                  ) : (
                    <ol className="relative ml-3 space-y-3 border-l border-border pl-5">
                      {selected.revisions.map((r, i) => (
                        <li key={i} className="relative">
                          <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                            <GitBranch className="h-2.5 w-2.5" />
                          </span>
                          <div className="text-sm font-medium">{r.text}</div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function FulfillmentBadge({ type }: { type: "pickup" | "delivery" }) {
  const Icon = type === "pickup" ? ShoppingBag : Bike;
  return (
    <Badge
      variant="secondary"
      className={`gap-1 uppercase ${
        type === "pickup" ? "bg-primary/10 text-primary hover:bg-primary/10" : "bg-chart-2/15 text-chart-2 hover:bg-chart-2/15"
      }`}
    >
      <Icon className="h-3 w-3" />
      {type}
    </Badge>
  );
}

function StatusBadge({ s }: { s: Order["status"] }) {
  const map: Record<Order["status"], string> = {
    Completed: "bg-success/15 text-success",
    "In Progress": "bg-warning/20 text-warning-foreground",
    "Ready for Preparation": "bg-muted text-muted-foreground",
  };
  return <Badge variant="secondary" className={`${map[s]} border-0`}>{s}</Badge>;
}

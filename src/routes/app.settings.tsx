import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearHistory, getAnalysisHistory, seedDemoDataset } from "@/lib/order-storage";
import { Flame, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Pengaturan · OrderIQ" }] }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const historyCount = getAnalysisHistory().length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Profil bisnis, tema, dan data analisis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Bisnis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Sate Pak Mail</div>
              <div className="text-xs text-muted-foreground">UMKM kuliner · Jakarta</div>
            </div>
            <Badge className="ml-auto">MVP Demo</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama usaha" defaultValue="Sate Pak Mail" />
            <Field label="No WhatsApp" defaultValue="+62 812-3456-7890" />
            <Field label="Kota" defaultValue="Jakarta" />
            <Field label="Kategori" defaultValue="Sate / Kuliner" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tampilan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <div className="font-medium">Tema aplikasi</div>
              <div className="text-xs text-muted-foreground">
                Saat ini: {theme === "system" ? "Mengikuti sistem" : theme === "dark" ? "Gelap" : "Terang"}
              </div>
            </div>
            <ThemeToggle variant="outline" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(t)}
              >
                {t === "light" ? "Terang" : t === "dark" ? "Gelap" : "Sistem"}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Dataset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {historyCount} analisis tersimpan di perangkat ini (localStorage).
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const n = seedDemoDataset(true);
                toast.success(`${n} record demo dimuat`);
              }}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Muat 100 Order Demo
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearHistory();
                seedDemoDataset(true);
                toast.success("Riwayat dibersihkan, dataset demo dimuat ulang");
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Sate Pak Mail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[
              ["Sate Ayam", "Rp 25.000"],
              ["Sate Kambing", "Rp 35.000"],
              ["Lontong", "Rp 8.000"],
              ["Teh Manis", "Rp 5.000"],
              ["Es Teh", "Rp 6.000"],
            ].map(([n, p]) => (
              <div key={n} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{n}</span>
                <span className="font-mono text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings · OrderIQ" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Atur profil bisnis dan preferensi AI</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
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
            <Badge className="ml-auto bg-success text-success-foreground">Pro plan</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama usaha" defaultValue="Sate Pak Mail" />
            <Field label="No WhatsApp" defaultValue="+62 812-3456-7890" />
            <Field label="Kota" defaultValue="Jakarta" />
            <Field label="Kategori" defaultValue="Sate / Street food" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            label="Deteksi revisi otomatis"
            desc="AI memantau perubahan kuantitas, item, dan waktu pickup."
            defaultChecked
          />
          <Toggle
            label="Smart summary untuk dapur"
            desc="Hasilkan ringkasan singkat yang dapat dicetak."
            defaultChecked
          />
          <Toggle label="Mingguan insight email" desc="Kirim insight setiap Senin pagi." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[
              ["Sate Ayam", "Rp 25.000"],
              ["Sate Kambing", "Rp 35.000"],
              ["Lontong", "Rp 8.000"],
              ["Teh Manis", "Rp 5.000"],
              ["Es Teh", "Rp 6.000"],
              ["Jeruk Hangat", "Rp 8.000"],
            ].map(([n, p]) => (
              <div key={n} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{n}</span>
                <span className="font-mono text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Tambah menu
          </Button>
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

function Toggle({
  label,
  desc,
  defaultChecked,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

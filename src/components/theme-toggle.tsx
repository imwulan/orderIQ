import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/hooks/use-theme";

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
];

export function ThemeToggle({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const { theme, setTheme } = useTheme();
  const Current = options.find((o) => o.value === theme)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" aria-label="Ubah tema">
          <Current className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => setTheme(opt.value)} className="gap-2">
            <opt.icon className="h-4 w-4" />
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

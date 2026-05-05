import type { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warning" | "insight";

interface CalloutProps {
  variant?: Variant;
  label?: string;
  children: ReactNode;
}

const variantConfig: Record<Variant, { icon: typeof Info; defaultLabel: string; tone: string }> = {
  info: { icon: Info, defaultLabel: "Note", tone: "text-[color:var(--ink-muted)]" },
  warning: {
    icon: AlertTriangle,
    defaultLabel: "Caveat",
    tone: "text-[color:var(--negative)]",
  },
  insight: {
    icon: Lightbulb,
    defaultLabel: "Takeaway",
    tone: "text-[color:var(--accent)]",
  },
};

export function Callout({ variant = "info", label, children }: CalloutProps) {
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;
  return (
    <div className="my-7 not-prose border-y border-[color:var(--rule)] py-5">
      <div className={cn("flex items-center gap-2 mb-2", cfg.tone)}>
        <Icon size={14} strokeWidth={2} />
        <span className="text-[0.6875rem] uppercase tracking-[0.12em] font-semibold">
          {label ?? cfg.defaultLabel}
        </span>
      </div>
      <div className="text-[0.9375rem] leading-relaxed text-[color:var(--ink)]">{children}</div>
    </div>
  );
}

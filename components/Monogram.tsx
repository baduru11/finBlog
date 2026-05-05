import { cn } from "@/lib/utils";

interface MonogramProps {
  size?: number;
  className?: string;
  variant?: "compact" | "stamp";
}

export function Monogram({ size = 28, className, variant = "compact" }: MonogramProps) {
  if (variant === "stamp") {
    return (
      <div
        className={cn(
          "border border-[color:var(--rule-strong)] flex items-center justify-center bg-[color:var(--bg-elevated)]",
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <span
          className="font-[family-name:var(--font-display)] font-semibold text-[color:var(--accent)] leading-none"
          style={{
            fontSize: size * 0.42,
            fontVariationSettings: '"opsz" 144, "SOFT" 100',
            letterSpacing: "-0.02em",
          }}
        >
          S
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[color:var(--rule-strong)] bg-[color:var(--bg-elevated)] text-[color:var(--accent)] font-semibold leading-none",
        className
      )}
      style={{
        width: size,
        height: size,
        fontFamily: "var(--font-display)",
        fontSize: size * 0.45,
        fontVariationSettings: '"opsz" 144, "SOFT" 100',
        letterSpacing: "-0.02em",
      }}
      aria-hidden="true"
    >
      S
    </span>
  );
}

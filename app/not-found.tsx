import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <div className="container-page py-32 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="text-kicker mb-6">Edition corrections</div>
          <h1
            className="font-[family-name:var(--font-display)] text-[3rem] sm:text-[4.5rem] leading-[1.05] font-semibold text-[color:var(--ink)] tracking-tight mb-6"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            This story has been pulled.
          </h1>
          <p className="text-dek mb-10">
            The page you requested isn&apos;t part of this edition. It may have
            been retitled, retired, or never published.
          </p>
          <hr className="rule-stub mx-auto mb-10" style={{ borderTopColor: "var(--accent)" }} />
          <Link
            href="/"
            className="cursor-pointer inline-flex items-center gap-2 text-[color:var(--accent)] hover:gap-3 transition-all"
          >
            Return to the front page <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    </>
  );
}

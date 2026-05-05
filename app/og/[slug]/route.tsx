import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { SITE } from "@/lib/utils";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? SITE.name;
  const summary = post?.summary ?? SITE.tagline;
  const tag = post?.tags[0];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "#FAF7F2",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#B7410E",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontWeight: 600 }}>{SITE.name}</span>
          {tag ? (
            <>
              <span style={{ color: "#71717A" }}>·</span>
              <span style={{ color: "#52525B" }}>{tag}</span>
            </>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 1000 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 64 : 78,
              lineHeight: 1.05,
              color: "#0E0E10",
              fontWeight: 600,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 64,
              height: 4,
              background: "#0E0E10",
            }}
          />
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#52525B",
              fontFamily: "sans-serif",
              maxWidth: 900,
            }}
          >
            {summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#71717A",
            fontFamily: "sans-serif",
            fontSize: 18,
          }}
        >
          <span>By {SITE.author}</span>
          <span>{SITE.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const feed = new Feed({
    id: SITE.url,
    link: SITE.url,
    title: SITE.name,
    description: SITE.description,
    language: "en",
    favicon: `${SITE.url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE.author}`,
    feedLinks: { rss2: `${SITE.url}/feed.xml` },
    author: { name: SITE.author, email: SITE.email, link: SITE.url },
  });

  for (const post of getAllPosts()) {
    feed.addItem({
      title: post.title,
      id: `${SITE.url}/posts/${post.slugAsParams}`,
      link: `${SITE.url}/posts/${post.slugAsParams}`,
      description: post.summary,
      content: post.excerpt,
      author: [{ name: post.author, link: SITE.url }],
      date: new Date(post.date),
      category: post.tags.map((t) => ({ name: t })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

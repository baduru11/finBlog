import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120),
      summary: s.string().max(280),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      concepts: s.array(s.string()).default([]),
      status: s.enum(["draft", "published"]).default("published"),
      author: s.string().default("Seungwan"),
      cover: s.image().optional(),
      metadata: s.metadata(),
      excerpt: s.excerpt(),
      raw: s.raw(),
      content: s.mdx(),
    })
    .transform(computedFields),
});

const concepts = defineCollection({
  name: "Concept",
  pattern: "concepts/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      term: s.string().max(80),
      shortDef: s.string().max(220),
      category: s.string().default("general"),
      content: s.mdx(),
    })
    .transform(computedFields),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, concepts },
  mdx: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark-dimmed", light: "github-light" },
          keepBackground: false,
        },
      ],
      rehypeKatex,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
    ],
  },
});

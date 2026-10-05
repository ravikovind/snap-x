import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { USE_CASES } from "@/content/use-cases";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/formats", "/use-cases", "/templates", "/examples", "/showcase", "/docs", "/install", "/privacy"];
  const useCaseRoutes = USE_CASES.map((u) => `/use-cases/${u.slug}`);

  return [...staticRoutes, ...useCaseRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

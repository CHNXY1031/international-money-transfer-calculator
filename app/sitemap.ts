import type { MetadataRoute } from "next";

import { BASE_URL, getStaticTransferParams } from "@/lib/transferData";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-26T00:00:00.000Z");
  const routes = getStaticTransferParams().map(({ from, to, amount }) => ({
    url: BASE_URL + "/transfer/" + from + "-to-" + to + "/" + amount,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: Number(amount) === 5000 ? 0.8 : 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...routes,
  ];
}

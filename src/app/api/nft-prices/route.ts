import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENSEA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OpenSea API key" },
      { status: 500 }
    );
  }

  const response = await fetch(
  "https://api.opensea.io/api/v2/collections/top?chains=ink&limit=100&sort_by=one_day_volume",
    {
      headers: {
        "x-api-key": apiKey,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

const collections = data.collections || data.results || data;
const topCollections = Array.isArray(collections)
 ? collections.slice(0, 100)
  : [];
  const collectionsWithStats = await Promise.all(
  topCollections.map(async (collection: any) => {
    const slug = collection.collection || collection.slug;

    if (!slug) return collection;

    const statsResponse = await fetch(
      `https://api.opensea.io/api/v2/collections/${slug}/stats`,
      {
        headers: {
          "x-api-key": apiKey,
        },
        cache: "no-store",
      }
    );

    const stats = await statsResponse.json();

    return {
      ...collection,
      stats,
    };
  })
);

return NextResponse.json({
  collections: collectionsWithStats,
});
}
// app/api/address/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  try {
    // lang=default або ru/en, limit=5
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
    );

    const data = await res.json();

    const suggestions = data.features.map((feature: any) => {
      const p = feature.properties;
      const city = p.city || p.town || p.village || '';
      const street = p.street || '';
      const house = p.housenumber || '';

      const parts = [city, street, house].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : p.name;
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}
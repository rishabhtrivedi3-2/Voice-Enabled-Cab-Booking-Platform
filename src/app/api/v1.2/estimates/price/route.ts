import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dx = lat2 - lat1;
  const dy = lon2 - lon1;
  return Math.sqrt(dx * dx + dy * dy) * 111; // rough km
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(",", searchParams);
  const startLat = Number(searchParams.get("start_latitude"));
  const startLng = Number(searchParams.get("start_longitude"));
  const endLat = Number(searchParams.get("end_latitude"));
  const endLng = Number(searchParams.get("end_longitude"));

  const distance = calculateDistance(startLat, startLng, endLat, endLng);

  const products = await prisma.product.findMany();

  const estimates = products.map((product) => {
    const price =
      product.basePrice + distance * product.perKmRate;

    return {
      product_id: product.id,
      display_name: product.name,
      estimated_price: Math.round(price),
      eta_minutes: product.etaMinutes,
    };
  });

  return NextResponse.json({ prices: estimates }, { status: 200 });
}

import { NextResponse } from "next/server";
function cleanQuery(place: string): string {
  if (!place) return "";
  
  return place.replace(/,.*$/, "").trim();
}


export async function POST(req: Request) {
    try {
        // console.log('User location in API route:', location);
        const { userLocation, lat, lon } = await req.json();
        if (!userLocation) {
            return new Response(JSON.stringify({ error: 'User location is required' }), { status: 400 })
        }
        const cleaned = cleanQuery(userLocation);
        const deltaLat = 5 / 111; // ~111 km per degree latitude
        const deltaLon = 5 / (111 * Math.cos(lat * Math.PI / 180));

        // Build bounding box
        const viewbox = `${lon - 0.9},${lat - 0.9},${lon + 0.9},${lat + 0.9}`;

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            cleaned
        )}&limit=1&addressdetails=1&extratags=1&viewbox=${viewbox}&bounded=1`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'CabApp/1.0'
            }
        })
        if (!res.ok) {
            return NextResponse.json({ error: "Nominatim API failed" }, { status: 500 })
        }

        const data = await res.json();
        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: cleaned + " not found near your location" },
                { status: 404 }
            );
        }
        const locationData = data[0];
        return NextResponse.json({
            name: locationData.display_name,
            lat: parseFloat(locationData.lat),
            lng: parseFloat(locationData.lon)
        });
    } catch (err) {
        return NextResponse.json(
            { error: "Server error", message: err.message },
            { status: 500 }
        );
    }
}

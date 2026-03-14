import { NextResponse } from "next/server";
import { stat } from "node:fs";

export async function POST(req: Request) {
    try {
        const { sentence, userLocation } = await req.json();
        if (!sentence || !userLocation) {
            return NextResponse.json({ error: 'Text and location are required' }, { status: 400 })
        }
        const intentRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/correct-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                sentence,
                userLocation
            })
        })
        const intentData = await intentRes.json()
        console.log('Intent Data:', intentData)
        if (intentRes.status !== 200) {
            const err = await intentRes.text();
            return NextResponse.json({ error: "Intent extraction failed", details: err }, { status: 500 })

        }
        const [pickupRes, dropoffRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nominatim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userLocation: intentData.result.pickup_location,
                    lat: userLocation.latitude,
                    lon: userLocation.longitude
                })
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nominatim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userLocation: intentData.result.drop_location,
                    lat: userLocation.latitude,
                    lon: userLocation.longitude

                })
            })
        ])
        if (!pickupRes.ok) {
            const err = await pickupRes.text();
            return NextResponse.json({ error: "Pickup location resolution failed", details: err }, { status: 500 })
        }
        const picupData = await pickupRes.json();
        const dropoffData = await dropoffRes.json();
        console.log('Pickup Data:', picupData);
        const estimatedPrice = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1.2/estimates/price?start_latitude=${picupData.lat}&start_longitude=${picupData.lng}&end_latitude=${dropoffData.lat}&end_longitude=${dropoffData.lng}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (!estimatedPrice.ok) {
            const err = await estimatedPrice.text();
            return NextResponse.json({ error: "Price estimation failed", details: err }, { status: 500 })
        }
        const priceData = await estimatedPrice.json();
const prices=priceData.prices;
        const lowest = prices.reduce((min, curr) =>{

            return curr.estimated_price < min.estimated_price ? curr : min;
        }
        );

        const tssRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({
                text: `Your cab is ${lowest.display_name} is estimated to come in ${lowest.eta_minutes} minutes and price is ${lowest.estimated_price} rupees. Please confirm your booking.`
            })
        })
        if (!tssRes.ok) {
            const err = await tssRes.text();
            return NextResponse.json({ error: "Text-to-Speech conversion failed", details: err }, { status: 500 })
        }
        const tssData = await tssRes.json();
        return NextResponse.json({

            success: true,
            result: {
                intent: intentData.result.intent,
                sentence: sentence,
                userLocation: userLocation,
                pickup: picupData,
                dropoff: dropoffData,
                price: priceData.prices,
                tssData: tssData.audio,

            }
        }
        )

    } catch (err) {
        return NextResponse.json(
            { error: "Server error", message: err.message },
            { status: 500 }
        );

    }
}
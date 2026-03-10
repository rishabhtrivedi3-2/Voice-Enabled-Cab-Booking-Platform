
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try{

        const products = await prisma.product.findMany();
        return NextResponse.json({
            products: products.map((p) => ({
                product_id: p.id,
                display_name: p.name,
                base_price: p.basePrice,
                per_km_rate: p.perKmRate,
                eta_minutes: p.etaMinutes,}) )}, { status: 200 });
            } catch (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
}

//const response = await fetch('/api/correct-text', {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
                  
        //           sentence: transcriptRef.current,
        //           userLocation: location,
        //           lat: location?.latitude,
        //           lon: location?.longitude
        //         })
        //       })
        //       const intentData = await response.json()
        //       console.log('Intent Data:', intentData)
              
        //       const { intent } = intentData.result
              
        //       const pickupRes = await fetch('/api/nominatim', {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json'
        //         },
                
        //         // body: JSON.stringify({
        //         //   userLocation: intentData.result.pickup_location,
        //         //   lat: location?.latitude,
        //         //   lon: location?.longitude
        //         // })
                
        //         body: JSON.stringify({
        //           userLocation:"Koregaon Park, Ghorpuri, Pune, Pune City, Pune, Maharashtra, 411001, India",
        //           lat: 18.5366225,
        //           lon: 73.8932738
        //         })

        //       })
        //       const pickupData = await pickupRes.json()
              
        //       const dropoffRes = await fetch('/api/nominatim', {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json'
        //         },
        //         // body: JSON.stringify({
        //         //   userLocation: intentData.result.drop_location,
        //         //   lat: location?.latitude,
        //         //   lon: location?.longitude
        //         // })
        //         body: JSON.stringify({
        //           userLocation: "Pune International Airport, Airport Road, Viman Nagar, Pune, Pune City, Pune, Maharashtra, 411014, India",
        //           lat: 18.5803749,
        //           lon: 73.9182265
        //         })
        //       })
        //       const dropoffData = await dropoffRes.json()
        //       if (pickupData.error || dropoffData.error) {
        //         setError('Could not find pickup or dropoff location. Please try again.')
        //       }
        //       console.log('Intent:', intent, pickupData, dropoffData)
        //     } catch (error) {
        //       console.error('Error processing transcript:', error)
        //       setError('Error processing your request')
        //     }
        //   }
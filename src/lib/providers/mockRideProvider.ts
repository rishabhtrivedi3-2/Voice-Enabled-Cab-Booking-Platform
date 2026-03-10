import { prisma } from "@/lib/prisma";
import { RideProvider } from "./rideProvider";

export class MockRideProvider implements RideProvider {
  async createRide(data: any) {

    // hard-coded driver and price
    const driverName = "John Doe";
    const price = 250.0;

    const ride = await prisma.rideRequest.create({
      data: {
        productId: data.product_id,
        startLatitude: data.start_latitude,
        startLongitude: data.start_longitude,
        endLatitude: data.end_latitude,
        endLongitude: data.end_longitude,
        status: "accepted",
        driverName,
        price,
      },
    });

    return {
      request_id: ride.id,
      status: ride.status,
      driver: { name: ride.driverName },
      price: ride.price,
      pickup: {
        latitude: ride.startLatitude,
        longitude: ride.startLongitude,
      },
      destination: {
        latitude: ride.endLatitude,
        longitude: ride.endLongitude,
      },
    };
  }
}

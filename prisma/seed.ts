import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
    await prisma.driver.createMany({
        data: [
            {

                name: "John Doe",
                vehicle: "Swift Dzire",
                licensePlate: "MH12AB1234",
                rating: 4.8,
            },
            {

                name: "Jane Smith",
                vehicle: "Honda City",
                licensePlate: "MH12CD5678",
                rating: 4.9,
            },
            {

                name: "Alice Johnson",
                vehicle: "Swift Dzire",
                licensePlate: "MH12AB9012",
                rating: 4.8,
            }
        ]
    })
    await prisma.product.createMany({
        data: [
            {
                name: "Uber Go",
                basePrice: 100,
                perKmRate: 15,
                etaMinutes: 5,
            },
            {
                name: "Uber XL",
                basePrice: 180,
                perKmRate: 20,
                etaMinutes: 8,
            },
            {
                name: "Uber Premium",
                basePrice: 250,
                perKmRate: 25,
                etaMinutes: 10,
            }
        ]
    });
    console.log("Seeding completed.");
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
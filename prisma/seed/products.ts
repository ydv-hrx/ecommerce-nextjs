import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Old products delete
  await prisma.product.deleteMany();

  // New products insert
  await prisma.product.createMany({
    data: [
      {
        title: "iPhone 15 Pro",
        description: "Apple flagship smartphone",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
        category: "Smartphone",
        stock: 10,
      },
      {
        title: "Gaming Laptop",
        description: "High performance gaming laptop",
        price: 2200,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        category: "Laptop",
        stock: 5,
      },
      {
        title: "Wireless Headphones",
        description: "Noise cancelling headphones",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "Audio",
        stock: 15,
      },
    ],
  });

  console.log("Products seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { db as prisma } from "../src/server/db";
import { categories } from "./seed-data/categories";

/**
 * Truncates existing "Category" table and restarts identity cascade before seeding.
 * Seed categories into the database using Prisma ORM.
*/
async function seedCategories() {
  try {
    await prisma.$queryRawUnsafe(`Truncate "Category" restart identity cascade;`);
    console.log('✅ Category table truncated successfully.')
    await prisma.category.createMany({ data: categories });
    console.log('✅ Category seeded successfully.');
    await prisma.$disconnect();
  } 
  catch (error) {
    console.error('❌', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

seedCategories();

import { db as prisma } from "../src/server/db";
import { categories } from "./seed-data/categories";
// const { categories } = require("./seed-data/categories")

async function seedCategories() {
  await prisma.category.createMany({ data: categories })
}

seedCategories()
  .then(async () => {
    console.log('Categories data seeding completed ✅')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
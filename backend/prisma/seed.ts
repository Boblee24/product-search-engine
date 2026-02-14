import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const BRANDS = [
  'Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 
  'Canon', 'Puma', 'Reebok', 'Microsoft', 'Lenovo', 'Asus'
];

const CATEGORIES = [
  'Electronics', 
  'Footwear', 
  'Clothing', 
  'Sports & Outdoors', 
  'Books', 
  'Home & Kitchen',
  'Computers',
  'Cameras'
];

function generateProduct() {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const brand = faker.helpers.arrayElement(BRANDS);
  
  return {
    name: `${brand} ${faker.commerce.productName()}`,
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 2000, dec: 2 })),
    brand,
    category,
    stockQuantity: faker.number.int({ min: 0, max: 500 }),
    imageUrl: `https://picsum.photos/seed/${faker.string.uuid()}/400/400`,
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    reviewCount: faker.number.int({ min: 5, max: 5000 }),
  };
}

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.product.deleteMany();
  console.log('🗑️  Cleared existing products');

  const products = Array.from({ length: 1000 }, generateProduct);

  const batchSize = 1000;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    await prisma.product.createMany({ data: batch });
    console.log(`✅ Inserted ${Math.min(i + batchSize, products.length)}/${products.length} products`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
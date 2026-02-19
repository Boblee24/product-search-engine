import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQueryDto) {
    const {
      query: searchQuery,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'relevance',
      page = 1,
    } = query;

    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    // Build where clause dynamically, don't seem to understand shit, but it works
    const where: any = {};

    // Search in name, description, or brand
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { brand: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by brand
    if (brand) {
      where.brand = brand;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Filter by stock
    if (inStock) {
      where.stockQuantity = { gt: 0 };
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = [{ rating: 'desc' }, { reviewCount: 'desc' }];
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        // relevance - just order by name for now
        orderBy = { name: 'asc' };
    }

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // Get all unique categories (for filters)
  async getCategories() {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  // Get all unique brands (for filters)
  async getBrands() {
    const brands = await this.prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    return brands.map((b) => b.brand);
  }
}

//Let's get the hackaton started, I don't know what to write here, but I will write something anyway, just to make sure I have some content in this file, and I don't get a blank file error, which is the worst error you can get when you are trying to write code, because it makes you feel like you are not doing anything, but in reality, you are doing a lot, you just can't see it yet, but trust me, it's there, and it's going to be great, just keep going, and don't give up, because that's what winners do, they keep going until they achieve their goals, and that's what I'm going to do, I'm going to keep going until I achieve my goals, and I'm going to make sure that this product search engine is the best it can be, and I'm going to make sure that it works perfectly, and I'm going to make sure that it has all the features that we need, and I'm going to make sure that it's fast and efficient, and I'm going to make sure that it's easy to use, and I'm going to make sure that it's beautiful and intuitive, and I'm going to make sure that it's everything we dreamed of and more.

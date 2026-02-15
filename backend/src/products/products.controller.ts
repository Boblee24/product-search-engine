import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async search(@Query() query: SearchQueryDto) {
    return this.productsService.search(query);
  }

  @Get('categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('brands')
  async getBrands() {
    return this.productsService.getBrands();
  }
}

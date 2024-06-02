import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern('create-product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern('find-all-products')
  async findAll(@Payload() paginationDto?: PaginationDto) {
    return await this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern('find-one-product')
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern('update-product')
  async update(@Payload() updateProductDto: UpdateProductDto) {
     return await this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern('remove-product')
  async remove(@Payload('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @MessagePattern('validate-products')
  async validateProducts(@Payload() ids: number[]) {
    return await this.productsService.validateProducts(ids);
  }
}

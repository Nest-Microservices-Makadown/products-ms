import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database...');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total = await this.product.count({ where : { available: true } });
    const lastPage = Math.ceil(total / limit);

    return  {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where : { available: true }
      }),
      meta: {
        total,
        page,
        lastPage        
      }
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({ where: { id, available: true } });
    if (!product) {
      throw new RpcException({
        message: `Product #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

      const { id: __, ...data} = updateProductDto;

      await this.findOne(id);     
      return this.product.update({ where: { id, available: true }, data: data });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Performing a soft delete setting the [available] field to false
    return this.product.update({ where: { id }, data: { available: false } });
  }

  async validateProducts(ids: number[]) {

    // purge duplicates in ids
    ids = [...new Set(ids)];

    const products = await this.product.findMany({ where: { id: { in: ids }, available: true } });

    if (products.length !== ids.length) {
      throw new RpcException({ 
        message: 'Some products were not found',
        status: HttpStatus.NOT_FOUND });
    }
    
    return products;
  }

}

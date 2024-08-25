import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>
  ) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(): Promise<Product[]> {
    try {
      
      return await this.productsRepository.find();

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      
      const product: Product = await this.productsRepository.findOne({ where: { id }});

      if(!product) throw new NotFoundException('Product not found');

      return product;

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      
      const product: Product = await this.findOne(id);

      product.description = updateProductDto.description;
      product.name = updateProductDto.name;
      product.price = updateProductDto.price;
      
      return await this.productsRepository.save(product);

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async remove(id: number) {
    try {
      
      const product: Product = await this.findOne(id);

      await this.productsRepository.remove(product);

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async getSomeProducts(ids: number[]): Promise<Product[]> {
    try {
      
      const products: Product[] = await this.productsRepository.findBy({ id: In(ids) });
      return products;

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }
}

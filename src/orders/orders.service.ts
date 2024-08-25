import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
    private usersService: UsersService
  ){}

  async create(createOrderDto: CreateOrderDto) {
    try {
      if(!createOrderDto.user || !createOrderDto.products) throw new BadRequestException('User and products are required');

      const user = await this.usersService.findOne(createOrderDto.user);

      const products: Product[] = await this.productsService.getSomeProducts(createOrderDto.products);
      const totalPrice: number = this.getTotalPrice(products);

      return await this.ordersRepository.save({ user, totalPrice, products });

    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.ordersRepository.find();

    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      const order: Order = await this.ordersRepository.findOne({ where: { id }});

      if(!order) throw new NotFoundException('Order not found');

      return order;
      
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order: Order = await this.findOne(id);

      if(!updateOrderDto.products) throw new BadRequestException('New products are required');

      const products: Product[] = await this.productsService.getSomeProducts(updateOrderDto.products);
      const totalPrice: number = await this.getTotalPrice(products);

      order.products = products;
      order.totalPrice = totalPrice;

      return await this.ordersRepository.save(order);

    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  async remove(id: number): Promise<Order> {
    try {
      const order: Order = await this.findOne(id);

      return await this.ordersRepository.remove(order);
      
    } catch (error) {

      console.log(error);
      throw new HttpException(error.message || 'Internal server error', error.status || 500);
    }
  }

  private getTotalPrice(products: Product[]): number {
    let total: number = 0;
    products.map(product => {
      total += product.price;
    })

    return total;
  }
}

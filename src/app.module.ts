import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RolesModule } from './roles/roles.module';
import { OrderProductsModule } from './order-products/order-products.module';
import { LeavesModule } from './leaves/leaves.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'MySQLpassword.123',
    database: 'e_commerce',
    entities: [],
    synchronize: true
  }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    RolesModule,
    OrderProductsModule,
    LeavesModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RolesModule } from './roles/roles.module';
import { OrderProductsModule } from './order-products/order-products.module';
import { LeavesModule } from './leaves/leaves.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { Leave } from './leaves/entities/leave.entity';
import { OrderProduct } from './order-products/entities/order-products.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get('DB_HOST'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [User, Role, Product, Order, Leave, OrderProduct],
      synchronize: true
    })

  }),
    ConfigModule.forRoot(),
    UsersModule,
    ProductsModule,
    OrdersModule,
    RolesModule,
    OrderProductsModule,
    LeavesModule,
    AuthModule,
    CommonModule],
})
export class AppModule {}

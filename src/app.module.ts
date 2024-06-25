
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BuyerModule } from './buyer/buyer.module';
import { VenderModule } from './vender/vender.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { TransportersModule } from './transporters/transporters.module';
import { PaymentModule } from './payment/payment.module';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './account/account.module';
// import { AccountModule } from './account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Redis } from 'ioredis';

// -------------- service
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { TaskModule } from './task/task.module';
import { RedisModule } from './redis/redis.module';
import { OrderDetailModule } from './orderdetail/orderdetail.module';

@Module({
    // imports: [DatabaseModule, AuthModule, BuyerModule, VenderModule, ProductModule, OrderModule, TransportersModule, PaymentModule],
    imports: [
        // DatabaseModule,
        BuyerModule,
        VenderModule,
        AccountModule,
        AuthModule,
        JwtModule.register({}),
        CategoriesModule,
        RedisModule,
        TaskModule,
        OrderDetailModule,
        OrderModule,
    ],
})
export class AppModule {}


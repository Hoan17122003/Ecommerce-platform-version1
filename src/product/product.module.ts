import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from 'src/database/database.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { unknowProviders } from 'src/middleware/dynamic-providers.providers';
import { SanPhamEntity } from 'src/database/Entity/index.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { AccountModule } from 'src/account/account.module';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/Redis.service';
import { OrderModule } from 'src/order/order.module';
import { OrderDetailModule } from 'src/orderdetail/orderdetail.module';
import { OrderService } from 'src/order/order.service';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        AccountModule,
        JwtModule.register({}),
        RedisModule,
        HttpModule,
        // SseModule,
    ],
    providers: [
        unknowProviders('PRODUCT_REPOSITORY', SanPhamEntity),
        ProductService,
        AuthService,
        {
            provide: 'JwtAccessTokenGuard',
            useClass: JwtAccessTokenGuard,
        },
        JwtService,
        RedisService,
    ],
    controllers: [ProductController],
    exports: [ProductService],
})
export class ProductModule {}

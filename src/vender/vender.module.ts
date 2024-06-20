import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { unknowProviders } from '../middleware/dynamic-providers.providers';
import { NguoiBanHangEntity } from 'src/database/Entity/index.entity';
import { VenderService } from './vender.service';
import { VenderController } from './vender.controller';
import { ProductModule } from 'src/product/product.module';
import { DiscountCodeModule } from 'src/discountcode/discountcode.module';
import { ProductService } from 'src/product/product.service';
import { DiscountCodeService } from 'src/discountcode/discountcode.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { DiscountCodeDetailModule } from 'src/discountcodedetail/discountcodedetail.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.register({}),
        ProductModule,
        AuthModule,
        DiscountCodeModule,
        DiscountCodeDetailModule,
        RedisModule,
    ],
    providers: [unknowProviders('NGUOIBANHANG_REPOSITORY', NguoiBanHangEntity), VenderService, JwtService, AuthModule],
    controllers: [VenderController],
    exports: [VenderModule],
})
export class VenderModule {}

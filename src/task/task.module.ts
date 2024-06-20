import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from 'src/database/database.module';
import { DiscountCodeDetailService } from 'src/discountcodedetail/discountcodedetail.service';
import { TaskService } from './task.service';
import { ProductService } from 'src/product/product.service';
import { dataSource } from 'src/database/database.providers';
import { ChiTietMaGiamGiaEntity, MaGiamGiaEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { DiscountCodeService } from 'src/discountcode/discountcode.service';
import { RedisService } from 'src/redis/Redis.service';

@Module({
    imports: [ScheduleModule.forRoot(), DatabaseModule],
    providers: [
        TaskService,
        {
            provide: 'product',
            useFactory: () => {
                return new ProductService(dataSource.getRepository(SanPhamEntity), new RedisService());
            },
        },
        {
            provide: 'discountcode',
            useFactory: () => {
                return new DiscountCodeService(dataSource.getRepository(MaGiamGiaEntity));
            },
        },
        {
            provide: 'discountcodedetail',
            useFactory: () => {
                return new DiscountCodeDetailService(dataSource.getRepository(ChiTietMaGiamGiaEntity));
            },
        },
        RedisService,
    ],
})
export class TaskModule {}

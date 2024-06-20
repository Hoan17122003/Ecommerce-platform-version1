import { Module } from '@nestjs/common';
import { ChiTietMaGiamGiaEntity } from 'src/database/Entity/index.entity';
import { DatabaseModule } from 'src/database/database.module';
import { unknowProviders } from 'src/middleware/dynamic-providers.providers';
import { DiscountCodeDetailService } from './discountcodedetail.service';

@Module({
    imports: [DatabaseModule],
    providers: [unknowProviders('ChiTietMaGiamGia', ChiTietMaGiamGiaEntity), DiscountCodeDetailService],
    exports: [DiscountCodeDetailService],
})
export class DiscountCodeDetailModule {}

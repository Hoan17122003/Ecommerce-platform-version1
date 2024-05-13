import { Module } from '@nestjs/common';
import { DiscountCodeService } from './discountcode.service';
import { VenderModule } from 'src/vender/vender.module';
import { VenderService } from 'src/vender/vender.service';
import { unknowProviders } from 'src/middleware/dynamic-providers.providers';
import { MaGiamGiaEntity } from 'src/database/Entity/index.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [unknowProviders('MAGIAMGIA_REPOSITORY', MaGiamGiaEntity), DiscountCodeService],
    exports: [DiscountCodeService],
})
export class DiscountCodeModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { unknowProviders } from '../middleware/dynamic-providers.providers';
import { NguoiBanHangEntity } from 'src/database/Entity/index.entity';
import { VenderService } from './vender.service';
import { VenderController } from './vender.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
    imports: [DatabaseModule, ProductModule],
    providers: [unknowProviders('NGUOIBANHANG_REPOSITORY', NguoiBanHangEntity), VenderService],
    controllers: [VenderController],
    exports: [VenderModule],
})
export class VenderModule {}

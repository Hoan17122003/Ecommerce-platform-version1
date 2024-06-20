import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrderDetailService } from './orderdetail.service';
import { unknowProviders } from 'src/middleware/dynamic-providers.providers';
import { ChiTietDonHangEntity } from 'src/database/Entity/index.entity';
import { OrderDetailRepository } from 'src/database/Repository/ChiTietDonHang.repository';

@Module({
    imports: [DatabaseModule],
    providers: [unknowProviders('CHITIETDONHANGREPOSITORY', ChiTietDonHangEntity), OrderDetailService],
    exports: [OrderDetailService],
})
export class OrderDetailModule {}

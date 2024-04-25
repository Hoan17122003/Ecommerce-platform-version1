import { Module } from '@nestjs/common';
import { DiscountCodeService } from './discountcode.service';

@Module({
    providers: [DiscountCodeService],
})
export class DiscountCodeModule {}

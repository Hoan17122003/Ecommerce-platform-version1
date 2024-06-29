import { Controller, Get, Post, Delete, Put } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Buyer')
@Controller('buyer')
export class BuyerController {
    constructor(private readonly buyerService: BuyerService) {}

    @Post('test')
    async test() {
        return this.buyerService.test();
    }
}

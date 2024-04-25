import { Controller, Post } from '@nestjs/common';
import { VenderService } from './vender.service';

@Controller('NguoiBanHang')
export class VenderController {
    constructor(private readonly venderService: VenderService) {}

    @Post()
    async CreateDiscountCode() {}
}

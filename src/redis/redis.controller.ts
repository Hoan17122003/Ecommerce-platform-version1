import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RedisService } from './Redis.service';

@Controller('redis')
export class RedisController {
    constructor(private readonly redisService: RedisService) {}

    @Get('allproduct')
    public async test(@Res() res: Response) {
        try {
            return res.status(HttpStatus.OK).json({ data: await this.redisService.getAll() });
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('cache-product')
    public async setProduct(@Body('data') data: { productId: number; price: number }) {
        console.log('data : ', data);
        return this.redisService.setPrice(`ProductOfDiscount:${data.productId}`, data.price);
    }
}

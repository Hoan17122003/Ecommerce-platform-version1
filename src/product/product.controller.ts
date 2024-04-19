import { Controller, Get, Post, UseGuards, Body, Session, Delete, Param, ParseIntPipe } from '@nestjs/common';

import { ProductService } from './product.service';
import { Public } from 'src/decorators/auth.decorators';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { ProductDTO } from './dto/product.dto';
import { Roles } from 'src/decorators/role.decoratos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { session } from 'passport';
import { KichThuocMauSacDTO } from './dto/KichThuocMauSac.dto';

// @UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
@Controller('Product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Public()
    @Get()
    async AllProduct() {
        return this.productService.AllProduct();
    }

    @Roles('NguoiBanHang')
    @Post('createProduct')
    async CreateProduct(
        @Body() productDTO: ProductDTO,
        @Body() kichThuocMauSacDTO: KichThuocMauSacDTO[],
        @Session() session: Record<any, string>,
    ) {
        try {
            const maNguoiBanHang = await session.user['payload'];
            return this.productService.create(productDTO, maNguoiBanHang, kichThuocMauSacDTO);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Roles('NguoiBanHang')
    @Delete('remove/:ProductId')
    async DeleteProduct(
        @Param('ProductId', new ParseIntPipe()) maSanPham: number,
        @Session() session: Record<string, any>,
    ) {
        return this.productService.remove(maSanPham, session.user['payload']);
    }

    @Roles('NguoiBanHang')
    @Post('restore')
    async RestoreProduct(
        @Body('MaSanPham', new ParseIntPipe()) maSanPham: number,
        @Session() session: Record<string, any>,
    ) {
        return this.productService.restore(maSanPham, session.user['payload']);
    }
}

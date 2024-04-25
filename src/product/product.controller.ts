import {
    Controller,
    Get,
    Post,
    UseGuards,
    Body,
    Session,
    Delete,
    Param,
    ParseIntPipe,
    ParseArrayPipe,
    ForbiddenException,
    Put,
    Query,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { Public } from 'src/decorators/auth.decorators';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { ProductDTO } from './dto/product/product.dto';
import { Roles } from 'src/decorators/role.decoratos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { session } from 'passport';
import { KichThuocMauSacDTO } from './dto/kichthuocmausac/KichThuocMauSac.dto';
import { ProductInner } from './dto/product/ProductInner';
import { KichThuocMauSacInner } from './dto/kichthuocmausac/KichThuocMauSacInner';

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
        @Body()
        productDTO: ProductDTO,
        @Body() kichthuocmausac: KichThuocMauSacDTO,
        @Session() session: Record<any, string>,
    ) {
        const product: ProductDTO = new ProductInner()
            .setTenSanPham(productDTO.TenSanPham)
            .setAnhSanPham(productDTO.AnhSanPham)
            .setGiaBan(productDTO.GiaBan)
            .setThuongHieu(productDTO.ThuongHieu)
            .setMoTaSanPham(productDTO.MoTaSanPham)
            .Build();
        const kichThuocMauSac: KichThuocMauSacDTO = new KichThuocMauSacInner()
            .setKichThuoc(kichthuocmausac.KichThuoc)
            .setMauSac(kichthuocmausac.MauSac)
            .setSoLuong(kichthuocmausac.SoLuong)
            .Build();
        console.log('typeof : ', typeof kichthuocmausac.SoLuong);

        try {
            const maNguoiBanHang = await session.user['payload'];

            return this.productService.create(product, maNguoiBanHang, kichThuocMauSac);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Roles('NguoiBanHang')
    @Delete('remove/:ProductId')
    async SoftDeleteProduct(
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

    @Roles('NguoiBanHang')
    @Delete('trashCan/delete')
    async DeleteProduct(
        @Body('MaSanPham', new ParseIntPipe()) maSanPham: number,
        @Session() session: Record<string, any>,
    ) {
        try {
            const maNguoiBanHang = session.user['payload'];

            return this.productService.DeletedProduct(maSanPham, maNguoiBanHang);
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    // task 20/04/2024 đổ dữ liệu vào các ô cũ
    @Roles('NguoiBanHang')
    @Get('change/:MaSanPham')
    async BeforeChangeProduct(@Param('MaSanPham') product: number, @Session() session: Record<string, any>) {
        const maNguoiBanHang = await session.user['payload'];
        return this.productService.getInformationProduct(product, maNguoiBanHang);
    }

    // thay đổi thông tin mới vào dữ liệu cũ
    @Roles('NguoiBanHang')
    @Put('change')
    async AfterChangeProduct(
        @Body() ProductDTO,
        @Body() kichThuocMauSacDTO: KichThuocMauSacDTO,
        @Session() session: Record<string, any>,
    ) {
        try {
            const maNguoiBanHang = session.user['payload'];
            return this.productService.ChangeInformationProduct(ProductDTO, kichThuocMauSacDTO, maNguoiBanHang);
        } catch (error) {}
    }

    // @Get('store/:MaNguoiBanHang')
    // async store() {
    //     return
    // }
}

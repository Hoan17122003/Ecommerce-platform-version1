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
    Patch,
} from '@nestjs/common';
import { interval, map, Observable, of } from 'rxjs';

import { ProductService } from './product.service';
import { Public } from 'src/decorators/auth.decorators';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { ProductDTO } from './dto/product/product.dto';
import { Roles } from 'src/decorators/role.decoratos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ChiTietSanPhamDTO } from './dto/ChiTietSanPham/ChiTietSanPham.dto';
import { ProductInner } from './dto/product/ProductInner';
import { dataSource } from 'src/database/database.providers';
import { NguoiBanHangEntity, NguoiMuaHangEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { UserRole } from 'src/account/enums/role.enum';
// @UseGuards(RolesGuard)

@UseGuards(JwtAccessTokenGuard)
@Controller('Product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        // private readonly primusService: PrimusService,
    ) {}

    @Public()
    @Get()
    async AllProduct() {
        return this.productService.AllProduct();
    }

    @Roles(UserRole.NguoiBanHang)
    @UseGuards(RolesGuard)
    @Post('createProduct')
    async CreateProduct(
        @Body()
        productDTO: ProductDTO,
        @Body('ChiTietSanPham') ChiTietSanPham: ChiTietSanPhamDTO | ChiTietSanPhamDTO[],
        @Session() session: Record<any, string>,
    ) {
        const products: SanPhamEntity[] = await this.AllProduct();
        let state = false;

        if (products.length > 0) {
            let leftPos = 0;
            let rightPost = products.length - 1;
            while (leftPos < rightPost) {
                let mid = Math.floor((leftPos + rightPost) / 2);
                if (productDTO.TenSanPham >= products[mid].TenSanPham) {
                    leftPos = mid;
                } else {
                    rightPost = mid;
                }
                if (productDTO.TenSanPham === products[mid].TenSanPham) {
                    state = true;
                }
            }
        }

        if (state) throw new ForbiddenException('Tên sản phẩm đã tồn tại');

        const product: ProductDTO = new ProductInner()
            .setTenSanPham(productDTO.TenSanPham)
            .setAnhSanPham(productDTO.AnhSanPham)
            .setGiaBan(productDTO.GiaBan)
            .setThuongHieu(productDTO.ThuongHieu)
            .setMoTaSanPham(productDTO.MoTaSanPham)
            .setCategoty(productDTO.CategoryId)
            .Build();

        try {
            const maNguoiBanHang = await session.user['payload'];
            const nguoiBanHang = await dataSource
                .getRepository(NguoiBanHangEntity)
                .createQueryBuilder()
                .where('MaNguoiBanHang = :maNguoiBanHang', {
                    maNguoiBanHang,
                })
                .getOne();

            return this.productService.create(product, ChiTietSanPham, nguoiBanHang);
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    @Roles('NguoiBanHang')
    @UseGuards(RolesGuard)
    @Delete('remove/:ProductId')
    async SoftDeleteProduct(
        @Param('ProductId', new ParseIntPipe()) maSanPham: number,
        @Session() session: Record<string, any>,
    ) {
        return this.productService.remove(maSanPham, session.user['payload']);
    }

    @Roles(UserRole.NguoiBanHang)
    @UseGuards(RolesGuard)
    @Patch('restore')
    async RestoreProduct(
        @Body('MaSanPham', new ParseIntPipe()) maSanPham: number,
        @Session() session: Record<string, any>,
    ) {
        return this.productService.restore(maSanPham, session.user['payload']);
    }

    @Roles('NguoiBanHang')
    @UseGuards(RolesGuard)
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
    @UseGuards(RolesGuard)
    @Get('change/:MaSanPham')
    async BeforeChangeProduct(@Param('MaSanPham') product: number, @Session() session: Record<string, any>) {
        const maNguoiBanHang = await session.user['payload'];
        return this.productService.getInformationProductDetail(product, maNguoiBanHang);
    }

    // thay đổi thông tin mới vào dữ liệu cũ
    @Roles('NguoiBanHang')
    @UseGuards(RolesGuard)
    @Put('change')
    async AfterChangeProduct(
        @Body() ProductDTO,
        @Body() ChiTietSanPhamDTO: ChiTietSanPhamDTO,
        @Session() session: Record<string, any>,
    ) {
        try {
            const maNguoiBanHang = session.user['payload'];
            return this.productService.ChangeInformationProduct(ProductDTO, ChiTietSanPhamDTO, maNguoiBanHang);
        } catch (error) {}
    }

    //buy product for buyer
}

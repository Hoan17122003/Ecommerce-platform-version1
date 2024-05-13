import { Controller, Post, UseGuards, Get, Param, Body, Session } from '@nestjs/common';
import { VenderService } from './vender.service';
import { LocalAuthGuard } from 'src/auth/guard/LocalAuth.guard';
import { Roles } from 'src/decorators/role.decoratos';
import { MaGiamGiaDTO } from 'src/discountcode/dto/MaGiamGia.dto';
import { ProductService } from 'src/product/product.service';
import { DiscountCodeService } from 'src/discountcode/discountcode.service';
import { DiscountCodeDetailService } from 'src/discountcodedetail/discountcodedetail.service';
import { NguoiBanHangEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(LocalAuthGuard)
@Controller('NguoiBanHang')
export class VenderController {
    constructor(
        private readonly venderService: VenderService,
        private readonly productService: ProductService,
        private readonly discountcodeService: DiscountCodeService,
        private readonly discountcodeDetailService: DiscountCodeDetailService,
    ) {}

    @Post()
    async CreateDiscountCode() {}

    @Roles('NguoiBanHang')
    @UseGuards(RolesGuard)
    @Get('store/product/discount-code/:ProductId')
    async ProductDiscountRender(
        @Param('ProductId') maSanPham: number,
        @Body() data: MaGiamGiaDTO,
        @Session() session: Record<string, any>,
    ) {
        try {
            const giamGia = await this.discountcodeService.create(data);
            const maNguoiBanHang = await session.user['payload'];
            const nguoiBanHang: NguoiBanHangEntity = await this.venderService.getThisData(maNguoiBanHang);
            const sanPham: SanPhamEntity = await this.productService.getInformation(maSanPham, maNguoiBanHang);
            await this.discountcodeDetailService.create({
                nguoiBanHang,
                sanPham,
                giamGia,
                SoLuong: data.SoLuongSanPham,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

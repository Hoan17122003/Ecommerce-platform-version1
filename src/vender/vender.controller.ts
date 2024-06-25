import {
    Controller,
    Post,
    UseGuards,
    Get,
    Param,
    Body,
    Session,
    ForbiddenException,
    Delete,
    Res,
    Inject,
} from '@nestjs/common';
import { Response } from 'express';

import { VenderService } from './vender.service';
import { ROLES, Roles } from 'src/decorators/role.decoratos';
import { MaGiamGiaDTO } from 'src/discountcode/dto/MaGiamGia.dto';
import { ProductService } from 'src/product/product.service';
import { DiscountCodeService } from 'src/discountcode/discountcode.service';
import { DiscountCodeDetailService } from 'src/discountcodedetail/discountcodedetail.service';
import { MaGiamGiaEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { UserRole } from 'src/account/enums/role.enum';
import { RedisService } from 'src/redis/Redis.service';
import { ChiTietMaGiamGia } from 'src/database/Entity/ChiTietMaGiamGia.entity';

@UseGuards(JwtAccessTokenGuard)
@Controller('NguoiBanHang')
export class VenderController {
    constructor(
        private readonly venderService: VenderService,
        private readonly productService: ProductService,
        private readonly discountcodeService: DiscountCodeService,
        private readonly discountcodeDetailService: DiscountCodeDetailService,
        private readonly redisService: RedisService,
    ) {}

    // create discount code for product execution change price product
    @Roles(UserRole.NguoiBanHang)
    @UseGuards(RolesGuard)
    @Post('store/discountcode/create')
    async CreateDiscountCode(
        @Session() session: Record<string, any>,
        @Body()
        data: {
            productId: string[] | string;
            soLuong: number[] | number | string[] | string;
            discount: number;
            thoiGianBatDau: string | null;
            thoiGianKetThuc: string | null;
            loaiGiamGia: string;
        },
    ) {
        const maNguoiBanHang = session.user['payload'];
        const nguoiBanHang = await this.venderService.me(maNguoiBanHang);
        let soLuong: number[] = data.soLuong.toString().split(',').map(Number);

        // const flag = await this.discountcodeDetailService.checkProduct(data.productId);

        let maGiamGiaId;
        // const thoigianke

        const magiamgiaDTO = new MaGiamGiaDTO(
            data.loaiGiamGia,
            data.thoiGianBatDau,
            data.thoiGianKetThuc,
            data.discount,
        );
        const container: number[] = data.productId.toString().split(',').map(Number);
        const maGiamGia: MaGiamGiaEntity = await this.discountcodeService.create(magiamgiaDTO);
        maGiamGiaId = maGiamGia.MaGiamGiaId;
        if (data.loaiGiamGia === 'Ap Đặt') {
            for (let i = 0; i < container.length; i++) {
                let sanPham: SanPhamEntity = await this.productService.findProductId(container[i], maNguoiBanHang);
                if (!sanPham) throw new ForbiddenException('mã sản phẩm thêm vào không hợp lệ');

                await this.discountcodeDetailService.create(
                    maNguoiBanHang,
                    sanPham.MaSanPham,
                    maGiamGia.MaGiamGiaId,
                    soLuong[i],
                );
                // const newPrice = sanPham.GiaBan - sanPham.GiaBan * (maGiamGia.discount / 100); ta sẽ lập 1 lịch thời gian để update giá trên sản phẩm thông qua thuộc tính thời gian của table mã giảm gái
                // this.productService.updatePrice(sanPham.MaSanPham, newPrice, chitietmagiamgia);
            }
        } else if (data.loaiGiamGia === 'Lựa Chọn ') {
            for (let i = 0; i < container.length; i++) {
                let sanPham: SanPhamEntity = await this.productService.findProductId(container[i], maNguoiBanHang);
                if (!sanPham) throw new ForbiddenException('mã sản phẩm thêm vào không hợp lệ');

                const chitietmagiamgia = await this.discountcodeDetailService.create(
                    maNguoiBanHang,
                    sanPham.MaSanPham,
                    maGiamGia.MaGiamGiaId,
                    soLuong[i],
                );
            }
        }

        return maGiamGiaId;
    }

    // what is happend code ?
    //?
    // @Get('store/product/discount-code/:ProductId')
    // async ProductDiscountRender(
    //     @Param('ProductId') maSanPham: number,
    //     @Body() data: MaGiamGiaDTO,
    //     @Session() session: Record<string, any>,
    // ) {
    //     try {
    //         const giamGia = await this.discountcodeService.create(data);
    //         const maNguoiBanHang = await session.user['payload'];
    //         const nguoiBanHang: NguoiBanHangEntity = await this.venderService.getThisData(maNguoiBanHang);
    //         const sanPham: SanPhamEntity = await this.productService.getInformation(maSanPham, maNguoiBanHang);
    //         await this.discountcodeDetailService.create({
    //             nguoiBanHang,
    //             sanPham,
    //             giamGia,
    //             SoLuong: data.SoLuongSanPham,
    //         });
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }
    // ?
    @Roles(UserRole.NguoiBanHang)
    @UseGuards(RolesGuard)
    @Get('store/discountcode')
    async getDiscounts(@Res() res: Response) {
        return res.status(200).json({
            discountcode: this.discountcodeService.getAll(),
            discountcodedetail: this.discountcodeDetailService.getAll(),
        });
    }
    @Roles(UserRole.NguoiBanHang)
    @UseGuards(RolesGuard)
    @Delete('store/discountcode/delete')
    async destroyDiscountCode(@Session() session, @Body('MaGiamGiaId') maGiamGiaId: number[]) {
        const maNguoiBanHang = await session.user['payload'];

        maGiamGiaId = maGiamGiaId.toString().split(',').map(Number);

        try {
            for (let elemennt = 0; elemennt < maGiamGiaId.length; elemennt++) {
                const magiamgia = await this.discountcodeService.findByIdD(maGiamGiaId[elemennt]);

                if (magiamgia.isActive && magiamgia.LoaiGiamGia === 'Áp Đặt') {
                    const ChitietmagiamgiaOfProduct: ChiTietMaGiamGia[] =
                        await this.discountcodeDetailService.findDCDbyIds(magiamgia.MaGiamGiaId);

                    ChitietmagiamgiaOfProduct.forEach(async (elemennt) => {
                        this.redisService.remove(`ProductOfDiscount:${elemennt.product}`);
                    });
                }
                const state = await this.discountcodeDetailService.destroy(maGiamGiaId[elemennt], maNguoiBanHang);
                // if (!state)
                //     throw new Error(
                //         `Id mã giảm giá : ${maGiamGiaId[elemennt]} không thuộc ${maNguoiBanHang} của người bán hàng`,
                //     );
                const flag = await this.discountcodeService.destroy(maGiamGiaId[elemennt]);
                if (!flag) throw new Error('error ... lỗi không thể xoá');
            }
            return 'xoá mã giảm giá thành công';
        } catch (error) {
            throw new Error(error);
        }
    }
}

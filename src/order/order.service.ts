import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { DonHang } from 'src/database/Entity/DonHang.entity';
import { ChiTietDonHangEntity, DonHangEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { OrderRepository, DonHangRepository } from 'src/database/Repository/DonHang.repository';
import { BaseService } from 'src/database/base.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/database/Entity/SanPham.entity';
import { OrderDTO } from './dto/order.dto';
import { dataSource } from 'src/database/database.providers';

@Injectable()
export class OrderService extends BaseService<DonHangEntity, DonHangRepository> {
    private OrderRepository: OrderRepository;

    constructor(
        @Inject('BILL_REPOSITORY') private readonly donhangRepository: DonHangRepository,
        private readonly productService: ProductService,
        private readonly orderServiceDetail: OrderDetailService,
    ) {
        super(donhangRepository);
        this.OrderRepository = new OrderRepository();
    }

    async test(OrderDetailService: OrderDetailService) {
        console.log('inject test : ', await OrderDetailService.test());
        return this.OrderRepository.test();
    }

    async buyProduct(
        maNguoiMuaHang: number,
        data: OrderDTO,
    ): Promise<{ Chitietdonhang: ChiTietDonHangEntity; Donhang: DonHangEntity }> {
        try {
            const sanPham: Product = await dataSource
                .getRepository(SanPhamEntity)
                .createQueryBuilder()
                .where('MaSanPham = :maSanPham', {
                    maSanPham: data.MaSanPham,
                })
                .getOne();
            const donhangEntity: DonHangEntity = new DonHangEntity(
                maNguoiMuaHang,
                sanPham.Manguoibanhang,
                data.discount,
                data.diaChi,
                data.phuongThucThanhToan,
            );
            const donhang = await donhangEntity.save();
            console.log('don hang : ', donhang);

            const chitietdonhang = await this.orderServiceDetail.createBillDetail(
                sanPham,
                donhang,
                data.SoLuong,
                data.KichThuoc,
                data.MauSac,
            );
            console.log('chitietdonhang : ', chitietdonhang);
            return {
                Chitietdonhang: chitietdonhang,
                Donhang: donhangEntity,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}

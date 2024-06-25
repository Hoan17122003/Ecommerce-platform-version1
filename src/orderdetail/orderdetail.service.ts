import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { DonHang } from 'src/database/Entity/DonHang.entity';
import { Product } from 'src/database/Entity/SanPham.entity';
import { ChiTietDonHangEntity } from 'src/database/Entity/index.entity';
import { OrderDetailRepository, ChiTietDonHangRepository } from 'src/database/Repository/ChiTietDonHang.repository';
import { BaseService } from 'src/database/base.service';

@Injectable()
export class OrderDetailService extends BaseService<ChiTietDonHangEntity, ChiTietDonHangRepository> {
    private OrderDetailRepository: OrderDetailRepository;

    constructor(
        @Inject('CHITIETDONHANGREPOSITORY') private readonly chitietdonhangRepository: ChiTietDonHangRepository,
    ) {
        super(chitietdonhangRepository);
        this.OrderDetailRepository = new OrderDetailRepository();
    }

    async test() {
        return this.OrderDetailRepository.test();
    }

    async createBillDetail(
        sanPham: Product,
        donHang: DonHang,
        SoLuongMua: number,
        KichThuoc: string,
        MauSac: string,
    ): Promise<ChiTietDonHangEntity | null> {
        let result: ChiTietDonHangEntity = null;
        try {
            const billDetailEntity: ChiTietDonHangEntity = new ChiTietDonHangEntity(
                sanPham.MaSanPham,
                donHang.MaDonHang,
                KichThuoc,
                MauSac,
                SoLuongMua,
            );
            billDetailEntity.donhang = donHang;
            billDetailEntity.sanpham = sanPham;
            result = await this.chitietdonhangRepository.save(billDetailEntity);
            console.log('result : ', result);
        } catch (error) {
            throw new Error(error);
        }
        return result;
    }
}

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
import { ChiTietSanPhamEntity } from 'src/database/Entity/ChiTietSanPham.entity';
import { ChiTietSanPhamDTO } from 'src/product/dto/chitietsanpham/ChiTietSanPham.dto';
import { donhangDTO, khachangDTO } from './dto/khachang.type';

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

    // thêm nhiều thông tin đơn hàng ...
    async buyProduct(
        maNguoiMuaHang: number,
        donHang: donhangDTO,
        khachang: khachangDTO,
    ): Promise<{ Chitietdonhang: ChiTietDonHangEntity; Donhang: DonHangEntity }> {
        try {
            let donhangEntity: DonHangEntity;
            let chitietdonhang: ChiTietDonHangEntity;
            let donhangTemp: DonHangEntity;
            for (const element in donHang) {
                const sanPham: Product = await dataSource
                    .getRepository(SanPhamEntity)
                    .createQueryBuilder()
                    .where('MaSanPham = :maSanPham', {
                        maSanPham: element,
                    })
                    .getOne();
                // boc tach cac key
                if (!sanPham) throw new Error('sản phẩm không tồn tại');
                if (!donhangEntity) {
                    console.log('donhangEntity : ', donhangEntity);
                    donhangEntity = new DonHangEntity(
                        maNguoiMuaHang,
                        sanPham.Manguoibanhang,
                        khachang.MaGiamGia,
                        khachang.diaChi,
                        khachang.phuongThucThanhToan,
                    );
                    donhangTemp = await donhangEntity.save();
                }

                for (let item of donHang[element]) {
                    console.log('itme : ', item);
                    const chiTietSanPham = await dataSource
                        .getRepository(ChiTietSanPhamEntity)
                        .createQueryBuilder()
                        .where('MaSanPham = :maSanPham', {
                            maSanPham: element,
                        })
                        .andWhere('KichThuoc = :kichThuoc', {
                            kichThuoc: item.KichThuoc,
                        })
                        .andWhere('MauSac = :mauSac', {
                            mauSac: item.MauSac,
                        })
                        .getOne();
                    if (!chiTietSanPham) throw new ForbiddenException('thông tin chi tiết sản phẩm không đúng');
                    else if (chiTietSanPham.SoLuong - chiTietSanPham.SoLuong < 0)
                        throw new ForbiddenException(
                            'Số lượng sản phẩm không đủ để đáp ứng nhu cầu mua của khách hàng',
                        );
                    chitietdonhang = await this.orderServiceDetail.createBillDetail(
                        sanPham,
                        donhangTemp,
                        item.SoLuong,
                        item.KichThuoc,
                        item.MauSac,
                    );
                }
            }

            return {
                Chitietdonhang: chitietdonhang,
                Donhang: donhangEntity,
            };
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async getOrder(id: number) {
        return this.donhangRepository.findOne({
            where: {
                MaDonHang: id,
            },
            relations: {
                chitietdonhang: true,
            },
        });
    }
}

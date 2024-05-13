import { Inject, Injectable } from '@nestjs/common';
import { MaGiamGia } from 'src/database/Entity/MaGiamGia.entity';
import { ChiTietMaGiamGiaEntity, NguoiBanHangEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { ChiTietMaGiamGiaRepository } from 'src/database/Repository/ChiTietMaGiamGia.repository';
import { BaseService } from 'src/database/base.service';

@Injectable()
export class DiscountCodeDetailService extends BaseService<ChiTietMaGiamGiaEntity, ChiTietMaGiamGiaRepository> {
    constructor(@Inject('ChiTietMaGiamGia') private readonly chiTietMaGiamGiaRepository: ChiTietMaGiamGiaRepository) {
        super(chiTietMaGiamGiaRepository);
    }

    async create(data: {
        nguoiBanHang: NguoiBanHangEntity;
        sanPham: SanPhamEntity;
        giamGia: MaGiamGia;
        SoLuong: number;
    }) {
        const discountcodeDetailEntity = new ChiTietMaGiamGiaEntity();
        discountcodeDetailEntity.MaGiamGiaId = data.giamGia;
        discountcodeDetailEntity.nguoiBanHang = data.nguoiBanHang;
        discountcodeDetailEntity.product = data.sanPham;
        discountcodeDetailEntity.SoLuongSanPhamKhuyenMai = data.SoLuong;
        return this.chiTietMaGiamGiaRepository.save(discountcodeDetailEntity);
    }
}

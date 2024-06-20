import { Inject, Injectable } from '@nestjs/common';
import { MaGiamGia } from 'src/database/Entity/MaGiamGia.entity';
import { ChiTietMaGiamGiaEntity, NguoiBanHangEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { ChiTietMaGiamGiaRepository, DiscountCodeDetailRP } from 'src/database/Repository/ChiTietMaGiamGia.repository';
import { BaseService } from 'src/database/base.service';

@Injectable()
export class DiscountCodeDetailService extends BaseService<ChiTietMaGiamGiaEntity, ChiTietMaGiamGiaRepository> {
    private DSCrepository: DiscountCodeDetailRP;

    constructor(@Inject('ChiTietMaGiamGia') private readonly chiTietMaGiamGiaRepository: ChiTietMaGiamGiaRepository) {
        super(chiTietMaGiamGiaRepository);
        this.DSCrepository = new DiscountCodeDetailRP();
    }

    async create(nguoiBanHang: number, sanPham: number, giamGia: number, SoLuong: number) {
        try {
            const discountcodeDetailEntity = new ChiTietMaGiamGiaEntity();
            discountcodeDetailEntity.MaGiamGiaId = giamGia;
            discountcodeDetailEntity.nguoiBanHang = nguoiBanHang;
            discountcodeDetailEntity.product = sanPham;
            discountcodeDetailEntity.SoLuongMaGiamGia = SoLuong;
            return this.chiTietMaGiamGiaRepository.save(discountcodeDetailEntity);
        } catch (error) {
            throw new Error(error);
        }
    }

    // overide
    async destroy(id: number, maNguoiBanHang: number): Promise<number> {
        return (
            await this.chiTietMaGiamGiaRepository
                .createQueryBuilder()
                .delete()
                .where('MaGiamGiaId = :id', { id })
                .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                    maNguoiBanHang,
                })
                .execute()
        ).affected;
    }

    async findDCDbyIds(id: number): Promise<ChiTietMaGiamGiaEntity[] | undefined> {
        const discountcodedetail: ChiTietMaGiamGiaEntity[] = await this.chiTietMaGiamGiaRepository.find({
            select: {
                product: true,
            },
            where: {
                MaGiamGiaId: id,
            },
        });
        return discountcodedetail;
    }

    async getAll(): Promise<ChiTietMaGiamGiaEntity[] | undefined> {
        return this.chiTietMaGiamGiaRepository.find().then((entity) => (entity ? entity : undefined));
    }

    async updatePrice(magiamgiaId: number, discount: number) {
        return this.DSCrepository.UpdatePriceOfProduct(magiamgiaId, discount);
    }

    async checkProduct(productId: number) {
        return 1;
    }

    remove(chitietmagiamgia: ChiTietMaGiamGiaEntity): void {
        this.chiTietMaGiamGiaRepository
            .createQueryBuilder()
            .delete()
            .where('MaSanPham = :productId', {
                productId: chitietmagiamgia.MaGiamGiaId,
            })
            .andWhere('MaGiamGiaId = :magiamgiaId', {
                magiamgiaId: chitietmagiamgia.MaGiamGiaId,
            })
            .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                maNguoiBanHang: chitietmagiamgia.nguoiBanHang,
            })
            .execute();
    }
}

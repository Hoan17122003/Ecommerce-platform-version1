import { Injectable, Inject, ForbiddenException } from '@nestjs/common';

import { NguoiBanHangEntity, SanPhamEntity } from 'src/database/Entity/index.entity';
import { SanPhamRepository } from 'src/database/Repository/SanPham.repository';

// import { ProductRepository } from 'src/database/Repository/SanPham.repository';
import { BaseService } from 'src/database/base.service';
import { ProductDTO } from './dto/product/product.dto';
import { ProductRepository } from '../database/Repository/SanPham.repository';
import { KichThuocMauSacDTO } from './dto/kichthuocmausac/KichThuocMauSac.dto';

@Injectable()
export class ProductService extends BaseService<SanPhamEntity, SanPhamRepository> {
    private productRepository: ProductRepository;

    constructor(@Inject('PRODUCT_REPOSITORY') private readonly rePository: SanPhamRepository) {
        super(rePository);
        this.productRepository = new ProductRepository();
    }

    async AllProduct(): Promise<SanPhamEntity[]> {
        try {
            return this.productRepository.findAll();
        } catch (error) {
            console.log('hehehe');
            throw new Error(error);
        }
    }

    async create(
        productDTO: ProductDTO,
        nguoiBanHang: NguoiBanHangEntity,
        maNguoiBanHang: number,
        kichThuocMauSac: KichThuocMauSacDTO,
    ): Promise<number | undefined> {
        console.log('thông tin người bán hàng : ', nguoiBanHang);

        try {
            const sanPham = new SanPhamEntity(
                productDTO.TenSanPham,
                productDTO.GiaBan,
                productDTO.AnhSanPham,
                productDTO.MoTaSanPham,
                productDTO.ThuongHieu,
            );
            sanPham.maNguoiBanHang = nguoiBanHang.MaNguoiBanHang;

            console.log('SanPham Entity : ', sanPham);
            const result = await this.productRepository.addProduct(sanPham, nguoiBanHang, kichThuocMauSac);

            return result;
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async remove(maSanPham: number, maNguoiBanHang: number): Promise<SanPhamEntity | SanPhamEntity[] | number> {
        return this.productRepository.softDelete(maSanPham, maNguoiBanHang);
    }

    async restore(
        maSanPham: number,
        maNguoiBanHang: number,
    ): Promise<SanPhamEntity | number | SanPhamEntity[] | undefined> {
        return this.productRepository.restore(maSanPham, maNguoiBanHang);
    }

    async DeletedProduct(maSanPham: number, maNguoiBanHang: number): Promise<string> {
        try {
            const result = await this.productRepository.findDelete(maSanPham, maNguoiBanHang);
            if (!result) throw new ForbiddenException('không thể xoá');
            return 'xoá thành công';
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async getInformationProductDetail(
        ProductId: number,
        maNguoiBanHang: number,
    ): Promise<{ SanPhamEntity; KichThuocMauSacEntity }> {
        return this.productRepository.InformationProduct(ProductId, maNguoiBanHang);
    }

    async getInformation(maSanPham: number, maNguoiBanHang: number) {
        return this.repository
            .createQueryBuilder()
            .where('MaSanPham = :maSanPham', { maSanPham })
            .andWhere('MaNguoiBanHang = :', { maNguoiBanHang })
            .getOne();
    }

    async ChangeInformationProduct(
        productDTO: ProductDTO,
        kichThuocMauSacDTO: KichThuocMauSacDTO,
        maNguoiBanHang: number,
    ): Promise<number> {
        // let container = [];
        // for (let i in data) {
        //     if (data[i] ?? 0) {
        //         container.push(i);
        //     }
        // }

        return this.productRepository.ChangeInformationProduct(productDTO, kichThuocMauSacDTO, maNguoiBanHang);
    }
}

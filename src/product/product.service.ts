import { Injectable, Inject } from '@nestjs/common';

import { SanPhamEntity } from 'src/database/Entity/index.entity';
import { SanPhamRepository } from 'src/database/Repository/SanPham.repository';
// import { ProductRepository } from 'src/database/Repository/SanPham.repository';
import { BaseService } from 'src/database/base.service';
import { ProductDTO } from './dto/product.dto';
import { ProductRepository } from '../database/Repository/SanPham.repository';
import { KichThuocMauSacDTO } from './dto/KichThuocMauSac.dto';

@Injectable()
export class ProductService extends BaseService<SanPhamEntity, SanPhamRepository> {
    private productRepository: ProductRepository;

    constructor(@Inject('PRODUCT_REPOSITORY') private readonly rePository: SanPhamRepository) {
        super(rePository);
        this.productRepository = new ProductRepository();
    }

    async AllProduct(): Promise<SanPhamEntity[]> {
        return this.productRepository.findAll();
    }

    async create(
        productDTO: ProductDTO,
        maNguoiBanHang: number,
        kichThuocMauSac: KichThuocMauSacDTO | KichThuocMauSacDTO[],
    ): Promise<number | undefined> {
        try {
            // if()
            console.log('product : ', productDTO);

            const sanPham = new SanPhamEntity(
                productDTO.TenSanPham,
                productDTO.GiaBan,
                productDTO.AnhSanPham,
                productDTO.MoTaSanPham,
                productDTO.ThuongHieu,
            );
            const result = await this.productRepository.addProduct(sanPham, maNguoiBanHang, kichThuocMauSac);

            return result;
        } catch (error) {
            throw new Error(error);
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
}

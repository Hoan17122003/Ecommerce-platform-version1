import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import * as Axios from 'axios';

import {
    ChiTietDonHangEntity,
    ChiTietMaGiamGiaEntity,
    DonHangEntity,
    NguoiBanHangEntity,
    SanPhamEntity,
} from 'src/database/Entity/index.entity';
import { SanPhamRepository } from 'src/database/Repository/SanPham.repository';

import { BaseService } from 'src/database/base.service';
import { ProductDTO } from './dto/product/product.dto';
import { ProductRepository } from '../database/Repository/SanPham.repository';
import { ChiTietSanPhamDTO } from './dto/ChiTietSanPham/ChiTietSanPham.dto';
import { dataSource } from 'src/database/database.providers';
import { Categories } from 'src/database/Entity/categories.entity';
import { RedisService } from 'src/redis/Redis.service';

@Injectable()
export class ProductService extends BaseService<SanPhamEntity, SanPhamRepository> {
    private productRepository: ProductRepository;
    private products: SanPhamEntity[] = null;
    private flagTime: Date;

    constructor(
        @Inject('PRODUCT_REPOSITORY') private readonly rePository: SanPhamRepository,
        private readonly redisService: RedisService,
        // private readonly OrderService: OrderService,
        // private readonly OrderDetailService: OrderDetailService,
    ) {
        super(rePository);
        this.productRepository = new ProductRepository();
    }

    async AllProduct(): Promise<SanPhamEntity[]> {
        try {
            // lấy dữ liệu ở bộ nhớ đệm trước nếu không có thì sẽ truy xuất qua DB
            const now = new Date(Date.now());
            now.setMinutes(-30);
            if (this.products === null || this.flagTime.toLocaleString('vi') >= now.toLocaleString('vi')) {
                this.products = await this.productRepository.findAll();
                if (this.products.length == 0) return this.products;
                let redisProducts = await this.redisService.getAll();

                for (let key in redisProducts) {
                    const pos = await this.findId(this.products, parseInt(key, 10));
                    if (pos == -1) {
                        continue;
                    }
                    this.products[pos].GiaBan = redisProducts[key];
                    // console.log('value product ', this.products[pos].GiaBan, ' id : ', this.products[pos].MaSanPham);
                }
                this.flagTime = new Date(Date.now());
            }
            return this.products;
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(
        productDTO: ProductDTO,
        ChiTietSanPham: ChiTietSanPhamDTO[] | ChiTietSanPhamDTO,
        nguoiBanHang: NguoiBanHangEntity,
    ): Promise<SanPhamEntity | undefined> {
        try {
            const category = await dataSource.getRepository(Categories).find({
                where: {
                    categoryId: productDTO.CategoryId,
                },
            });

            if (!category) throw new Error('sản phẩm không nằm trong phạm vi category');
            const sanPham = new SanPhamEntity(
                productDTO.TenSanPham,
                productDTO.GiaBan,
                productDTO.AnhSanPham,
                productDTO.MoTaSanPham,
                productDTO.ThuongHieu,
                productDTO.CategoryId,
            );
            sanPham.Manguoibanhang = nguoiBanHang.MaNguoiBanHang;
            sanPham.seller = nguoiBanHang;

            const result = await this.productRepository.addProduct(sanPham, ChiTietSanPham);

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

    async DeletedProduct(maSanPham: number, maNguoiBanHang: number): Promise<string> {
        try {
            const result = await this.productRepository.findDelete(maSanPham, maNguoiBanHang);
            console.log('result : ', result);
            if (!result) throw new ForbiddenException('không thể xoá');
            return 'xoá thành công';
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async getInformationProductDetail(
        ProductId: number,
        maNguoiBanHang: number,
    ): Promise<{ SanPhamEntity; ChiTietSanPhamEntity }> {
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
        ChiTietSanPhamDTO: ChiTietSanPhamDTO,
        maNguoiBanHang: number,
    ): Promise<number> {
        return this.productRepository.ChangeInformationProduct(productDTO, ChiTietSanPhamDTO, maNguoiBanHang);
    }

    async findProductId(id: number, maNguoiBanHang?: number): Promise<SanPhamEntity | undefined> {
        console.log(typeof id, id);
        console.log(typeof maNguoiBanHang, maNguoiBanHang);
        const product = await this.rePository.findOne({
            where: {
                MaSanPham: id,
                Manguoibanhang: maNguoiBanHang,
            },
        });
        return product;
    }

    async updatePrice(maSanPham: number, newPrice: number, chitietmagiamgiA: ChiTietMaGiamGiaEntity): Promise<Number> {
        return (await this.rePository.update({ MaSanPham: maSanPham }, { GiaBan: newPrice })).affected;
    }
    test() {
        return 'hehehe';
    }

    //optimize algorithm search with interpolation search
    async findId(products: SanPhamEntity[], productId: number): Promise<number> {
        let left = 0;
        let right = products.length - 1;
        while (
            products[right].MaSanPham != products[left].MaSanPham &&
            productId >= products[left].MaSanPham &&
            productId <= products[right].MaSanPham
        ) {
            let mid =
                left +
                ((right - left) * (productId - products[left].MaSanPham)) /
                    (products[right].MaSanPham - products[left].MaSanPham);
            if (products[mid].MaSanPham < productId) left = mid + 1;
            else if (products[mid].MaSanPham > productId) right = mid - 1;
            else {
                if (mid > 0 && products[mid - 1].MaSanPham == productId) right = mid - 1;
                else return mid;
            }
        }
        if (products[left].MaSanPham == productId) return left;
        return -1;
    }

    async setPrice(productId: number, discount: number, flag: number): Promise<void> {
        const cacheKey = `ProductOfDiscount:${productId}`;
        let newPrice;
        console.log('flag : ', flag);
        if (flag) {
            newPrice = this.redisService.remove(cacheKey);
        } else {
            console.log('update price');
            const products = await this.AllProduct();
            let pos = await this.findId(products, productId);
            const price = products[pos].GiaBan;
            newPrice = price - price * (discount / 100);
            this.redisService.setPrice(cacheKey, newPrice);
        }
    }
}

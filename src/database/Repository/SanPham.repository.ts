import {
    DeepPartial,
    EntityMetadata,
    EntityRepository,
    getRepository,
    Repository,
    EntityTarget,
    DataSource,
} from 'typeorm';
import { NguoiBanHangEntity, SanPhamEntity, TaiKhoanEntity } from '../Entity/index.entity';
import { dataSource } from '../database.providers';
import { ProductDTO } from 'src/product/dto/product/product.dto';
import { ChiTietSanPhamEntity } from '../Entity/ChiTietSanPham.entity';
import { ChiTietSanPhamDTO } from '../../product/dto/chitietsanpham/ChiTietSanPham.dto';
import { NguoiBanHang } from '../Entity/NguoiBanHang.entity';
import { ChiTietMaGiamGia } from '../Entity/ChiTietMaGiamGia.entity';



// create repository not logic and can't handler
export class SanPhamRepository extends Repository<SanPhamEntity> {}

// create repository for logic business repository
@EntityRepository(SanPhamEntity)
export class ProductRepository {
    private productRepository: Repository<SanPhamEntity>;

    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (queryRunner) console.log('queryRunner true');
        queryRunner.connect();
        this.productRepository = dataSource.getRepository(SanPhamEntity);
    }

    public async findAll(): Promise<SanPhamEntity[]> {
        // console.log('product : ', await this.productRepository.createQueryBuilder().getMany());

        const data = await this.productRepository.find({
            select: {
                TenSanPham: true,
                GiaBan: true,
                AnhSanPham: true,
                MoTaSanPham: true,
                ThuongHieu: true,
                MaSanPham: true,
            },
            order: {
                TenSanPham: 'ASC',
            },
            relations: {
                seller: true,
            },
        });
        return data ?? null;
    }

    public async softDelete(
        maSanPham: number,
        maNguoiBanHang: number,
    ): Promise<SanPhamEntity | SanPhamEntity[] | number> {
        const isCheck = await this.productRepository.findOne({
            where: {
                MaSanPham: maSanPham,
            },
        });
        if (isCheck) {
            const data = await this.productRepository
                .createQueryBuilder()
                .softDelete()
                .where('MaSanPham = :maSanPham', {
                    maSanPham,
                })
                .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                    maNguoiBanHang,
                })
                .execute();
            return data.affected;
        }
        throw new Error('product in trash can');
    }

    // chưa xử lý được nhiều phần tử con cùng 1 lúc => ngay 20/05/2024 đax fix đc lỗi
    public async addProduct(
        product: SanPhamEntity,
        ChiTietSanPham: ChiTietSanPhamDTO[] | ChiTietSanPhamDTO,
    ): Promise<SanPhamEntity | undefined> {
        // covert object to array
        ChiTietSanPham = Object.keys(ChiTietSanPham).map(function (personNamedIndex) {
            let person = ChiTietSanPham[personNamedIndex];
            // do something with person
            return person;
        });

        const productEntity: SanPhamEntity = await this.productRepository.save(product);

        const ChiTietSanPhamRepository = await dataSource.getRepository(ChiTietSanPhamEntity);
        for (let element of ChiTietSanPham) {
            const chiTietSanPhamEntity = new ChiTietSanPhamEntity();
            let SoLuong = Number(element.SoLuong);
            chiTietSanPhamEntity.KichThuoc = element.KichThuoc;
            chiTietSanPhamEntity.MauSac = element.MauSac;
            chiTietSanPhamEntity.SoLuong = SoLuong;
            chiTietSanPhamEntity.MaSanPham = productEntity.MaSanPham;
            ChiTietSanPhamRepository.save(chiTietSanPhamEntity);
        }

        return productEntity;
    }

    public async restore(
        maSanPham: number,
        maNguoiBanHang: number,
    ): Promise<SanPhamEntity | SanPhamEntity[] | number | undefined> {
        const data = await this.productRepository
            .createQueryBuilder()
            .restore()
            .where('MaSanPham = :maSanPham', {
                maSanPham,
            })
            .andWhere('deletedDate is not null')
            .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                maNguoiBanHang,
            })
            .execute();
        return data.affected;
    }

    public async findDelete(maSanPham: number, maNguoiBanHang: number): Promise<number> {
        try {
            // xoá thông tin bảng liên kết trực tiếp với bảng sản phẩm
            const ChiTietSanPham = await dataSource.getRepository(ChiTietSanPhamEntity);

            // xoá thông tin liên kết trực tiếp với bảng chi tiết mã giảm giá

            const chiTietMaGiamGia = await dataSource.getRepository(ChiTietMaGiamGia);

            const [ChiTietSanPhamflag, chitietmagiamFlag, productFlag] = await Promise.all([
                ChiTietSanPham.createQueryBuilder()
                    .delete()
                    .where('MaSanPham = :id', {
                        id: maSanPham,
                    })
                    .execute(),
                chiTietMaGiamGia
                    .createQueryBuilder()
                    .delete()
                    .where('MaSanPham = :maSanPham', {
                        maSanPham,
                    })
                    .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                        maNguoiBanHang,
                    })
                    .execute(),
                this.productRepository
                    .createQueryBuilder()
                    .delete()
                    .where('MaSanPham = :id', {
                        id: maSanPham,
                    })
                    .andWhere('deletedDate is not null')
                    .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                        maNguoiBanHang,
                    })
                    .execute(),
            ]);

            return productFlag.affected;
        } catch (error) {
            throw new Error(error);
        }
    }

    // task 19/04
    public async ChangeInformationProduct(
        productDTO: ProductDTO,
        ChiTietSanPhamDTO: ChiTietSanPhamDTO,
        maNguoiBanHang: number,
    ): Promise<number> {
        // const isChiTietSanPham;
        // const isProduct;
        // const ChiTietSanPhamRepository = await dataSource.getRepository(ChiTietSanPhamEntity);

        // await Promise.all([
        //     this.productRepository
        //         .createQueryBuilder()
        //         .update()
        //         .set({
        //             ...productDTO,
        //         })
        //         .where('MaNguoiBanHang = :maNguoiBanHang', {
        //             maNguoiBanHang,
        //         })
        //         .execute(),
        //     ChiTietSanPhamRepository.createQueryBuilder().update().set({}),
        // ]);
        return 1;
    }
    public async InformationProduct(
        ProductId: number,
        maNguoiBanHang: number,
    ): Promise<{ SanPhamEntity; ChiTietSanPhamEntity }> {
        const sanpham = await this.productRepository.findOne({
            select: {
                TenSanPham: true,
                MoTaSanPham: true,
                GiaBan: true,
                AnhSanPham: true,
                ThuongHieu: true,
            },
            where: {
                MaSanPham: ProductId,
            },
        });
        const ChiTietSanPhamRepository = await dataSource.getRepository(ChiTietSanPhamEntity);

        const ChiTietSanPham = await ChiTietSanPhamRepository.createQueryBuilder()
            .where('MaSanPham = :ProductId', {
                ProductId,
            })
            .getMany();
        console.log('ChiTietSanPham : ', ChiTietSanPham);
        console.log('SanPham : ', sanpham);

        return {
            SanPhamEntity: sanpham,
            ChiTietSanPhamEntity: ChiTietSanPham,
        };
    }
    updatePrice(productId: number, newPrice: number) {
        return this.productRepository
            .createQueryBuilder()
            .update()
            .set({
                GiaBan: newPrice,
            })
            .where('MaSanPham = :productId', {
                productId,
            })
            .execute();
    }
}

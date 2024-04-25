import {
    DeepPartial,
    EntityMetadata,
    EntityRepository,
    getRepository,
    Repository,
    EntityTarget,
    DataSource,
} from 'typeorm';
import { SanPhamEntity, TaiKhoanEntity } from '../Entity/index.entity';
import { dataSource } from '../database.providers';
import { ProductDTO } from 'src/product/dto/product/product.dto';
import { KichThuocMauSacEntity } from '../Entity/KichThuocMauSac.entity';
import { KichThuocMauSacDTO } from 'src/product/dto/kichthuocmausac/KichThuocMauSac.dto';
import { NguoiBanHang } from '../Entity/NguoiBanHang.entity';

// Hoàn ngày 17/04/2024 gửi Hoàn của tương lai đôi vài điều :
// xin lỗi vì viết hiện tại t viết code như cái đặc cầu và comment cũng đéo chuẩn cái moẹ gì, logic thì phức tạp
// t biết tương lai m sẽ chửi t nên t cũng gửi đôi lời tâm sự :), chạy được là được rồi đừng có đụng vào đụng vào là đéo chạy đâu :)

// create repository not logic and can't handler
export class SanPhamRepository extends Repository<SanPhamEntity> {}

// create repository for logic business repository
@EntityRepository(SanPhamEntity)
export class ProductRepository {
    public productRepository: Repository<SanPhamEntity>;

    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (queryRunner) console.log('queryRunner true');
        queryRunner.connect();
        this.productRepository = dataSource.getRepository(SanPhamEntity);
    }

    public async findAll(): Promise<SanPhamEntity[]> {
        // console.log('product : ', await this.productRepository.createQueryBuilder().getMany());
        console.log('hehehe');
        const data = await this.productRepository.find({
            select: {
                TenSanPham: true,
                GiaBan: true,
                AnhSanPham: true,
                MoTaSanPham: true,
                ThuongHieu: true,
                MaSanPham: true,
            },
        });
        return data;
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

    // chưa xử lý được nhiều phần tử con cùng 1 lúc
    public async addProduct(
        product: SanPhamEntity,
        maNguoiBanHang: number,
        kichThuocMauSac: KichThuocMauSacDTO,
    ): Promise<number | undefined> {
        const productId: number = await this.productRepository.query(`
        execute proc_themSanPham_NguoiBanHang
            @MaNguoiBanHang = ${maNguoiBanHang},
            @TenSanPham = N'${product.getTenSanPham()}',
            @GiaBan = ${product.getGiaBan()},
            @AnhSanPham = '${product.getAnhSanPham()}' ,
            @MoTaSanPham = N'${product.getMoTaSanPham()}' ,
            @ThuongHieu = N'${product.getThuongHieu()}',
            @categoryId = N'A001'`);

        console.log('typeof product :', productId[0].MaSanPham);

        const kichthuocmausacEntity = new KichThuocMauSacEntity();
        const kichthuocmausacRepository = await dataSource.getRepository(KichThuocMauSacEntity);
        let SoLuong = Number(kichThuocMauSac.SoLuong);
        kichthuocmausacEntity.KichThuoc = kichThuocMauSac.KichThuoc;
        kichthuocmausacEntity.MauSac = kichThuocMauSac.MauSac;
        kichthuocmausacEntity.SoLuong = SoLuong;
        kichthuocmausacEntity.MaSanPham = productId[0].MaSanPham;
        // const a = await kichthuocmausacRepository.create(kichthuocmausacEntity);
        kichthuocmausacRepository.save(kichthuocmausacEntity);

        return productId;
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
            const data = await this.productRepository
                .createQueryBuilder()
                .delete()
                .where('MaSanPham = :id', {
                    id: maSanPham,
                })
                .andWhere('deletedDate is not null')
                .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                    maNguoiBanHang,
                })
                .execute();

            return data.affected;
        } catch (error) {
            throw new Error(error);
        }
    }

    // task 19/04
    public async ChangeInformationProduct(
        productDTO: ProductDTO,
        kichThuocMauSacDTO: KichThuocMauSacDTO,
        maNguoiBanHang: number,
    ): Promise<number> {
        // const isKichThuocMauSac;
        // const isProduct;
        // const kichthuocmausacRepository = await dataSource.getRepository(KichThuocMauSacEntity);

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
        //     kichthuocmausacRepository.createQueryBuilder().update().set({}),
        // ]);
        return 1;
    }
    public async InformationProduct(
        ProductId: number,
        maNguoiBanHang: number,
    ): Promise<{ SanPhamEntity; KichThuocMauSacEntity }> {
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
        const kichthuocmausacRepository = await dataSource.getRepository(KichThuocMauSacEntity);

        const kichthuocmausac = await kichthuocmausacRepository
            .createQueryBuilder()
            .where('MaSanPham = :ProductId', {
                ProductId,
            })
            .getMany();
        console.log('kichthuocmausac : ', kichthuocmausac);
        console.log('SanPham : ', sanpham);

        return {
            SanPhamEntity: sanpham,
            KichThuocMauSacEntity: kichthuocmausac,
        };
    }
}

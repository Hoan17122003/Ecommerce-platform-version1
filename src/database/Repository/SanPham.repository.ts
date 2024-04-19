import { DeepPartial, EntityMetadata, EntityRepository, getRepository, Repository, EntityTarget } from 'typeorm';
import { SanPhamEntity, TaiKhoanEntity } from '../Entity/index.entity';
import { dataSource } from '../database.providers';
import { ProductDTO } from 'src/product/dto/product.dto';
import { KichThuocMauSacEntity } from '../Entity/KichThuocMauSac.entity';
import { KichThuocMauSacDTO } from 'src/product/dto/KichThuocMauSac.dto';

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
        // const queryRunner = dataSource.createQueryRunner();
        // if (queryRunner) console.log('queryRunner true');
        // queryRunner.connect();
        this.productRepository = dataSource.getRepository(SanPhamEntity);
    }

    public async findAll(): Promise<SanPhamEntity[]> {
        console.log('product : ', await this.productRepository.createQueryBuilder().getMany());

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

    public async addProduct(
        product: SanPhamEntity,
        MaNguoiBanHang: number,
        kichThuocMauSac: KichThuocMauSacDTO | KichThuocMauSacDTO[],
    ): Promise<number | undefined> {
        const productId: number = await this.productRepository.query(`
        execute proc_themSanPham_NguoiBanHang
            @MaNguoiBanHang = ${MaNguoiBanHang},
            @TenSanPham = N'${product.getTenSanPham()}',
            @GiaBan = ${product.getGiaBan()},
            @AnhSanPham = '${product.getAnhSanPham()}' ,
            @MoTaSanPham = N'${product.getMoTaSanPham()}' ,
            @ThuongHieu = N'${product.getThuongHieu()}',
            @categoryId = N'A001'`);

        for (let element in kichThuocMauSac) {
            console.log('elment : ', element);
        }

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
            .andWhere('deletedDate != null')
            .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                maNguoiBanHang,
            })
            .execute();
        console.log('data : ', data);
        return data.affected;
    }

    public async findDelete(maSanPham: number[], maNguoiBanHang: number): Promise<Map<number, number>> {
        try {
            let isChecked: Map<number, number> = new Map<number, number>();
            // const data = this.productRepository.query(
            //     `select * from SanPham where MaSanPham = ${element} and MaNguoiBanHang = ${maNguoiBanHang} and deletedDate != null`,
            // );

            for (let id of maSanPham) {
                await this.restore(id, maNguoiBanHang);
                const data = await this.productRepository
                    .createQueryBuilder()
                    .delete()
                    .where('MaSanPham = :id', {
                        id,
                    })
                    .andWhere('MaNguoiBanHang = :maNguoiBanHang', {
                        maNguoiBanHang,
                    })
                    .execute();
                isChecked.set(id, data.affected);
                console.log('id : ', data.affected);
            }
            console.log('isChecked : ', isChecked);
            return isChecked;
        } catch (error) {
            throw new Error(error);
        }
    }
}

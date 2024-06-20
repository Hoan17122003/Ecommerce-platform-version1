import { EntityRepository, Repository } from 'typeorm';
import { ChiTietMaGiamGia } from '../Entity/ChiTietMaGiamGia.entity';
import { dataSource } from '../database.providers';
import { SanPhamEntity } from '../Entity/index.entity';

@EntityRepository(ChiTietMaGiamGia)
export class ChiTietMaGiamGiaRepository extends Repository<ChiTietMaGiamGia> {}

@EntityRepository(ChiTietMaGiamGia)
export class DiscountCodeDetailRP {
    private chitietmagiamgiaRepositorty: Repository<ChiTietMaGiamGia>;

    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (queryRunner) console.log('queryRunner true');
        queryRunner.connect();
        this.chitietmagiamgiaRepositorty = dataSource.getRepository(ChiTietMaGiamGia);
    }

    async UpdatePriceOfProduct(magiamgiaId:number, discount : number ): Promise<number> {
        const product = await dataSource.getRepository(SanPhamEntity);

        product.createQueryBuilder()
            .update()
            .where()



        return 1;
    }
}

import { EntityRepository, Repository } from 'typeorm';
import { ChiTietDonHangEntity } from '../Entity/index.entity';
import { dataSource } from '../database.providers';

@EntityRepository(ChiTietDonHangEntity)
export class ChiTietDonHangRepository extends Repository<ChiTietDonHangEntity> {}

@EntityRepository(ChiTietDonHangEntity)
export class OrderDetailRepository {
    private billDetailRepositry: Repository<ChiTietDonHangEntity>;
    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (!queryRunner) throw new Error('not start entity');
        queryRunner.connect();
        this.billDetailRepositry = dataSource.getRepository(ChiTietDonHangEntity);
    }

    async test() {
        return 'hehehe';
    }
}

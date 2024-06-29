import { EntityRepository, Repository } from 'typeorm';
import { ChiTietDonHangEntity } from '../Entity/index.entity';
import { dataSource } from '../database.providers';
import { ChiTietDonHang } from '../Entity/ChiTietDonHang.entity';

@EntityRepository(ChiTietDonHangEntity)
export class ChiTietDonHangRepository extends Repository<ChiTietDonHangEntity> {}

@EntityRepository(ChiTietDonHangEntity)
export class OrderDetailRepository {
    private billDetailRepositry: Repository<ChiTietDonHangEntity>;
    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (queryRunner.connection.isInitialized) console.log('queryRunnerOfChiTietDonHang : true ');
        queryRunner.connect();
        this.billDetailRepositry = dataSource.getRepository(ChiTietDonHangEntity);
    }

    async test() {
        return 'hehehe';
    }
}

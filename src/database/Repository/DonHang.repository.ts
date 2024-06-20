import { EntityRepository, Repository } from 'typeorm';
import { DonHangEntity } from '../Entity/index.entity';
import { dataSource } from '../database.providers';

@EntityRepository(DonHangEntity)
export class DonHangRepository extends Repository<DonHangEntity> {}

@EntityRepository(DonHangEntity)
export class OrderRepository {
    private OrderRepository: Repository<DonHangEntity>;
    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (!queryRunner) throw new Error('not start entity');
        queryRunner.connect();
        this.OrderRepository = dataSource.getRepository(DonHangEntity);
    }

    public async test() {
        return 'hehehe';
    }
}

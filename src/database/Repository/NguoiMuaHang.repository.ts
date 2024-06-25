import { EntityRepository, Repository } from 'typeorm';

import { NguoiMuaHangEntity } from '../Entity/index.entity';
import { EntityId } from 'typeorm/repository/EntityId';
import { dataSource } from '../database.providers';

@EntityRepository(NguoiMuaHangEntity)
export class NguoiMuaHangRepository extends Repository<NguoiMuaHangEntity> {
    constructor() {
        const buyer = dataSource.getRepository(NguoiMuaHangEntity);
        const queryRunner = dataSource.queryRunner();
        super(buyer, buyer, queryRunner);
    }

    async store(HoDem: string, Ten: string, SDT: string, NgayThangNamSinh: Date) {
        try {
            return await this.createQueryBuilder()
                .insert()
                .into(NguoiMuaHangEntity)
                .values([
                    {
                        HoDem: HoDem,
                        Ten: Ten,
                        SDT: SDT,
                        NgayThangNamSinh: NgayThangNamSinh,
                    },
                ])
                .execute();
        } catch (error) {
            console.log('error : ', error);
            return null;
        }
    }
}

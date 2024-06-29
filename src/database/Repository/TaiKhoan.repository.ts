import { EntityRepository, JoinColumn, Repository } from 'typeorm';
import { TaiKhoanEntity } from '../Entity/index.entity';
import { EntityId } from 'typeorm/repository/EntityId';
import { dataSource } from '../database.providers';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TaiKhoan } from '../Entity/TaiKhoan.entity';

@EntityRepository(TaiKhoanEntity)
export class TaiKhoanRepository extends Repository<TaiKhoanEntity> {}
@EntityRepository(TaiKhoanEntity)
export class AccountRepository {
    private repository: Repository<TaiKhoanEntity>;
    constructor() {
        const queryRunner = dataSource.createQueryRunner();
        if (!queryRunner) throw new Error('not start sql');
        queryRunner.connect();
        this.repository = dataSource.getRepository(TaiKhoanEntity);
    }



    async findInformation(tenDangNhap: string, Email: string, SDT: string, vaitro: string): Promise<boolean> {
        // try {
        if (!tenDangNhap || !Email || !SDT || !vaitro) throw new UnauthorizedException();
        const data = await dataSource
            .getRepository(TaiKhoanEntity)
            .query(`select * from [dbo].func_CheckInformation_User('${Email}','${tenDangNhap}','${SDT}','${vaitro}')`);

        if (data[0]?.isTenDangNhap != null || data[0].isEmail != null || data[0].isSDT != null)
            throw new UnauthorizedException(data[0]);

        return true;
        // } catch (error) {
        //     throw new ForbiddenException(error);
        // }
    }

    async setRefreshToken(refreshToken: string, id: number) {
        const taiKhoan = await dataSource.getRepository(TaiKhoanEntity);
        await taiKhoan
            .createQueryBuilder()
            .update()
            .set({
                refreshToken,
            })
            .where('TaiKhoanId = :id', {
                id,
            })
            .execute();
    }
}

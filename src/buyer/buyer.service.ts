import { Injectable, Inject, Global, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';

import { BaseService } from 'src/database/base.service';
import { NguoiMuaHangEntity, TaiKhoanEntity } from 'src/database/Entity/index.entity';
import { NguoiMuaHangRepository } from 'src/database/Repository/NguoiMuaHang.repository';
import { BuyerDTO } from './dto/buyer.dto';

@Injectable({})
export class BuyerService extends BaseService<NguoiMuaHangEntity, NguoiMuaHangRepository> {
    constructor(@Inject('BUYER_REPOSITORY') readonly repository: NguoiMuaHangRepository) {
        super(repository);
    }

    async create(nguoiMuaHang: BuyerDTO, taiKhoan: TaiKhoanEntity) {
        const nguoiMuaHangEntity: NguoiMuaHangEntity = new NguoiMuaHangEntity();
        nguoiMuaHangEntity.HoDem = nguoiMuaHang.HoDem;
        nguoiMuaHangEntity.Ten = nguoiMuaHang.Ten;
        nguoiMuaHangEntity.SDT = nguoiMuaHang.SDT;
        nguoiMuaHangEntity.NgayThangNamSinh = nguoiMuaHang.NgayThangNamSinh;
        nguoiMuaHangEntity.maNguoiMuaHang = taiKhoan.taiKhoanId;
        nguoiMuaHangEntity.taikhoan = taiKhoan;

        return this.repository.save(nguoiMuaHangEntity);
    }

    async changeInformation(id: number, SDT: string) {
        return await this.repository.update(id, { SDT });
    }

    test() {
        return this.repository.store('Ha Duc', 'Hoan', '0707648207', null);
    }

    async getProfile(id: number) {
        const data = await this.repository.findOne({
            select: {
                taikhoan: {
                    AnhDaiDien: true,
                    TenTaiKhoan: true,
                    Email: true,
                    VaiTro: true,
                },
            },
            where: {
                maNguoiMuaHang: id,
            },
            relations: {
                taikhoan: true,
            },
        });
        return data;
    }
}

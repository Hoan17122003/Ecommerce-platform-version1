import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';

import { MaGiamGiaEntity } from 'src/database/Entity/index.entity';
import { BaseService } from 'src/database/base.service';
import { MaGiamGiaDTO } from './dto/MaGiamGia.dto';
import { MaGiamGiaRepository } from 'src/database/Repository/MaGiamGia.repository';
import { MaGiamGia } from 'src/database/Entity/MaGiamGia.entity';
@Injectable()
export class DiscountCodeService extends BaseService<MaGiamGiaEntity, MaGiamGiaRepository> {
    constructor(@Inject('MAGIAMGIA_REPOSITORY') private readonly maGiamGiaRepository: MaGiamGiaRepository) {
        super(maGiamGiaRepository);
    }

    async create(maGiamGiaDTO: MaGiamGiaDTO): Promise<MaGiamGiaEntity> {
        const getnow = new Date(Date.now()).toLocaleString('vi');
        const formater = getnow.split(' ');
        const stringNow = `${formater[1]}T${formater[0]}`;
        const now = new Date(Date.apply(stringNow));
        if (
            maGiamGiaDTO.ThoiGianBatDau < now ||
            (maGiamGiaDTO.ThoiGianKetThuc <= now && maGiamGiaDTO.ThoiGianKetThuc < maGiamGiaDTO.ThoiGianBatDau)
        ) {
            throw new NotAcceptableException('thời gian không hợp lệ');
        }

        const maGiamGiaEntity = new MaGiamGiaEntity();
        maGiamGiaEntity.LoaiGiamGia = maGiamGiaDTO.LoaiGiamGia;
        maGiamGiaEntity.ThoiGianBatDau = maGiamGiaDTO.ThoiGianBatDau;
        maGiamGiaEntity.ThoiGianKetThuc = maGiamGiaDTO.ThoiGianKetThuc;
        maGiamGiaEntity.discount = maGiamGiaDTO.discount;
        maGiamGiaEntity.chitietmagiamgia = null;

        maGiamGiaEntity.ThoiGianBatDau.setHours(maGiamGiaEntity.ThoiGianBatDau.getHours() - 7);
        maGiamGiaEntity.ThoiGianKetThuc.setHours(maGiamGiaEntity.ThoiGianKetThuc.getHours() - 7);

        const a = await this.maGiamGiaRepository.save(maGiamGiaEntity);
        return a;
    }

    container: Array<MaGiamGia> = null;
    flagTime: number = null;

    async selectAll(): Promise<MaGiamGia[] | undefined> {
        // 5 phút lấy dữ liệu 1 lần
        if (this.container == null || this.flagTime + 300000 > Date.now()) {
            this.flagTime = Date.now();
            this.container = await this.maGiamGiaRepository.createQueryBuilder().getMany();
        }
        return this.container;
    }

    async updateActive(id: number, isActive: number) {
        return this.maGiamGiaRepository.update({ MaGiamGiaId: id }, { isActive });
    }

    async getAll(): Promise<MaGiamGia[] | undefined> {
        const magiamgia = await this.maGiamGiaRepository.find();
        return magiamgia;
    }

    async findByIdD(magiamgiaId: number): Promise<MaGiamGia> {
        const magiamgia = await this.maGiamGiaRepository.findOne({
            where: {
                MaGiamGiaId: magiamgiaId,
            },
        });
        return magiamgia;
    }

    async destroy(maGiamGiaId: number) {
        const state = await this.maGiamGiaRepository
            .createQueryBuilder()
            .delete()
            .where('MaGiamGiaId = :maGiamGiaId', {
                maGiamGiaId,
            })
            .execute();
        return state.affected;
    }
}

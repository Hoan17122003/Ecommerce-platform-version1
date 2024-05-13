import { Inject, Injectable } from '@nestjs/common';
import { MaGiamGiaEntity } from 'src/database/Entity/index.entity';
import { BaseService } from 'src/database/base.service';
import { VenderService } from 'src/vender/vender.service';
import { MaGiamGiaDTO } from './dto/MaGiamGia.dto';
import { MaGiamGiaRepository } from 'src/database/Repository/MaGiamGia.repository';

@Injectable()
export class DiscountCodeService extends BaseService<MaGiamGiaEntity, MaGiamGiaRepository> {
    constructor(@Inject('MAGIAMGIA_REPOSITORY') private readonly maGiamGiaRepository: MaGiamGiaRepository) {
        super(maGiamGiaRepository);
    }

    async create(maGiamGiaDTO: MaGiamGiaDTO) {
        const maGiamGiaEntity = new MaGiamGiaEntity();
        maGiamGiaEntity.LoaiGiamGia = maGiamGiaDTO.LoaiGiamGia;
        maGiamGiaEntity.ThoiGianBatDau = maGiamGiaDTO.ThoiGianBatDau;
        maGiamGiaEntity.ThoiGianKetThuc = maGiamGiaDTO.ThoiGianKetThuc;
        maGiamGiaEntity.discount = maGiamGiaDTO.discount;
        return this.maGiamGiaRepository.save(maGiamGiaEntity);
    }
}

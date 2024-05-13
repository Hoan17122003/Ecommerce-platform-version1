import { EntityRepository, Repository } from 'typeorm';
import { ChiTietMaGiamGia } from '../Entity/ChiTietMaGiamGia.entity';

@EntityRepository()
export class ChiTietMaGiamGiaRepository extends Repository<ChiTietMaGiamGia> {}

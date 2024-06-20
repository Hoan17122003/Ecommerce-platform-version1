import { EntityRepository, Repository } from 'typeorm';
import { MaGiamGia } from '../Entity/MaGiamGia.entity';

@EntityRepository()
export class MaGiamGiaRepository extends Repository<MaGiamGia> {}

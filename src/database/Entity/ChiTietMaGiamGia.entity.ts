import {
    Entity,
    Column,
    PrimaryColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    BaseEntity,
} from 'typeorm';
import { Product } from './SanPham.entity';
import { NguoiBanHang } from './NguoiBanHang.entity';
import { MaGiamGia } from './MaGiamGia.entity';

@Entity('ChiTietMaGiamGia')
export class ChiTietMaGiamGia extends BaseEntity {
    // @PrimaryGeneratedColumn('identity')
    // chiTietMaGiamGiaId: number;

    @PrimaryColumn({
        type: 'int',
        name: 'MaSanPham',
    })
    // @Column({ type: 'int', name: 'MaSanPham' })
    // @ManyToOne(() => Product, (product) => product.chitietmagiamgia)
    product: number;

    @PrimaryColumn({
        type: 'int',
        name: 'MaGiamGiaId',
    })
    // @Column({ type: 'int' })
    // @ManyToOne(() => MaGiamGia, (maGiamGia) => maGiamGia.chitietmagiamgia)
    MaGiamGiaId: number;

    @Column({
        type: 'int',
        name: 'MaNguoiBanHang',
    })
    nguoiBanHang: number;

    @Column({
        type: 'int',
    })
    SoLuongMaGiamGia: number;
}

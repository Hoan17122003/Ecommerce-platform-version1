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
    @PrimaryGeneratedColumn('identity')
    chiTietMaGiamGiaId: number;

    @ManyToOne(() => Product, (product) => product.chitietmagiamgia)
    product: Product;

    @ManyToOne(() => MaGiamGia, (maGiamGia) => maGiamGia.chitietmagiamgia)
    MaGiamGiaId: MaGiamGia;

    @ManyToOne(() => NguoiBanHang, (nguoiBanHang) => nguoiBanHang.chiTietMaGiamGia)
    nguoiBanHang: NguoiBanHang;

    @Column({
        type: 'int',
    })
    SoLuongSanPhamKhuyenMai: number;
}

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    PrimaryColumn,
    BaseEntity,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { DonHang } from './DonHang.entity';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { SanPhamEntity } from './index.entity';
import { ChiTietSanPhamEntity } from './ChiTietSanPham.entity';

@Entity('ChiTietDonHang')
export class ChiTietDonHang extends BaseEntity {
    @PrimaryColumn({
        type: 'int',
        foreignKeyConstraintName: 'MaSanPham',
        name: 'MaSanPham',
    })
    MaSanPham: number;
    @PrimaryColumn({
        type: 'int',
        foreignKeyConstraintName: 'MaDonHang',
        name: 'MaDonHang',
    })
    MaDonHang: number;

    // @OneToMany(() => ChiTietSanPhamEntity, (ChiTietSanPham) => ChiTietSanPham.chitietdonhang)
    // chiTietSanPham: ChiTietSanPhamEntity[];

    @Column({
        type: 'int',
    })
    SoLuongMua: number;

    @Column({
        type: 'nvarchar',
        length: 20,
    })
    KichThuoc: string;

    @Column({
        type: 'nvarchar',
        length: 20,
    })
    MauSac: string;

    constructor(MaSanPham: number, MaDonHang: number, KichThuoc: string, MauSac: string, SoLuongMua: number) {
        super();
        this.MaSanPham = MaSanPham;
        this.MaDonHang = MaDonHang;
        this.KichThuoc = KichThuoc;
        this.MauSac = MauSac;
        this.SoLuongMua = SoLuongMua;
    }

    @ManyToOne(() => SanPhamEntity, (sanpham) => sanpham.orderDetail)
    @JoinColumn({
        name: 'MaSanPham',
    })
    sanpham: SanPhamEntity;

    @ManyToOne(() => DonHang, (donhang) => donhang.chitietdonhang)
    @JoinColumn({
        name: 'MaDonHang',
    })
    donhang: DonHang;
}

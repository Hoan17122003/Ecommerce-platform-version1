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
        name: 'MaSanPham',
    })
    MaSanPham: number;
    @PrimaryColumn({
        type: 'int',
        name: 'MaDonHang',
    })
    MaDonHang: number;

    @Column({
        type: 'int',
    })
    SoLuongMua: number;

    @PrimaryColumn({
        type: 'nvarchar',
        length: 30,
        name: 'KichThuoc',
    })
    kichThuoc: string;

    @PrimaryColumn({
        type: 'nvarchar',
        length: 30,
        name: 'MauSac',
    })
    mauSac: string;

    constructor(MaSanPham: number, MaDonHang: number, KichThuoc: string, MauSac: string, SoLuongMua: number) {
        super();
        this.MaSanPham = MaSanPham;
        this.MaDonHang = MaDonHang;
        this.kichThuoc = KichThuoc;
        this.mauSac = MauSac;
        this.SoLuongMua = SoLuongMua;
    }

    @ManyToOne(() => SanPhamEntity, (sanpham) => sanpham.orderDetail)
    @JoinColumn({
        name: 'MaSanPham',
        foreignKeyConstraintName: 'MaSanPham',
    })
    sanpham: SanPhamEntity;

    @ManyToOne(() => DonHang, (donhang) => donhang.chitietdonhang)
    @JoinColumn({
        name: 'MaDonHang',
        foreignKeyConstraintName: 'MaDonHang',
    })
    donhang: DonHang;
}

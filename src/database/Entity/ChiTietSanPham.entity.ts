import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SanPhamEntity } from './index.entity';
import { ChiTietDonHang } from './ChiTietDonHang.entity';

@Entity('ChiTietSanPham')
export class ChiTietSanPhamEntity {
    @PrimaryColumn({
        type: 'nvarchar',
        length: 20,
    })
    KichThuoc: string;
    @PrimaryColumn({
        type: 'nvarchar',
        length: 20,
    })
    MauSac: string;

    @Column({ type: 'int' })
    SoLuong: number;

    @PrimaryColumn({
        type: 'int',
        name: 'MaSanPham',
    })
    MaSanPham: number;

    // @ManyToOne(() => ChiTietDonHang)
    // @JoinColumn({ name: 'MaDonHang' })
    // chitietdonhang: ChiTietDonHang;
}

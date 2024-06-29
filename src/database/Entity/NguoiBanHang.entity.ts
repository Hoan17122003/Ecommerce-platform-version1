import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    BaseEntity,
    ManyToOne,
    PrimaryColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';

import { TaiKhoan } from './TaiKhoan.entity';
import { Chat } from './Chat.entity';
import { DonHang } from './DonHang.entity';
import { ChiTietMaGiamGia } from './ChiTietMaGiamGia.entity';
import { ViNguoiDung } from './ViNguoiDung.entity';
import { SanPhamEntity, TaiKhoanEntity } from './index.entity';
import { MaGiamGia } from './MaGiamGia.entity';

@Entity('NguoiBanHang')
export class NguoiBanHang extends BaseEntity {
    @PrimaryColumn({
        type: 'int',
        name: 'MaNguoiBanHang',
    })
    maNguoiBanHang: number;

    @Column({
        type: 'nvarchar',
        length: 50,
    })
    HoDem: string;

    @Column({
        type: 'nvarchar',
        length: 50,
    })
    Ten: string;

    @Column({
        type: 'nvarchar',
        length: 20,
        unique: true,
    })
    SDT: string;

    @Column({
        type: 'date',
    })
    NgayThangNamSInh: Date;

    @Column({
        type: 'nvarchar',
        length: 250,
    })
    DiaChi: string;

    chats: Chat;

    // @ManyToMany(() => SanPhamEntity)
    // @JoinTable()RR
    // chiTietMaGiamGia: ChiTietMaGiamGia[];

    @OneToMany(() => SanPhamEntity, (sanpham) => sanpham.seller)
    @JoinColumn({ name: 'MaSanPham' })
    SanPham: SanPhamEntity[];

    @OneToOne(() => TaiKhoan)
    @JoinColumn({
        name: 'MaNguoiBanHang',
    })
    taikhoan: TaiKhoan;

    // @OneToOne(() => ViNguoiDung, (vinguoidung) => vinguoidung.nguoiBanHang)
    // @JoinColumn({ name: 'MaViNguoiDung' })
    // viNguoiDung: ViNguoiDung;
}

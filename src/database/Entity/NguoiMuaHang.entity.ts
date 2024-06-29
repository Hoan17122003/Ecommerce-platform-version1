import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { TaiKhoan } from './TaiKhoan.entity';
import { Chat } from './Chat.entity';
import { DonHang } from './DonHang.entity';
import { BinhLuanDanhGia } from './BinhLuanDanhGia.entity';
import { ViNguoiDung } from './ViNguoiDung.entity';
import { NguoiMuaHangEntity, TaiKhoanEntity } from './index.entity';

@Entity('NguoiMuaHang')
export class NguoiMuaHang extends BaseEntity {
    @PrimaryColumn({
        type: 'int',
        name: 'MaNguoiMuaHang',
    })
    maNguoiMuaHang: number;

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
    NgayThangNamSinh: Date;

    @OneToOne(() => TaiKhoan)
    @JoinColumn({ name: 'MaNguoiMuaHang' })
    taikhoan: TaiKhoan;

    chats: Chat[];

    donHang: DonHang[];

    binhLuanDanhGia: BinhLuanDanhGia[];

    viNguoiDung: ViNguoiDung;

    get fullName() {
        return `${this.HoDem} ${this.Ten}`;
    }
}

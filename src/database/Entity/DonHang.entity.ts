import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { NguoiBanHang } from './NguoiBanHang.entity';
import { NguoiMuaHang } from './NguoiMuaHang.entity';
import { ChiTietNhaVanChuyen } from './ChiTietNhaVanChuyen.entity';
import { ChiTietDonHang } from './ChiTietDonHang.entity';
import { ThanhToan } from './ThanhToan.entity';
import { MaGiamGia } from './MaGiamGia.entity';

@Entity('DonHang')
export class DonHang extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'MaDonHang',
    })
    MaDonHang: number;

    @Column({
        type: 'int',
        default: 0,
    })
    TrangThaiDonHang: number;

    @Column({
        type: 'int',
    })
    MaNguoiBanHang: number;

    @Column({
        type: 'int',
    })
    MaNguoiMuaHang: number;

    @Column({
        type: 'datetime',
        default: new Date(Date.now().toLocaleString('vi')),
    })
    NgayDatHang: Date;

    @Column({
        type: 'int',
        name: 'MaGiamGia',
        // foreignKeyConstraintName: 'MaGiamGiaId',
        default: null,
    })
    maGiamGia: number;

    @Column({
        type: 'nvarchar',
        length: 250,
        name: 'DiaChi',
    })
    diaChi: string;

    @Column({
        type: 'nvarchar',
        length: 20,
        name: 'PhuongThucThanhToan',
    })
    phuongThucThanhToan: string;

    @OneToMany(() => ChiTietDonHang, (chitieitdonhang) => chitieitdonhang.donhang, { cascade: true })
    @JoinColumn({ name: 'MaDonHang' })
    chitietdonhang: ChiTietDonHang[];

    @ManyToOne(() => MaGiamGia)
    @JoinColumn({
        name: 'MaGiamGia',
        foreignKeyConstraintName: 'fk_donhang_magiamgia',
    })
    maGiamGiaId: MaGiamGia;

    constructor(
        MaNguoiBanHang: number,
        MaNguoiMuaHang: number,
        maGiamGia: number,
        diaChi: string,
        phuongThucThanhToan: string,
    ) {
        super();
        this.MaNguoiBanHang = MaNguoiBanHang;
        this.MaNguoiMuaHang = MaNguoiMuaHang;
        this.maGiamGia = maGiamGia;
        this.TrangThaiDonHang = 0;
        this.phuongThucThanhToan = phuongThucThanhToan;
        this.diaChi = diaChi;
        //
        const getnow = new Date(Date.now()).toLocaleString('vi');
        const formater = getnow.split(' ');
        const stringNow = `${formater[1]}T${formater[0]}`;
        const now = new Date(Date.apply(stringNow));
        now.setHours(now.getHours() - 7);
        this.NgayDatHang = now;
    }
}

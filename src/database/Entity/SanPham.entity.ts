import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BinhLuanDanhGia } from './BinhLuanDanhGia.entity';
import { ChiTietDonHang } from './ChiTietDonHang.entity';
import { ChiTietMaGiamGia } from './ChiTietMaGiamGia.entity';
import { KichThuocMauSacEntity } from './KichThuocMauSac.entity';
import { NguoiBanHangEntity } from './index.entity';

@Entity('SanPham')
export class Product extends BaseEntity {
    public constructor(
        TenSanPham: string,
        GiaBan: number,
        AnhSanPham: string,
        MoTaSanPham: string,
        ThuongHieu: string,
    ) {
        super();
        this.TenSanPham = TenSanPham;
        this.GiaBan = GiaBan;
        this.AnhSanPham = AnhSanPham;
        this.MoTaSanPham = MoTaSanPham;
        this.ThuongHieu = ThuongHieu;
    }

    @PrimaryGeneratedColumn('identity')
    MaSanPham: number;

    @Column({
        type: 'nvarchar',
        length: 250,
    })
    TenSanPham: string;

    @Column({
        type: 'money',
    })
    GiaBan: number;

    @Column({
        type: 'nvarchar',
        length: 1000,
    })
    AnhSanPham: string;

    @Column({
        type: 'nvarchar',
        length: 500,
    })
    MoTaSanPham: string;

    @Column({
        type: 'nvarchar',
        length: 250,
    })
    ThuongHieu: string;

    @OneToMany(() => BinhLuanDanhGia, (binhLuanDanhGia) => binhLuanDanhGia.product)
    binhLuanDanhGia: BinhLuanDanhGia[];

    @OneToMany(() => ChiTietDonHang, (chiTietDonHang) => chiTietDonHang.product)
    orderDetail: ChiTietDonHang[];

    @OneToMany(() => ChiTietMaGiamGia, (chiTietMaGiamGia) => chiTietMaGiamGia.product)
    chitietmagiamgia: ChiTietMaGiamGia[];

    @DeleteDateColumn({
        default: null,
    })
    deletedDate: Date;

    public getGiaBan(): number {
        return this.GiaBan;
    }

    public getTenSanPham(): string {
        return this.TenSanPham;
    }

    public getAnhSanPham(): string {
        return this.AnhSanPham;
    }

    public getMoTaSanPham(): string {
        return this.MoTaSanPham;
    }

    public getThuongHieu(): string {
        return this.ThuongHieu;
    }
}

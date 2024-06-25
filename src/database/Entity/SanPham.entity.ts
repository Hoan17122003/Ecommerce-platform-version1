import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BinhLuanDanhGia } from './BinhLuanDanhGia.entity';
import { ChiTietDonHang } from './ChiTietDonHang.entity';
import { ChiTietMaGiamGia } from './ChiTietMaGiamGia.entity';
import { NguoiBanHang } from './NguoiBanHang.entity';
import { Categories } from './categories.entity';
import { DonHangEntity } from './index.entity';

@Entity('SanPham')
export class Product extends BaseEntity {
    public constructor(
        TenSanPham: string,
        GiaBan: number,
        AnhSanPham: string,
        MoTaSanPham: string,
        ThuongHieu: string,
        category: string,
        // nguoibanhang: NguoiBanHangEntity,
    ) {
        super();
        this.TenSanPham = TenSanPham;
        this.GiaBan = GiaBan;
        this.AnhSanPham = AnhSanPham;
        this.MoTaSanPham = MoTaSanPham;
        this.ThuongHieu = ThuongHieu;
        this.categoryId = category;
    }

    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'MaSanPham',
    })
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

    @Column({
        type: 'nvarchar',
        length: 50,
    })
    categoryId: string;

    @OneToMany(() => BinhLuanDanhGia, (binhluandanhgia) => binhluandanhgia.product)
    @JoinColumn({ name: 'MaBinhLuanDanhGia' })
    binhLuanDanhGia: BinhLuanDanhGia[];

    @ManyToOne(() => Categories)
    @JoinColumn({
        name: 'categoryId',
    })
    category: Categories;

    @OneToMany(() => ChiTietDonHang, (chitietdonhang) => chitietdonhang.sanpham, { cascade: true })
    @JoinColumn({
        name: 'MaSanPham',
    })
    orderDetail: ChiTietDonHang[];

    @ManyToOne(() => NguoiBanHang)
    @JoinColumn({ name: 'MaNguoiBanHang' })
    seller: NguoiBanHang;

    @Column({
        type: 'int',
        name: 'MaNguoiBanHang',
    })
    Manguoibanhang: number;

    // @ManyToMany(() => DonHangEntity)
    // @JoinTable()
    // donHang: DonHangEntity;

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

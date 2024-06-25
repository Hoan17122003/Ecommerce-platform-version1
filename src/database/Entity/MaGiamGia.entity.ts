import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, JoinColumn } from 'typeorm';
import { ChiTietMaGiamGia } from './ChiTietMaGiamGia.entity';
import { DonHang } from './DonHang.entity';

@Entity('MaGiamGIa')
export class MaGiamGia extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'MaGiamGiaId',
    })
    MaGiamGiaId: number;

    @Column({
        type: 'nvarchar',
        length: 50,
        enum: ['áp đặt', 'lựa chọn'],
    })
    LoaiGiamGia: string;
    @Column({
        type: 'datetime',
        default: 'getdate()',
    })
    ThoiGianBatDau: Date;
    @Column({
        type: 'datetime',
        default: 'getdate()',
    })
    ThoiGianKetThuc: Date;
    @Column({
        type: 'int',
        default: 0,
    })
    discount: number;

    @Column({
        type: 'bit',
        default: 0,
    })
    isActive: number;

    chitietmagiamgia: ChiTietMaGiamGia[];

    @OneToMany(() => DonHang, (donhang) => donhang.maGiamGiaId, {
        cascade: true,
    })
    @JoinColumn({ name: 'MaDonHang' })
    donHang: DonHang[];
}

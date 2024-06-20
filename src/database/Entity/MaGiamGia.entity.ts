import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { ChiTietMaGiamGia } from './ChiTietMaGiamGia.entity';

@Entity('MaGiamGIa')
export class MaGiamGia extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
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
}

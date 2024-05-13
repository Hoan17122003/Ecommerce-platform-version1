import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { ChiTietMaGiamGia } from './ChiTietMaGiamGia.entity';

@Entity('MaGiamGIa')
export class MaGiamGia extends BaseEntity {
    @PrimaryGeneratedColumn('identity')
    MaGiamGiaId: number;

    @Column({
        type: 'nvarchar',
        length: 50,
        enum: ['Trang Phục , Điện tử, Thực phẩm, Gia Dụng'],
    })
    LoaiGiamGia: string;
    @Column({
        type: 'datetime',
        default: 'getdate()',
    })
    ThoiGianBatDau: Date;
    @Column({
        type: 'datetime',
    })
    ThoiGianKetThuc: Date;
    @Column({
        type: 'int',
        default: 0,
    })
    discount: number;
    @OneToMany(() => ChiTietMaGiamGia, (chiTietMaGiamGia) => chiTietMaGiamGia.MaGiamGiaId)
    chitietmagiamgia: ChiTietMaGiamGia[];
}

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SanPhamEntity } from './index.entity';

@Entity('KichThuocMauSac')
export class KichThuocMauSacEntity {
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
}

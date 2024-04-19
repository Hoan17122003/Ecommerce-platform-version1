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
    Mausac: string;

    @Column('int')
    SoLuong: number;

    @ManyToOne(() => SanPhamEntity, (sanPhamEntity) => sanPhamEntity.kichThuocMauSac)
    maSanPham: SanPhamEntity;
}

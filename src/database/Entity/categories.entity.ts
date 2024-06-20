import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './SanPham.entity';
import { SanPhamEntity } from './index.entity';

@Entity('Categories')
export class Categories extends BaseEntity {
    @PrimaryColumn({
        type: 'nvarchar',
        length: 50,
    })
    categoryId: string;

    @Column({
        type: 'nvarchar',
        length: 50,
    })
    categoryName: string;

    @OneToMany(() => SanPhamEntity, (sanpham) => sanpham.category)
    sanpham: SanPhamEntity[];
}

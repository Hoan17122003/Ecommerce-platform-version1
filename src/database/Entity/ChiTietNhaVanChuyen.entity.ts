import { Entity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { DonHang } from './DonHang.entity';
import { NhaVanChuyen } from './NhaVanChuyen.entity';

@Entity('ChiTietNhaVanChuyen')
export class ChiTietNhaVanChuyen {
    @PrimaryGeneratedColumn('identity')
    chiTietNhaVanChuyenId: number;

    @Column({
        type: 'money',
    })
    ChiPhiVanChuyen: number;

    donHang: DonHang;

    @ManyToOne(() => NhaVanChuyen, (nhaVanChuyen) => nhaVanChuyen.chitietnhavanchuyen)
    @PrimaryColumn({
        type: 'int',
    })
    nhaVanChuyen: NhaVanChuyen;
}

import { IsNotEmpty, IsNumber, IsOptional, IsString, isNotEmpty } from 'class-validator';

export class ChiTietSanPhamDTO {
    @IsNotEmpty()
    KichThuoc: string;

    @IsNotEmpty()
    MauSac: string;

    @IsNotEmpty()
    SoLuong: number;

    constructor(KichThuoc: string, MauSac: string, SoLuong: number) {
        this.KichThuoc = KichThuoc;
        this.MauSac = MauSac;
        this.SoLuong = SoLuong;
    }
}

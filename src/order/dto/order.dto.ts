import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderDTO {
    @IsNumber()
    @IsNotEmpty()
    MaSanPham: number;
    @IsNumber()
    @IsNotEmpty()
    SoLuong: number;
    @IsString()
    @IsNotEmpty()
    KichThuoc: string;
    @IsString()
    @IsNotEmpty()
    MauSac: string;
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @IsNotEmpty()
    diaChi: string;
    @IsNotEmpty()
    phuongThucThanhToan: string;

    constructor(MaSanPham: number, SoLuong: number, KichThuoc: string, MauSac: string, discount: number) {
        this.MaSanPham = MaSanPham;
        this.SoLuong = SoLuong;
        this.MauSac = MauSac;
        this.discount = discount;
    }
}

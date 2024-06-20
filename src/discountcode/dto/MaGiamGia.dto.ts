import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LoaiGiamGiaEnum } from '../enums/LoaiGiamGia.enum';

export class MaGiamGiaDTO {
    @IsNotEmpty()
    @IsString()
    @IsEnum(LoaiGiamGiaEnum)
    LoaiGiamGia: string;
    @IsNotEmpty()
    @IsDate()
    ThoiGianBatDau: Date;
    @IsNotEmpty()
    @IsDate()
    ThoiGianKetThuc: Date;
    @IsNotEmpty()
    @IsNumber()
    SoLuongSanPham: number;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    constructor(LoaiGiamGia: string, ThoiGianBatDau: string, ThoiGianKetThuc: string, discount: number) {
        const thoiGianBatDau = new Date(ThoiGianBatDau);
        const thoiGianKetThuc = new Date(ThoiGianKetThuc);
        console.log('thoigianbatdau : ', thoiGianBatDau);
        console.log('thoigianketthuc : ', thoiGianKetThuc);

        this.LoaiGiamGia = LoaiGiamGia;
        this.ThoiGianBatDau = thoiGianBatDau;
        this.ThoiGianKetThuc = thoiGianKetThuc;
        this.discount = discount;
    }
}

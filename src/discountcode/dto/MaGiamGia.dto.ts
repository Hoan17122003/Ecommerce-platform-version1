import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MaGiamGiaDTO {
    @IsNotEmpty()
    @IsString()
    @IsEnum(['mĩ phẩm,quần áo, đồ điện tử, đồ gia dụng'])
    readonly LoaiGiamGia: string;
    @IsNotEmpty()
    readonly ThoiGianBatDau: Date;
    @IsNotEmpty()
    readonly ThoiGianKetThuc: Date;
    @IsNotEmpty()
    @IsNumber()
    readonly SoLuongSanPham: number;

    @IsNotEmpty()
    @IsNumber()
    readonly discount: number;
}

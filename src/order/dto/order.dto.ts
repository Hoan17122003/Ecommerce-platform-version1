import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderDTO {
    @IsNumber()
    @IsNotEmpty()
    MaSanPham: number;
    @IsNumber()
    @IsOptional()
    MaGiamGia: number;

    @IsNotEmpty()
    diaChi: string;
    @IsNotEmpty()
    phuongThucThanhToan: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class ProductDTO {
    @IsString()
    @IsNotEmpty()
    TenSanPham: string;

    @IsNotEmpty()
    GiaBan: number;

    @IsString()
    @IsNotEmpty()
    AnhSanPham: string;

    @IsString()
    @IsNotEmpty()
    MoTaSanPham: string;

    @IsString()
    @IsNotEmpty()
    ThuongHieu: string;
}

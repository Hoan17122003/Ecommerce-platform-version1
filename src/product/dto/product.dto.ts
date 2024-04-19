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

<<<<<<< HEAD
=======
    @IsNotEmpty()
    SoLuongSanPham: number;

>>>>>>> 0d84295237fddc2f24e2728b570cabfbe58e8935
    @IsString()
    @IsNotEmpty()
    ThuongHieu: string;
}

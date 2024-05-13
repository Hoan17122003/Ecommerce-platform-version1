import { IsEmail, IsNotEmpty, MaxLength, IsStrongPassword, IsEmpty, isEnum, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../enums/role.enum';
import { Transform } from 'stream';

export class TaiKhoanDTO {
    @IsNotEmpty()
    @MaxLength(50)
    @IsEmail()
    Email: string;

    @IsNotEmpty()
    @MaxLength(100)
    TenTaiKhoan: string;

    @IsNotEmpty()
    @MaxLength(100)
    TenDangNhap: string;

    @IsNotEmpty()
    @IsStrongPassword()
    MatKhau: string;

    @IsOptional()
    @IsEmpty()
    AnhDaiDien: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    VaiTro: string;
}

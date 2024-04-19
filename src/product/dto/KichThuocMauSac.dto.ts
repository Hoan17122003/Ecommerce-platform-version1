import { IsNotEmpty, IsNumber, IsOptional, IsString, isNotEmpty } from 'class-validator';

export class KichThuocMauSacDTO {
    @IsNotEmpty()
    @IsString()
    KichThuoc: string;

    @IsNotEmpty()
    @IsString()
    MauSac: string;
    @IsNotEmpty()
    @IsNumber()
    SoLuong: number;
}

import { ChiTietSanPhamDTO } from './ChiTietSanPham.dto';

export interface ChiTietSanPhamBuilder {
    setKichThuoc(kichThuoc: string): ChiTietSanPhamBuilder;
    setMauSac(mauSac: string): ChiTietSanPhamBuilder;
    setSoLuong(soLuong: number): ChiTietSanPhamBuilder;

    Build(): ChiTietSanPhamDTO;
}

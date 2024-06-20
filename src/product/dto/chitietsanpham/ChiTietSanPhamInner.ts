import { ChiTietSanPhamDTO } from './ChiTietSanPham.dto';
import { ChiTietSanPhamBuilder } from './ChiTietSanPhamBuilder';

export class ChiTietSanPhamInner implements ChiTietSanPhamBuilder {
    private kichThuoc: string;
    private mauSac: string;
    private soLuong: number;
    setKichThuoc(kichThuoc: string): ChiTietSanPhamBuilder {
        this.kichThuoc = kichThuoc;
        return this;
    }
    setMauSac(mauSac: string): ChiTietSanPhamBuilder {
        this.mauSac = mauSac;
        return this;
    }
    setSoLuong(soLuong: number): ChiTietSanPhamBuilder {
        this.soLuong = soLuong;
        return this;
    }
    Build(): ChiTietSanPhamDTO {
        return new ChiTietSanPhamDTO(this.kichThuoc, this.mauSac, this.soLuong);
    }
}

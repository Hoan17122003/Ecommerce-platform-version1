import { ProductDTO } from './product.dto';

export interface ProductBuilder {
    setTenSanPham(tenSanPham: string): ProductBuilder;
    setGiaBan(giaBan: number): ProductBuilder;
    setAnhSanPham(anhSanPham: string): ProductBuilder;
    setMoTaSanPham(moTa: string): ProductBuilder;
    setThuongHieu(thuongHieu: string): ProductBuilder;
    Build(): ProductDTO;
}

import { ProductBuilder } from './ProductBuilder';
import { ProductDTO } from './product.dto';

export class ProductInner implements ProductBuilder {
    private TenSanPham: string;
    private GiaBan: number;
    private AnhSanPham: string;
    private MoTaSanPham: string;
    private ThuongHieu: string;

    public setAnhSanPham(anhSanPham: string): ProductBuilder {
        this.AnhSanPham = anhSanPham;
        return this;
    }

    public setTenSanPham(tenSanPham: string): ProductBuilder {
        this.TenSanPham = tenSanPham;
        return this;
    }
    public setGiaBan(giaBan: number): ProductBuilder {
        this.GiaBan = giaBan;
        return this;
    }
    public setThuongHieu(thuongHieu: string): ProductBuilder {
        this.ThuongHieu = thuongHieu;
        return this;
    }
    public setMoTaSanPham(moTa: string): ProductBuilder {
        this.MoTaSanPham = moTa;
        return this;
    }
    public Build(): ProductDTO {
        return new ProductDTO(this.TenSanPham, this.GiaBan, this.AnhSanPham, this.MoTaSanPham, this.ThuongHieu);
    }
}

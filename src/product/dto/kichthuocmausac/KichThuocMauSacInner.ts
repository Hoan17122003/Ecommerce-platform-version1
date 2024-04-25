import { KichThuocMauSacDTO } from './KichThuocMauSac.dto';
import { KichThuocMauSacBuilder } from './KichThuocMauSacBuilder';

export class KichThuocMauSacInner implements KichThuocMauSacBuilder {
    private kichThuoc: string;
    private mauSac: string;
    private soLuong: number;
    setKichThuoc(kichThuoc: string): KichThuocMauSacBuilder {
        this.kichThuoc = kichThuoc;
        return this;
    }
    setMauSac(mauSac: string): KichThuocMauSacBuilder {
        this.mauSac = mauSac;
        return this;
    }
    setSoLuong(soLuong: number): KichThuocMauSacBuilder {
        this.soLuong = soLuong;
        return this;
    }
    Build(): KichThuocMauSacDTO {
        return new KichThuocMauSacDTO(this.kichThuoc, this.mauSac, this.soLuong);
    }
}

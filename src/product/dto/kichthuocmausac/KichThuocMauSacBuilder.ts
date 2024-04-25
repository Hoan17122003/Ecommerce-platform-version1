import { KichThuocMauSacDTO } from './KichThuocMauSac.dto';

export interface KichThuocMauSacBuilder {
    setKichThuoc(kichThuoc: string): KichThuocMauSacBuilder;
    setMauSac(mauSac: string): KichThuocMauSacBuilder;
    setSoLuong(soLuong: number): KichThuocMauSacBuilder;

    Build(): KichThuocMauSacDTO;
}

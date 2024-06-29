import { ChiTietSanPhamDTO } from 'src/product/dto/chitietsanpham/ChiTietSanPham.dto';

type khachangDTO = {
    diaChi: string;
    phuongThucThanhToan: string;
    MaGiamGia: number;
};

type donhangDTO = {
    maSanPham: [ChiTietSanPhamDTO];
};
export { khachangDTO, donhangDTO };

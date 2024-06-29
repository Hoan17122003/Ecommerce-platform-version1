import {
    Controller,
    Get,
    UseGuards,
    Post,
    Body,
    Session,
    ForbiddenException,
    MessageEvent,
    Put,
    Delete,
    Param,
    ParseIntPipe,
    UseInterceptors,
    Patch,
} from '@nestjs/common';
import * as fs from 'node:fs';

import { OrderService } from './order.service';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { Roles } from 'src/decorators/role.decoratos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { NguoiMuaHangEntity } from 'src/database/Entity/index.entity';
import { dataSource } from 'src/database/database.providers';
import { ProductService } from 'src/product/product.service';
import { RedisService } from 'src/redis/Redis.service';
import { NotificationsGateway } from 'src/notification/notification.gateway';
import { OrderDTO } from './dto/order.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { ChiTietSanPhamDTO } from 'src/product/dto/chitietsanpham/ChiTietSanPham.dto';
import { donhangDTO, khachangDTO } from './dto/khachang.type';
import { HandleDeletedOrder } from 'src/interceptors/HandleDeletedOrder.interceptor';
import { AccountService } from 'src/account/account.service';
import { TaiKhoan } from 'src/database/Entity/TaiKhoan.entity';
import { error } from 'node:console';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@UseGuards(JwtAccessTokenGuard)
@Controller('order')
export class OrderController {
    constructor(
        private readonly OrderService: OrderService,
        private readonly OrderDetailService: OrderDetailService,
        private readonly productService: ProductService,
        private readonly accountService: AccountService,
        private readonly notificationGateWay: NotificationsGateway,
    ) {}

    @Roles('NguoiMuaHang')
    @UseGuards(RolesGuard)
    @Post('buy')
    async BuyProduct(
        @Body('khachang') khachhang: khachangDTO,
        @Body('donhang') donHang: donhangDTO,
        @Session() session: Record<string, any>,
    ) {
        const maNguoiMuaHang = session.user['payload'];
        const NguoiMuaHang: NguoiMuaHangEntity = await dataSource
            .getRepository(NguoiMuaHangEntity)
            .createQueryBuilder()
            .where('MaNguoiMuaHang = :maNguoiMuaHang', {
                maNguoiMuaHang,
            })
            .getOne();
        try {
            const dathang = await this.OrderService.buyProduct(maNguoiMuaHang, donHang, khachhang);
            const { Donhang, Chitietdonhang } = dathang;
            if (!Donhang || !Chitietdonhang) throw new ForbiddenException('không thể đặt hàng');
            const maNguoiBanHang = dathang.Donhang.MaNguoiBanHang;
            const content = `Người dùng có tên là ${NguoiMuaHang.HoDem} ${NguoiMuaHang.Ten} đã đặt mua sản phẩm ${Chitietdonhang?.MaSanPham} của bạn`;
            const flag = await this.notificationGateWay.sendNotification(maNguoiBanHang, content);
            if (!flag) throw new Error('lỗi thông báo');
            return 'bạn đã đặt hàng thành công';
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    // huỷ đơn hàng (chỉ huỷ được khi trạng thái đơn hàng đang ở 0 hoặc 1)
    // có trigger ở csdl
    @Roles('NguoiMuaHang', 'NguoiBanHang')
    @UseGuards(RolesGuard)
    @UseInterceptors(HandleDeletedOrder)
    @Delete('delete-order')
    async deleteFrom(@Session() session: Record<string, any>, @Body('id') maDonHang: number) {
        try {
            const donhang = session.order;
            const account = session.account;
            const path = process.env.PATHFILE;
            const content = `${new Date().toLocaleDateString('vi')} - ${account.TenTaiKhoan} - ${
                account.VaiTro
            } - đã xoá đơn hàng ${donhang.maDonHang}`;
            await this.notificationGateWay.sendNotification(account.taikhoanId, content);
            fs.writeFile('path', content, (error) => {
                if (error) throw new Error('không thể ghi log');
                console.log('hehehehe');
            });
            return this.OrderService.DeleteOrder(donhang.MaDonHang);
        } catch (error) {
            throw new Error(error);
        }
    }

    // thay đổi trạng thái sản Đơn hàng task
    @Roles('NguoiBanHang')
    @UseGuards(RolesGuard)
    @Patch('ChangeState/:id')
    async ChangeStateOfOrder(
        @Param('id') maDonHang: number,
        @Session() session: Record<string, any>,
        @Body('flag') flag: string,
    ) {
        const maNguoiBanHang = session.user['payload'];
        const account = await this.accountService.findById(maNguoiBanHang);
        const donhang = await this.OrderService.getOrder(maDonHang, account.taiKhoanId, account.VaiTro);
        if (!donhang) throw new ForbiddenException('bạn không thể truy cập đơn hàng này');
        return this.OrderService.ChangeState(donhang, flag);
    }

    @Get('get/:id')
    async getOrder(@Param('id', new ParseIntPipe()) id: number, @Session() session: Record<string, any>) {
        const account = session.account;
        const { taiKhoanId, VaiTro } = account;
        return this.OrderService.getOrder(id, taiKhoanId, VaiTro);
    }

    @Get('test')
    async test() {
        return this.OrderService.test(this.OrderDetailService);
    }
}

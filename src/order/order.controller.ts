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
} from '@nestjs/common';

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

@UseGuards(JwtAccessTokenGuard)
@Controller('order')
export class OrderController {
    constructor(
        private readonly OrderService: OrderService,
        private readonly OrderDetailService: OrderDetailService,
        private readonly productService: ProductService,
        private readonly redisService: RedisService,
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
    @Roles('NguoiMuaHang', 'NguoiBanHang')
    @UseGuards(RolesGuard)
    @Delete('delete-order')
    async deleteFrom() {
        

    }

    @Get('get/:id')
    async getOrder(@Param('id', new ParseIntPipe()) id: number) {
        return this.OrderService.getOrder(id);
    }

    @Get('test')
    async test() {
        return this.OrderService.test(this.OrderDetailService);
    }
}

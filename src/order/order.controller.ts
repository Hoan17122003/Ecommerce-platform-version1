import { Controller, Get, UseGuards, Post, Body, Session, ForbiddenException, MessageEvent } from '@nestjs/common';
import { of } from 'rxjs';

import { OrderService } from './order.service';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { Roles } from 'src/decorators/role.decoratos';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { NguoiMuaHangEntity } from 'src/database/Entity/index.entity';
import { dataSource } from 'src/database/database.providers';
import { ProductService } from 'src/product/product.service';
import { RedisService } from 'src/redis/Redis.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationsGateway } from 'src/notification/notification.gateway';
import { DonHang } from 'src/database/Entity/DonHang.entity';
import { OrderDTO } from './dto/order.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';

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
    async BuyProduct(@Body() data: OrderDTO, @Session() session: Record<string, any>) {
        const maNguoiMuaHang = session.user['payload'];
        const NguoiMuaHang: NguoiMuaHangEntity = await dataSource
            .getRepository(NguoiMuaHangEntity)
            .createQueryBuilder()
            .where('MaNguoiMuaHang = :maNguoiMuaHang', {
                maNguoiMuaHang,
            })
            .getOne();

        try {
            const dathang = await this.OrderService.buyProduct(maNguoiMuaHang, data);
            const { Donhang, Chitietdonhang } = dathang;
            if (!Donhang || !Chitietdonhang) throw new Error('không thể đặt hàng');
            const maNguoiBanHang = dathang.Donhang.MaNguoiBanHang;
            const content = `Người dùng có tên là ${NguoiMuaHang.HoDem} ${NguoiMuaHang.Ten} đã đặt mua sản phẩm ${dathang.Chitietdonhang?.MaSanPham} của bạn`;
            const flag = await this.notificationGateWay.sendNotification(maNguoiBanHang, content);
            if (!flag) throw new Error('lỗi thông báo');
            return 'bạn đã đặt hàng thành công';
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get('test')
    async test() {
        return this.OrderService.test(this.OrderDetailService);
    }
}

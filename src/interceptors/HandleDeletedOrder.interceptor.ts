import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AccountService } from 'src/account/account.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class HandleDeletedOrder implements NestInterceptor {
    constructor(
        private readonly orderService: OrderService,
        private readonly accountService: AccountService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const { maDonHang } = request.body;
        const taikhoanId = request.session.user['payload'];
        const user = await this.accountService.findById(taikhoanId);
        const donHang = await this.orderService.getOrder(maDonHang, user.taiKhoanId, user.VaiTro);
        if (!donHang) throw new ForbiddenException('thông tin đơn hàng của bạn không hợp lệ ');
        if (donHang.TrangThaiDonHang > 1) throw new ForbiddenException('Đơn hàng đang được vận chuyển');
        const now = Date.now();
        request.session.order = donHang;
        request.session.account = user;

        return next.handle().pipe(
            map((data) => ({
                status: 'success',
                message: 'delete order success',
                data,
            })),
        );
    }
}

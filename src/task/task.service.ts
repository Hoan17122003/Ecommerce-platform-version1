import { Inject, Injectable, Scope } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MaGiamGia } from 'src/database/Entity/MaGiamGia.entity';
import { DiscountCodeService } from 'src/discountcode/discountcode.service';
import { DiscountCodeDetailService } from 'src/discountcodedetail/discountcodedetail.service';
import { ProductService } from 'src/product/product.service';
import { RedisService } from 'src/redis/Redis.service';

@Injectable()
export class TaskService {
    constructor(
        @Inject('product') private readonly productService: ProductService,
        @Inject('discountcodedetail') private readonly discountcodeDetailService: DiscountCodeDetailService,
        @Inject('discountcode') private readonly discountCodeService: DiscountCodeService,
        private readonly redisService: RedisService,
    ) {}

    @Cron('*/1 * * * *', {
        name: 'CheckUpdatePriceInProduct',
        // timeZone : "Vi/VietNam"
    })
    async checkUpdate() {
        const now2 = new Date();
        now2.setHours(now2.getHours() + 7);
        console.log('now : ', now2);
        const discountCode: MaGiamGia[] = await this.discountCodeService.selectAll();
        if (discountCode) {
            for (let i of discountCode) {
                let flag = i.isActive ? 1 : 0;
                i.ThoiGianBatDau.setHours(i.ThoiGianBatDau.getHours() + 7);
                i.ThoiGianKetThuc.setHours(i.ThoiGianKetThuc.getHours() + 7);

                const chitietmagiamgia = await this.discountcodeDetailService.findDCDbyIds(i.MaGiamGiaId);

                if (i.ThoiGianBatDau < now2 && now2 >= i.ThoiGianKetThuc && flag === 1) {
                    console.log('updated in product 2');
                    await this.discountCodeService.updateActive(i.MaGiamGiaId, 0);
                    chitietmagiamgia.forEach(async (e) => {
                        this.productService.setPrice(e.product, i.discount, flag);
                        this.discountcodeDetailService.remove(e);
                    });
                    await this.discountCodeService.delete(i.MaGiamGiaId);
                }

                if (i.ThoiGianBatDau <= now2 && i.ThoiGianKetThuc > now2 && flag === 0) {
                    console.log('updated in product');
                    await this.discountCodeService.updateActive(i.MaGiamGiaId, 1);
                    chitietmagiamgia.forEach(async (e) => {
                        await this.productService.setPrice(e.product, i.discount, flag);
                    });
                }
            }
        }
    }
}

import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/Redis.service';
import { Notification } from './notification';
import { NguoiBanHang } from 'src/database/Entity/NguoiBanHang.entity';

@Injectable()
export class NotificationService {
    constructor(private readonly redisService: RedisService) {}

    getUserNotifications(maNguoiBanHang: number): Notification[] {
        return this.redisService.getNotification(maNguoiBanHang);
    }
}

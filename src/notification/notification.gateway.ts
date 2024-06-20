import { Injectable, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Notification } from './notification';
import { RedisService } from 'src/redis/Redis.service';

@Injectable()
export class NotificationsGateway {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly redisService: RedisService,
    ) {}

    @Sse('notifications/:userId')
    async sendNotification(userId: number, content: string): Promise<Observable<Notification[] | Notification>> {
        const noti = new Notification(content, Date.now().toLocaleString('vi'), null);
        await this.redisService.setnotification(userId, noti);

        return interval(1000).pipe(
            map(() => {
                let notifications: Notification[] = this.notificationService.getUserNotifications(userId);
                console.log('notification : ', notifications);
                return notifications;
            }),
        );
    }
}

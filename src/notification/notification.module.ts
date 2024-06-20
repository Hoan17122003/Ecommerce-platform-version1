import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { NotificationService } from './notification.service';
import { NotificationsGateway } from './notification.gateway';

@Module({
    imports: [RedisModule],
    providers: [NotificationService, NotificationsGateway],
    exports: [NotificationsGateway],
})
export class NotificationModule {}

import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './Redis.service';
import { RedisController } from './redis.controller';

@Global()
@Module({
    imports: [],
    providers: [
        //     {
        //         provide: 'REDIS_CLIENT',
        //         useFactory: () => {
        //             const redis = new Redis({
        //                 host: '127.0.0.1', // Thay đổi thông tin kết nối Redis của bạn tại đây
        //                 port: 6379,
        //                 retryStrategy: (times) => {
        //                     const delay = Math.min(times * 50, 2000);
        //                     return delay;
        //                 },
        //             });
        //             redis.on('error', (err) => {
        //                 console.error('Redis error: ', err);
        //             });
        //             redis.on('connect', () => {
        //                 console.log('Connected to Redis');
        //             });
        //             return redis;
        //         },
        //     },
        RedisService,
    ],
    controllers: [RedisController],
    exports: [RedisService],
})
export class RedisModule {}

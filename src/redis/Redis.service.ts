import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { Notification } from 'src/notification/notification';

@Injectable()
export class RedisService {
    private client = null;

    constructor() {
        // this.client = createClient({
        //     username: 'default',
        //     password: 'jeNCR3yM8MWCOwQf8V8t9IioOvLwtRV0',
        //     socket: {
        //         host: 'redis-17427.c262.us-east-1-3.ec2.redns.redis-cloud.com',
        //         port: 17427,
        //     },
        // });
        this.client = createClient({
            username: 'default',
            socket: {
                host: 'localhost',
                port: 6380,
            },
        });
        this.client.on('error', (err) => console.log('Redis Cluster Error', err));
        this.client.connect();
    }

    async test() {
        const value = await this.client.get('foo');
        return value;
    }

    async getPrice(productId: number) {
        return this.client.get(productId);
    }

    async setPrice(productId: string, price: number) {
        this.client.set(productId, price);
    }

    async getAll(): Promise<Record<string, number>> {
        let data: Record<string, number> = {};
        try {
            const keys = await this.client.scan(0, 'MATCH *', (err, result) => {
                return result;
            });
            for (let key of keys.keys) {
                const value = await this.client.get(key);
                data[key] = value;
            }
        } catch (error) {
            throw new Error(error);
        }
        return data;
    }

    remove(productId: string): void {
        this.client.del(`${productId}`);
    }

    getNotification(maNguoiBanHang: number): Notification[] {
        const data = this.client.get(`NotificationOfVender:${maNguoiBanHang}`);
        return JSON.parse(data);
    }

    async setnotification(maNguoiBanHang: number, content: Notification): Promise<number> {
        const cacheKey = `Account:${maNguoiBanHang}`;
        const check = await this.client.set(`${cacheKey}`, JSON.stringify(content));
        return check;
    }
}

// src/middleware/logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';
import { dataSource } from 'src/database/database.providers';
import { TaiKhoanEntity } from 'src/database/Entity/index.entity';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        // Logging before request handling
        this.logger.log(`Incoming request: ${req.method} ${req.path}`);

        // Hook into the response finish event
        res.on('finish', async () => {
            const duration = Date.now() - start;
            const user = req.user ? req.user['payload'] : 'unknown user';
            const account = await dataSource
                .getRepository(TaiKhoanEntity)
                .createQueryBuilder('account')
                .select('*')
                .leftJoinAndSelect('account.nguoiBanHang', 'nguoiBanHang')
                .leftJoinAndSelect('account.nguoiMuaHang', 'nguoiMuaHang')
                .where('TaiKhoanId = :taikhoanId', {
                    taikhoanId: user,
                })
                .getOne();
                console.log('account : ',account)
            // Detailed log after response is finished
            this.logger.log(
                `Response: ${req.method} ${req.path} by ${
                    account?.nguoiBanHang.TenTaiKhoan | account?.nguoiMuaHang.TenTaiKhoan
                } Vaitro : ${account.VaiTro} - ${res.statusCode} in ${duration}ms`,
            );
        });

        next();
    }
}

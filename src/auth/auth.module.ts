import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AccountModule } from 'src/account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MailService } from 'src/mail/mai.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [DatabaseModule, AccountModule, JwtModule.register({}), MailModule],
    controllers: [AuthController],
    providers: [AuthService, MailService],
    exports: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply();
    }
}

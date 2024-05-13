import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Session,
    Req,
    Res,
    UseGuards,
    UnauthorizedException,
    ForbiddenException,
    Put,
    Patch,
    Redirect,
    Query,
    Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ParseIntPipe } from '@nestjs/common';
import { Request, Response } from 'express';
const axios = require('axios');

import { TaiKhoanDTO } from './dto/account.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/JwtAccessAuth.guard';
import { Public } from 'src/decorators/auth.decorators';
import { UserDTO } from './dto/user.dto';
import { Roles } from 'src/decorators/role.decoratos';
import { JwtRefreshTokenGuard } from 'src/auth/guard/JwtRefreshAuth.guard';
import { MailService } from 'src/mail/mai.service';
import { LocalAuthGuard } from 'src/auth/guard/LocalAuth.guard';

@UseGuards(JwtAccessTokenGuard)
@Controller('Account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly mailService: MailService,
    ) {}

    @Public()
    @Post('Signuplocal')
    async createAccount(@Body() taikhoanDTO: TaiKhoanDTO, @Body() userDTO: UserDTO, @Res() res: Response) {
        try {
            const data = await this.accountService.save(taikhoanDTO, userDTO);
            if (!data) throw new UnauthorizedException();
            return res.status(200).json({ message: 'tạo tài khoản thành công' });
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    // sending email and return mã xác thực cho client
    @Public()
    @Get('signuplocal/ValidateEmail/:NameEmail')
    private async SendMail(@Param('NameEmail') nameEmail: string, @Body() body: any) {
        let validateToken = '';
        const format = body.format;
        for (let i = 0; i < 6; i++) {
            const tokenRandom = Math.floor(Math.random() * 9) + 1;
            validateToken += tokenRandom.toString();
        }
        console.log('validate : ', validateToken);
        await this.mailService.sendUserConfirmation({
            email: `${nameEmail}@${format}`,
            subject: 'Welcome to web-ecommerce! Confirm your Email',
            content: validateToken,
        });
        return validateToken;
    }

    // gọi cập nhật trạng thái tài khoản
    @Patch('SetActive')
    async SetActiveAccount(@Body() body: any) {
        try {
            const email = body.email;
            return this.accountService.SetActive(email) ? 'tài khoản của bạn đã có thể sử dụng' : 'set active failed';
        } catch (error) {
            return new Error(error);
        }
    }

    @Patch(':VaiTro/:id/changeInformation')
    async changeInformation(
        @Param('id', new ParseIntPipe()) id: number,
        @Param('VaiTro') vaitro: string,
        @Body() data: any,
    ) {
        return this.accountService.changeInformation(id, vaitro, data);
    }

    @Get(':VaiTro/profile/:id')
    async getProfileById(
        @Param('id', new ParseIntPipe()) id: number,
        @Param('VaiTro') vaitro: string,
        @Session() session: Record<string, any>,
    ) {
        try {
            if (Number.parseInt(session.user.payload) != id) throw new ForbiddenException();
        } catch (error) {
            throw new ForbiddenException();
        }
        return this.accountService.profile(id, vaitro);
    }

    // @Post('/local/login')
    // async login(@Body() data: any, @Req() req: Request, @Res() res: Response) {
    //     const token = await this.accountService.login(data.username, data.password);
    //     return token;
    // }

    // @Get('testJWT')
    // test(@Req() req: Request, @Session() session: Record<string, any>) {

    //     return this.accountService.testJWT(session.token);
    // }

    @Delete('delete/:VaiTro/:id')
    async remove(@Param('id', new ParseIntPipe()) id: number, @Param('VaiTro') vaitro: string) {
        try {
            return this.accountService.deleteAccount(id, vaitro);
        } catch (error) {
            throw new Error(error);
        }
    }
}

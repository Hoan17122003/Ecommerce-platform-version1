import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';

dotenv.config({ path: 'local.env' });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle('Ecommerce-platform API')
        .setDescription('The Ecommerce-platform API DESCRIPTION')
        .setVersion('1.0')
        .addTag('Order')
        .addTag('Product')
        .addTag('Account')
        .addTag('OrderDetail')
        .addTag('DiscountCode')
        .addTag('DiscountCodeDetail')
        .addTag('Auth')
        .addTag('Buyer')
        .addTag('Vender')
        .addTag('Categories')
        .addTag('payment')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.use(
        session({
            secret: process.env.SECRETSESSION || 'hoan',
            resave: true,
            saveUninitialized: false,
            cookie: {
                secure: false,
            },
        }),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ErrorHandlingInterceptor());

    app.listen(process.env.PORT, () => {
        console.log(`server listen on port ${process.env.PORT}`);
    });
}
bootstrap();

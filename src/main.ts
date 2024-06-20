import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
// import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config({ path: 'local.env' });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

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

    app.listen(process.env.PORT, () => {
        console.log(`server listen on port ${process.env.PORT}`);
    });
}
bootstrap();

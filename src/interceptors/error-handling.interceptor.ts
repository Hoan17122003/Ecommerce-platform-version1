import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                // Kiểm tra loại lỗi
                const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error instanceof HttpException ? error.getResponse() : 'Internal server error';

                // Chuẩn hóa phản hồi lỗi
                return throwError(() => ({
                    status: 'error',
                    message: typeof message === 'string' ? message : message['message'],
                    code: status,
                }));
            }),
        );
    }
}

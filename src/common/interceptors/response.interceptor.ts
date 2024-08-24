import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((responseBody) => {

        const response = context.switchToHttp().getResponse();

        return {
          statusCode: response.statusCode,
          message: responseBody ? 'Request was successful' : 'No content available',
          data: responseBody !== undefined ? responseBody : null,
        };
      })
    );
  }
}


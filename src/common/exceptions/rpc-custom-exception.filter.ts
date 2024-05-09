import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

/**
 * Este es nuestro filtro de excepciones personalizado.
 * More info here:
 * https://docs.nestjs.com/microservices/exception-filters
 */
@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception.getError());
  }
}

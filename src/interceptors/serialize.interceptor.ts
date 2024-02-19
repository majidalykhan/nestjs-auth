import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run something before request is handled
    //by the request handler
    console.log('Im running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        //Run something before response is sent out
        console.log('Im running before response is sent out', data);
      }),
    );
  }
}

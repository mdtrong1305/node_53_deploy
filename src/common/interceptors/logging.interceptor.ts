import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// lấy request từ context
		const req: Request = context.switchToHttp().getRequest();
		// lấy method của request
		const method = req.method;
		// lấy url của request
		const url = req.url;
		// lấy ip của client gửi request
		const ip = req.ip;
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`[${method}] \t ${url} \t ${ip}... ${Date.now() - now}ms`)));
  }
}

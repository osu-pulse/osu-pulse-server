import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { unknownContextConvertor } from '../../shared/convertors/unknown-context.convertor';
import { AccessTokenHolderService } from '../services/access-token-holder.service';

@Injectable()
export class AccessTokenHolderInterceptor implements NestInterceptor {
  constructor(private accessTokenHolderService: AccessTokenHolderService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = unknownContextConvertor.toHttpRequest(context);

    const userId = req.user as string;
    const accessToken = req.headers?.authorization?.replace('Bearer ', '');
    const isAuthenticated = userId && accessToken;

    if (isAuthenticated) {
      this.accessTokenHolderService.set(userId, accessToken);
    }

    return next.handle().pipe(
      tap(() => {
        if (isAuthenticated) {
          this.accessTokenHolderService.remove(userId);
        }
      }),
    );
  }
}

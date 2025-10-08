import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Skip authentication in development mode if DEV_SKIP_AUTH is true
    const skipAuth = this.configService.get<string>('DEV_SKIP_AUTH') === 'true';
    if (skipAuth) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // In dev mode with skip auth, return a mock user
    const skipAuth = this.configService.get<string>('DEV_SKIP_AUTH') === 'true';
    if (skipAuth) {
      return {
        userId: 'dev-user-id',
        email: 'dev@example.com',
        tenantId: 'dev-tenant-id',
        role: 'tenant_admin',
      };
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}



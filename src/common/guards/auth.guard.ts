import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public-access.decorator';
import { JwtPayloadInterface } from 'src/modules/auth/interface/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const accessToken = req.cookies?.accessToken as string;

    if (!accessToken)
      throw new UnauthorizedException(["Token doesn't exist in cookie"]);

    try {
      const isValidUser =
        await this.jwtService.verifyAsync<JwtPayloadInterface>(accessToken);

      req.user = isValidUser;

      return true;
    } catch (_err) {
      throw new UnauthorizedException(['Access denied, token is not valid']);
    }
  }
}

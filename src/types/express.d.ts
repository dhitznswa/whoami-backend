import 'express';
import { JwtPayloadInterface } from 'src/modules/auth/interface/jwt-payload.interface';

declare module 'express' {
  export interface Request {
    user?: JwtPayloadInterface;
  }
}

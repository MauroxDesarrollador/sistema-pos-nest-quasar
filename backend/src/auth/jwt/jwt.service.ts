import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class jwtService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  sign(payload: any, options?: jwt.SignOptions): string {
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException,HttpException } from '@nestjs/common';
import {PrismaService} from '../../adapters/prisma/prismaService'
import {jwtService} from '../jwt/jwt.service';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY,Role} from "../decorators/index"
@Injectable()
export class MiddlewareGuard implements CanActivate {
  constructor(
    private PrismaService:PrismaService,
    private jwtService:jwtService,
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let user, token; 
    try {
      token = request.headers.authorization.split(' ')[1];
      user = this.jwtService.verify(token);
      //console.log(user)
    } catch (error) {
      throw new UnauthorizedException("Token no válido");
    }
    if(user){
      //validate roles
      try {
        const isRole = this.reflector.get<boolean>(ROLES_KEY, context.getHandler());

        if(typeof user.roles !== "object"){
          user.roles=[];
        }
        if (isRole) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const roles:Array<string>=isRole.valueOf();
            const containRole=roles.some(value => user.roles.includes(value));
            if(containRole){
              return true;
            }
          }
      }catch (error) {
        throw new HttpException({
          "error":error.message
        },500);
      }
      return false;
    }else{
      return false;
    }
  }
}

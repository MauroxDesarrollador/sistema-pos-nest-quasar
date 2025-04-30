import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OsCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userAgent = request['useragent']; // Acceder al useragent desde la solicitud

    const os = userAgent.os; // Obtener el sistema operativo

    // Verificar si el sistema operativo es permitido
    if (!os.includes('Windows') && os !== 'Linux 64' && os !== 'Linux 32') {
      throw new ForbiddenException('Acceso no permitido desde dispositivos móviles');
    }

    // Si el sistema operativo es permitido, permitir el acceso
    return true;
  }
}
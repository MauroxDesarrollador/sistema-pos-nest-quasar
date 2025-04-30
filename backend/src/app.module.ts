import { Module } from '@nestjs/common';

import { RenderTemplateService} from "./helpers/render-template/render-template.service"
import { jwtService } from './auth/jwt/jwt.service';
import { AuthController} from './auth/controller/auth.controller';
import { PrismaService } from "./adapters/prisma/prismaService"
import { MiddlewareGuard } from './auth/middleware/default.guard';
import { UsersController } from './cruds/users/users.controller';

import { ScheduleModule } from '@nestjs/schedule';

import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import {UploadsController} from "./cruds/uploads/uploads.controller";
import { OsCheckGuard } from './auth/middleware/osMiddleware';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads', // Directorio donde se guardarán los archivos temporalmente
    }),
  ],
  controllers: [
    AuthController,
    UsersController,
    UploadsController
  ],
  providers: [
    OsCheckGuard,
    jwtService,
    RenderTemplateService,
    PrismaService,
    MiddlewareGuard,
  ],
})
export class AppModule {}

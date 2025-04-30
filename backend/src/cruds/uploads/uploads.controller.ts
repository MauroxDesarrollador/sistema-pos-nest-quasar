import { Controller, Get, Res, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('uploads')
export class UploadsController {
  @Get(':filename')
  //@UseGuards(AuthGuard('jwt')) // Proteger la ruta con autenticación JWT
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.env.uploads, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return res.sendFile(filePath);
  }
} 
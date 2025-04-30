import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import {PrismaService} from '../../adapters/prisma/prismaService'
import { IWhereParam } from 'src/adapters/prisma/prisma';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MiddlewareGuard } from 'src/auth/middleware/default.guard';
import { Roles } from 'src/auth/decorators';
import { parserPassword } from 'src/helpers/passwordEncrypt';
import {jwtService} from '../../auth/jwt/jwt.service';

@UseGuards(MiddlewareGuard) 
@ApiTags("Usuarios")
@Controller('users')
export class UsersController {
    constructor(
        private prisma: PrismaService,
        private jwtService:jwtService
    ) {}
    @Roles(["ADMIN"])
    @Get()  
    async getPaginate(
        @Query('offset') offset?: string,
        @Query('limit') limit?: string,
        @Query('includes') includes?: string,
        @Query('search') Search?: string,
        @Query("orderByType") orderByType?:string,
        @Query("instanceId") instanceId?:string,
        @Query("tipo") tipo?:string,
        @Req() req?
    ){
        const authorizationHeader = req.headers['authorization'];
        // Verificar si el encabezado de autorización existe
         if (!authorizationHeader) {
            throw new HttpException({
                message:"Token no enviado"
            },500);
         }
         // Extraer el token de autorización de la cadena "Bearer <token>"
        const token = authorizationHeader.split(' ')[1];
        const userAuth = await this.jwtService.verify(token);
        
        if(!userAuth.id){
            throw new HttpException({
                message:"Token no valido"
            },500);
        }
        const user=await this.prisma.getOne({
            model:"User",
            id:userAuth.id
        });
        if(user.isAdmin==false){
            throw new HttpException({
                message:"No tienes permisos"
            },500);
        }
        
        const where:IWhereParam={};
        //if(Search || instanceId || tipo){
            where.AND=[];
        //}
        if(Search && Search.length>0){
            where.AND.push(
                { 
                    name:{
                        contains: Search,
                        mode: 'insensitive' 
                    }
                },
                { 
                    email:{
                        contains: Search,
                        mode: 'insensitive' 
                    }
                }
            ); 
        }
        if(instanceId){
            where.AND.push({
                clientInstanceId:instanceId
            });
        }
        if(tipo){
            where.AND.push({
                isClient:(tipo=="true")? true:false
            });
        }else{
            where.AND.push({
                isClient:false
            });
        }
        let orderBy={};
        if (orderByType === 'asc' || orderByType === 'desc') {
            orderBy = {
              id: orderByType
            };
        }
        const response=await this.prisma.getPaginate({
            model:"User",
            offset:parseInt(offset),
            limit:parseInt(limit),
            includes,
            where,
            orderBy
        });
        return response;
    }
    @Roles(["ADMIN"])
    @Get(':id')
    async getData(@Param('id') id: string, @Query('includes') includes?: string){
        const data=await this.prisma.getOne({
            model:"User",
            where:{id},
            includes
        });
        if(data.error){
            throw new HttpException(data,404);
        }else{
            return data;
        }
    }
    @Roles(["ADMIN"])
    @Post()
    @ApiBody({
        schema:{
            type: 'object',
            properties: {},
        }
      })
    async createData(@Body() body, @Req() req?){
         const authorizationHeader = req.headers['authorization'];
        // Verificar si el encabezado de autorización existe
         if (!authorizationHeader) {
            throw new HttpException({
                message:"Token no enviado"
            },500);
         }
         // Extraer el token de autorización de la cadena "Bearer <token>"
        const token = authorizationHeader.split(' ')[1];
        const userAuth = await this.jwtService.verify(token);
        
        if(!userAuth.id){
            throw new HttpException({
                message:"Token no valido"
            },500);
        }
        const user=await this.prisma.getOne({
            model:"User",
            id:userAuth.id
        });
        if(user.isAdmin==false){
            throw new HttpException({
                message:"No tienes permisos"
            },500);
        }
        if(body.password && body.password!=""){
            body.password=await parserPassword(body.password);
        }else{
            delete body.password;
        }
        return this.prisma.createOne({
            model:"User",
            body
        });
    }
    @Roles(["ADMIN"])
    @Put(':id')
    @ApiBody({
        schema:{
            type: 'object',
            properties: {},
        }
      })
    async updateData(@Param('id') id: string,@Body() body, @Req() req?){
         const authorizationHeader = req.headers['authorization'];
        // Verificar si el encabezado de autorización existe
         if (!authorizationHeader) {
            throw new HttpException({
                message:"Token no enviado"
            },500);
         }
         // Extraer el token de autorización de la cadena "Bearer <token>"
        const token = authorizationHeader.split(' ')[1];
        const userAuth = await this.jwtService.verify(token);
        
        if(!userAuth.id){
            throw new HttpException({
                message:"Token no valido"
            },500);
        }
        const user=await this.prisma.getOne({
            model:"User",
            id:userAuth.id
        });
        if(user.isAdmin==false && user.id!=id){
            throw new HttpException({
                message:"No tienes permisos"
            },500);
        }
        if(user.isAdmin==false && (body.isAdmin!=null || body.isZoneRestriction!=null)){
            throw new HttpException({
                message:"No tienes permisos"
            },500);
        }
        if(body.password && body.password!=""){
            body.password=await parserPassword(body.password);
        }else{
            delete body.password;
        }
        return this.prisma.updateOne({
            model:"User",
            where:{
                id
            },
            body
        });
    }
    @Delete(':id')
    @Roles(["ADMIN"])
    @UseGuards(MiddlewareGuard)
    async deleteOne(@Param('id') id:string,@Req() req?){
        const authorizationHeader = req.headers['authorization'];
        // Verificar si el encabezado de autorización existe
         if (!authorizationHeader) {
            throw new HttpException({
                message:"Token no enviado"
            },500);
         }
         // Extraer el token de autorización de la cadena "Bearer <token>"
        const token = authorizationHeader.split(' ')[1];
        const userAuth = await this.jwtService.verify(token);
        
        if(!userAuth.id){
            throw new HttpException({
                message:"Token no valido"
            },500);
        }
        const user=await this.prisma.getOne({
            model:"User",
            id:userAuth.id
        });
        if(user.isAdmin==false){
            throw new HttpException({
                message:"No tienes permisos"
            },500);
        }
        return this.prisma.deleteOne({
            model:"User",
            id:id
        })
    } 

}
 
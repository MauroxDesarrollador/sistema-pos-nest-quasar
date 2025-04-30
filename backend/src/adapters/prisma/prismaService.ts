import { Injectable, OnModuleInit,HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {ICreateOne, IDeleteOne,IGetOne,IGetPaginate,IUpdateOne,IGetAll, GetOneResponse} from './prisma';
//import { CacheUtils } from '../utils/cacheUtils';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private PERFORMANCE_TEST: boolean;
  async onModuleInit() {
    await this.$connect();//https://docs.nestjs.com/recipes/prisma
    if(process.env.PERFORMANCE_TEST=='true'){
      this.PERFORMANCE_TEST = true;
    }else{
      this.PERFORMANCE_TEST = false;
    }
  }
/*   constructor(private readonly cache: CacheUtils) {
    super();
  } */
  async getPaginate(params:IGetPaginate):Promise<{data:Array<object>,lastPage:number,currentPage:number,doc:object}>{
    try{
      const tiempoInicio = performance.now();
      /* const cacheKey = JSON.stringify(params);
      const cachedResult = await this.cache.getValue(cacheKey);
      if (cachedResult) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
        return JSON.parse(cachedResult);
      }  */
      const orderBy=params.orderBy ?? {};
      const model = params.model;
      let offset =  parseInt(params.offset) ?? 1;
      let limit = parseInt(params.limit) ?? 15;
      let { includes } = params;
      const where = params.where;
      limit = limit || 10; 
      offset = offset || 1;
      offset = offset - 1;
      offset = offset * limit;

      if(!includes){
        includes="";
      }
      const includeArray = includes.split(',').filter((include) => include.trim() !== '');
      // eslint-disable-next-line prefer-const
      let objetIncludes={};

      includeArray.forEach((include)=>{
        objetIncludes[include]=true;         
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let data = await this[model].findMany({
        skip:offset,
        take:limit,
        include: objetIncludes,
        where,
        orderBy
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let count = await this[model].count({
        where
      });
      
      const result={
        data,
        lastPage: Math.ceil(count / limit) || 1,
        currentPage: Math.ceil(offset / limit) + 1,
        doc:{}
      };
      //await this.cache.setValue(cacheKey,JSON.stringify(result),600);
      const tiempoFin = performance.now();
      if(this.PERFORMANCE_TEST){
        // Obtener el tiempo de finalización
        const tiempoFin = performance.now();
        // Calcular el tiempo de ejecución en milisegundos
        const tiempoEjecucion = tiempoFin - tiempoInicio;
        const tiempoEjecucionSegundos = tiempoEjecucion / 1000;
        console.log(`GetPaginate ${model}: tardo  ${tiempoEjecucionSegundos} segundos en ejecutarse.`);
      }
      return result;
    }catch(e){
      throw new HttpException(e.message,400);
    }
  }
  
  async getOne(params:IGetOne){
    try{
      const tiempoInicio = performance.now();
      const { includes,model } = params;
      let where = {};
      if(params.where){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        where=params.where
      }else{
        where={
          id:params.id
        };
      }
      let includeArray=[];
      // eslint-disable-next-line prefer-const
      if(includes!=null){
        includeArray = includes.split(',').filter((include) => include.trim() !== '');
      }
      // eslint-disable-next-line prefer-const
      let objetIncludes={};
      includeArray.forEach((include)=>{
        objetIncludes[include]=true;
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const data = await this[model].findFirst({
        include: objetIncludes,
        where,
      });
      if(this.PERFORMANCE_TEST){
        // Obtener el tiempo de finalización
        const tiempoFin = performance.now();
        // Calcular el tiempo de ejecución en milisegundos
        const tiempoEjecucion = tiempoFin - tiempoInicio;
        const tiempoEjecucionSegundos = tiempoEjecucion / 1000;
        console.log(`GetOne ${model}: tardo  ${tiempoEjecucionSegundos} segundos en ejecutarse.`);
      }
      if(!data){
        throw new HttpException('No se encontro el registro',404);
      }
      return data;
    }catch(e){
      return {
        error:"No encontrado"
      }
    }
  }
  async getAll(params: IGetAll){
    try {
      const tiempoInicio = performance.now();
      const { includes, model, selected } = params;
      let where = {};
      if (params.where) {
        // @ts-ignore
        where = params.where;
      }
  
      let includeArray = [];
      if (includes != null) {
        includeArray = includes.split(',').filter((include) => include.trim() !== '');
      }
  
      let objetIncludes = {};
      includeArray.forEach((include) => {
        objetIncludes[include] = true;
      });
      const orderBy=params.orderBy ?? {};
      const data = await this[model].findMany({
        include: objetIncludes,
        where,
        select: selected ? selected.split(',') : undefined,
        orderBy
      });
      if(this.PERFORMANCE_TEST){
        // Obtener el tiempo de finalización
        const tiempoFin = performance.now();
        // Calcular el tiempo de ejecución en milisegundos
        const tiempoEjecucion = tiempoFin - tiempoInicio;
        const tiempoEjecucionSegundos = tiempoEjecucion / 1000;
        console.log(`Getall ${model}: tardo  ${tiempoEjecucionSegundos} segundos en ejecutarse.`);
      }
      return data;
    } catch (e) {
      return {
        error: "No encontrado",
      };
    }
  }
  async createOne(params:ICreateOne):Promise<object>{
    try{
      const tiempoInicio = performance.now();
      const {model,body} = params;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const data = await this[model].create({
        data: body
      });
      if(this.PERFORMANCE_TEST){
        // Obtener el tiempo de finalización
        const tiempoFin = performance.now();
        // Calcular el tiempo de ejecución en milisegundos
        const tiempoEjecucion = tiempoFin - tiempoInicio;
        const tiempoEjecucionSegundos = tiempoEjecucion / 1000;
        console.log(`CreateOne ${model}: tardo  ${tiempoEjecucionSegundos} segundos en ejecutarse.`);
      }
      return data;
    }catch(e){
      throw new HttpException(e.message,400);
    }
  }
  async updateOne(params:IUpdateOne):Promise<object>{
    try{
      const tiempoInicio = performance.now();
      const { id,body,model } = params;
      let where={};
      if(params.where){
        where=params.where;
      }else{
        where={
          id
        }
      }
      console.log(where)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const searchData = await this[model].findFirst({
        where
      });
      if(!searchData){
        throw new HttpException('No se encontro el registro',404);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const data = await this[model].update({
        where: where,
        data:body,
      });
      if(this.PERFORMANCE_TEST){
        // Obtener el tiempo de finalización
        const tiempoFin = performance.now();
        // Calcular el tiempo de ejecución en milisegundos
        const tiempoEjecucion = tiempoFin - tiempoInicio;
        const tiempoEjecucionSegundos = tiempoEjecucion / 1000;
        console.log(`UpdateOne ${model}: tardo  ${tiempoEjecucionSegundos} segundos en ejecutarse.`);
      }
      return data;
    }catch(e){
      throw new HttpException(e.message,400);
    }
  }
  
  async deleteOne(Params:IDeleteOne):Promise<object>{
    try{
      const tiempoInicio = performance.now();
      const {model,id}=Params;
      if(!model){
        throw new HttpException('No se envio el modelo',400);
      }
      if(!id){
        throw new HttpException('No se envio el identificador {id}',400);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const searchData = await this[model].findFirst({
        where: {
          id
        },
      });
      if(!searchData){
        throw new HttpException('No se encontro el registro',404);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const data = await this[model].delete({
        where: { id },
      });
      if(this.PERFORMANCE_TEST){
        // Obtener el tiempo de finalización
        const tiempoFin = performance.now();
        // Calcular el tiempo de ejecución en milisegundos
        const tiempoEjecucion = tiempoFin - tiempoInicio;
        const tiempoEjecucionSegundos = tiempoEjecucion / 1000;
        console.log(`DeleteOne ${model}: tardo  ${tiempoEjecucionSegundos} segundos en ejecutarse.`);
      }
      return data;
    }catch(e){
      throw new HttpException(e.message,400);
    }
  }
  async psqlTransaction(callback) {
    const transaction = await this.$transaction(async (prisma) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await callback(prisma);
        return response;
      } catch (error) {
        throw error; // Lanzar el error para realizar el rollback
      }
    });
    return transaction;
  }
}

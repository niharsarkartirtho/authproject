import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';

type AuthenticatedRequest = { 
  user:{
    sub:number,  
    email:string,
    role:string
  } 
}
@Injectable() 
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} // reflector is used to read roles in routes/controller
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[context.getHandler(),context.getClass()])
    
    if(!requiredRoles || requiredRoles.length===0) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if(!user) throw new ForbiddenException("you do not have access to this function");

    if(!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("you do not have access to this function");
    }

    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable() // Checks whether the incoming request has a valid JWT.
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {} // Inject the JWT service.
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if(!authHeader){
      throw new UnauthorizedException('Token is missing');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid auth format');
    }

    try{
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

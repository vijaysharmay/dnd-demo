import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles defined; allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assume user information is in request (via middleware)
    return roles.includes(user.role); // Match user role with allowed roles
  }
}

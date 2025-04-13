import { IClientRepository } from '@/clients/application/repositories/client.repository';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { ClientAuthenticatedRequest } from '../types/client-authenticated-request.type';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(IClientRepository)
  private readonly clientRepo: IClientRepository;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<ClientAuthenticatedRequest>();

    const accessToken = req.cookies['access_token'];

    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);

      const client = await this.clientRepo.findById(decoded.sub);

      if (!client) throw new UnauthorizedException('Client not found');

      if (decoded.role !== 'CLIENT') {
        throw new UnauthorizedException('Invalid role');
      }

      req.user = client;

      return true;
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Authentication is required to access this resource.',
        );
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Your session has expired. Please log in again to continue.',
        );
      }

      throw new UnauthorizedException('Authentication failed.');
    }
  }
}

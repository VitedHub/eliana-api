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
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { ProfessionalAuthenticatedRequest } from '../types/professional-authenticated-request.type';

@Injectable()
export class ProfessionalAuthGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<ProfessionalAuthenticatedRequest>();

    const accessToken = req.cookies['access_token'];

    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);

      const professional = await this.professionalRepo.findById(decoded.sub);

      if (!professional) throw new UnauthorizedException('Client not found');

      if (decoded.role !== 'PROFESSIONAL') {
        throw new UnauthorizedException('Invalid role');
      }

      req.user = professional;

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

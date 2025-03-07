import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import {
  Inject,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleAuthProvider } from '../providers/google-auth.provider';
import { IAuthProvider } from '@/auth/application/providers/auth.provider';

@Injectable()
export class AuthProviderFactory {
  @Inject(GoogleAuthProvider)
  private readonly googleAuthProvider: GoogleAuthProvider;

  getAuthProvider(provider: AUTH_PROVIDER): IAuthProvider {
    switch (provider) {
      case AUTH_PROVIDER.GOOGLE:
        return this.googleAuthProvider;
      case AUTH_PROVIDER.APPLE:
      case AUTH_PROVIDER.FACEBOOK:
      case AUTH_PROVIDER.EMAIL_PASSWORD:
        throw new NotImplementedException();
      default:
        throw new UnauthorizedException('Ivalid auth provider');
    }
  }
}

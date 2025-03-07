import { Module } from '@nestjs/common';
import { GoogleAuthProvider } from './infra/providers/google-auth.provider';
import { OAuthLogInUseCase } from './application/usecases/oAuth-login.usecase';
import { ClientAuthController } from './api/controllers/clients-auth/client-auth.controller';
import { AuthProviderFactory } from './infra/factories/auth-provider.factory';
import { CoreModule } from '@/core/core.module';
import { ClientsModule } from '@/clients/clients.module';

@Module({
  controllers: [ClientAuthController],
  imports: [CoreModule, ClientsModule],
  providers: [AuthProviderFactory, GoogleAuthProvider, OAuthLogInUseCase],
})
export class AuthModule {}

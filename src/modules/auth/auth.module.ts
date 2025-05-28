import { forwardRef, Module } from '@nestjs/common';
import { GoogleAuthProvider } from './infra/providers/google-auth.provider';
import { ClientOAuthLogInUseCase } from './application/usecases/client-oAuth-login.usecase';
import { ClientAuthController } from './api/controllers/clients-auth/client-auth.controller';
import { AuthProviderFactory } from './infra/factories/auth-provider.factory';
import { CoreModule } from '@/core/core.module';
import { ClientsModule } from '@/clients/clients.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfessionalOAuthLogInUseCase } from './application/usecases/professional-oAuth-login.usecase';
import { ProfessionalAuthController } from './api/controllers/professionals-auth/professional-auth.controller';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { SubscriptionModule } from '@/subscriptions/subscription.module';

@Module({
  controllers: [ClientAuthController, ProfessionalAuthController],
  imports: [
    CoreModule,
    ClientsModule,
    ProfessionalModule,
    forwardRef(() => SubscriptionModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthProviderFactory,
    GoogleAuthProvider,
    ClientOAuthLogInUseCase,
    ProfessionalOAuthLogInUseCase,
  ],
  exports: [JwtModule],
})
export class AuthModule {}

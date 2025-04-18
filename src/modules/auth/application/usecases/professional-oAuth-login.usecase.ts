import { AuthProviderFactory } from '@/auth/infra/factories/auth-provider.factory';
import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

export type OAuthLogInUseCaseInput = {
  provider: AUTH_PROVIDER;
  code: string;
};

export type OAuthLogInUseCaseOutput = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class ProfessionalOAuthLogInUseCase {
  @Inject(AuthProviderFactory)
  private authProviderFactory: AuthProviderFactory;
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async execute(
    data: OAuthLogInUseCaseInput,
  ): Promise<OAuthLogInUseCaseOutput> {
    const authProvider = this.authProviderFactory.getAuthProvider(
      data.provider,
    );

    const tokens = await authProvider.exchangeCodeForTokens(data.code);

    const userData = await authProvider.getUserData(tokens.accessToken);

    let user = await this.findExistingUser(
      userData.email,
      userData.authProvider,
      data.provider,
    );

    if (!user) {
      user = await this.createNewUser(userData);
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: 'PROFESSIONAL',
    });

    return {
      accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async findExistingUser(
    email: string,
    providerId: string,
    provider: AUTH_PROVIDER,
  ) {
    try {
      const userByProviderId =
        await this.professionalRepo.findByProviderId(providerId);

      if (userByProviderId) return userByProviderId;

      const userByEmail = await this.professionalRepo.findByEmail(email);

      if (userByEmail) {
        if (!userByEmail.authProviders.includes(provider)) {
          userByEmail.authProviders.push(provider);
          await this.professionalRepo.update(userByEmail);
        }

        return userByEmail;
      }

      return null;
    } catch (err) {
      console.error('Erro to find user ', err);
      return null;
    }
  }

  private async createNewUser(userData: {
    name: string;
    email: string;
    authProvider: AUTH_PROVIDER;
    oAuthId?: string;
  }): Promise<Professional> {
    const newUser = new Professional();

    newUser.id = randomUUID();
    newUser.email = userData.email;
    newUser.name = userData.name;
    newUser.oAuthId = userData.oAuthId;
    newUser.authProviders = [userData.authProvider];

    return await this.professionalRepo.create(newUser);
  }
}

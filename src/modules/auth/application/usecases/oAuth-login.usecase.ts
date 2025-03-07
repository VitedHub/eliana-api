import { AuthProviderFactory } from '@/auth/infra/factories/auth-provider.factory';
import { IClientRepository } from '@/clients/application/repositories/client.repository';
import { Client } from '@/clients/domain/entities/client.entity';
import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type Input = {
  provider: AUTH_PROVIDER;
  code: string;
  userType: 'CLIENT' | 'ESTABLISHMENT';
};

export type Output = {
  accessToken: string;
  refreshToken: string;
  role: 'CLIENT' | 'ESTABLISHMENT';
};

@Injectable()
export class OAuthLogInUseCase {
  @Inject(AuthProviderFactory)
  private authProviderFactory: AuthProviderFactory;
  @Inject(IClientRepository)
  private readonly clientRepo: IClientRepository;

  async execute(data: Input): Promise<Output> {
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

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      role: 'CLIENT',
    };
  }

  private async findExistingUser(
    email: string,
    providerId: string,
    provider: AUTH_PROVIDER,
    // userType: 'CLIENT' | 'ESTABLISHMENT',
  ) {
    try {
      const repository = this.clientRepo;

      const userByProviderId = await repository.findByProviderId(providerId);

      if (userByProviderId) return userByProviderId;

      const userByEmail = await repository.findByEmail(email);

      if (userByEmail) {
        if (!userByEmail.authProviders.includes(provider)) {
          userByEmail.authProviders.push(provider);
          await repository.update(userByEmail);
        }

        return userByEmail;
      }

      return null;
    } catch (err) {
      console.error('Erro to find user ', err);
      return null;
    }
  }

  private async createNewUser(
    userData: {
      name: string;
      email: string;
      authProvider: AUTH_PROVIDER;
      oAuthId?: string;
    },
    // userType: 'CLIENT' | 'ESTABLISHMENT',
  ): Promise<Client> {
    const repository = this.clientRepo;

    const newUser = new Client();

    newUser.id = randomUUID();
    newUser.email = userData.email;
    newUser.name = userData.name;
    newUser.oAuthId = userData.oAuthId;
    newUser.authProviders = [userData.authProvider];

    return await repository.create(newUser);
  }
}

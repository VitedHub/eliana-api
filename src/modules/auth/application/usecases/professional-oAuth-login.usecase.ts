import { AuthProviderFactory } from '@/auth/infra/factories/auth-provider.factory';
import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { IProfessionalSubscriptionRepository } from '@/subscriptions/application/repositories/professional-subscription.repository';
import { ISubscriptionPlanRepository } from '@/subscriptions/application/repositories/subscription-plan.repository';
import { ProfessionalSubscriptionBuilder } from '@/subscriptions/domain/builders/professional-subscription.builder';
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
  @Inject(ISubscriptionPlanRepository)
  private readonly subscriptionPlanRepo: ISubscriptionPlanRepository;
  @Inject(IProfessionalSubscriptionRepository)
  private readonly ProfessionalSubRepo: IProfessionalSubscriptionRepository;

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
    const newUserData = new Professional();

    newUserData.id = randomUUID();
    newUserData.email = userData.email;
    newUserData.name = userData.name;
    newUserData.oAuthId = userData.oAuthId;
    newUserData.authProviders = [userData.authProvider];

    const newUser = await this.professionalRepo.create(newUserData);

    const freePlan = await this.subscriptionPlanRepo.findByName('Free');

    const subscription = ProfessionalSubscriptionBuilder.create({
      professional: newUser,
      subscriptionPlan: freePlan,
      stripeSubscriptionId: null,
      endDate: null,
    });

    await this.ProfessionalSubRepo.create(subscription);

    return newUser;
  }
}

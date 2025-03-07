import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';

export type ExchangeCodeForTokensOutput = {
  accessToken: string;
  refreshToken: string;
};

export type GetUserDataOutput = {
  name: string;
  email: string;
  authProvider: AUTH_PROVIDER;
  oAuthId?: string;
};

export abstract class IAuthProvider {
  abstract exchangeCodeForTokens(
    code: string,
  ): Promise<ExchangeCodeForTokensOutput>;
  abstract getUserData(accessToken: string): Promise<GetUserDataOutput>;
}

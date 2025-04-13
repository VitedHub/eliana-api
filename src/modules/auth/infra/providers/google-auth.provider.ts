import {
  ExchangeCodeForTokensOutput,
  GetUserDataOutput,
  IAuthProvider,
} from '@/auth/application/providers/auth.provider';
import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import { IHttpClient } from '@/core/application/providers/http-client.provider';
import { BadRequestException, Inject } from '@nestjs/common';

export type GoogleTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

export class GoogleAuthProvider implements IAuthProvider {
  @Inject(IHttpClient)
  private readonly httpClient: IHttpClient;

  async exchangeCodeForTokens(
    code: string,
  ): Promise<ExchangeCodeForTokensOutput> {
    const url = 'https://oauth2.googleapis.com/token';

    const response = await this.httpClient.post<GoogleTokenResponse>(url, {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    if (!response.data.access_token || !response.data.refresh_token) {
      throw new BadRequestException(
        response.data.error || 'Code change for token error',
      );
    }

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  }

  async getUserData(accessToken: string): Promise<GetUserDataOutput> {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';

    const response = await this.httpClient.get<{
      sub: string;
      email: string;
      name: string;
    }>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      name: response.data.name,
      email: response.data.email,
      authProvider: AUTH_PROVIDER.GOOGLE,
      oAuthId: response.data.sub,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<ExchangeCodeForTokensOutput> {
    const url = 'https://oauth2.googleapis.com/token';

    const response = await this.httpClient.post<GoogleTokenResponse>(url, {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    if (!response.data.access_token || !response.data.refresh_token) {
      throw new BadRequestException(
        response.data.error || 'Code change for token error',
      );
    }

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  }
}

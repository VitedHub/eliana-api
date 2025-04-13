import { ClientOAuthLogInUseCase } from '@/auth/application/usecases/client-oAuth-login.usecase';
import { CookieSecurityService } from '@/core/application/services/cookie-security.service';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientLoginRequest } from './request/client-login.request';
import { Response } from 'express';
import { LoginPresenter } from './presenters/login.presenter';

@Controller('client/auth')
export class ClientAuthController {
  @Inject(CookieSecurityService)
  private readonly cookieSecService: CookieSecurityService;
  @Inject(ClientOAuthLogInUseCase)
  private readonly oAuthLoginUseCase: ClientOAuthLogInUseCase;

  @Post()
  async login(@Body() body: ClientLoginRequest, @Res() res: Response) {
    const result = await this.oAuthLoginUseCase.execute({
      ...body,
    });

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.send(LoginPresenter.toHTTP());
  }
}

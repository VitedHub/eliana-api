import { OAuthLogInUseCase } from '@/auth/application/usecases/oAuth-login.usecase';
import { CookieSecurityService } from '@/core/application/services/cookie-security.service';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientLoginDto } from './dto/client-login.dto';
import { Response } from 'express';
import { LoginPresenter } from './presenters/login.presenter';

@Controller('client/auth')
export class ClientAuthController {
  @Inject(CookieSecurityService)
  private readonly cookieSecService: CookieSecurityService;
  @Inject(OAuthLogInUseCase)
  private readonly oAuthLoginUseCase: OAuthLogInUseCase;

  @Post()
  async login(@Body() body: ClientLoginDto, @Res() res: Response) {
    const result = await this.oAuthLoginUseCase.execute({
      ...body,
      userType: 'CLIENT',
    });

    const roleCookieValue = this.cookieSecService.signCookie(result.role);

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

    res.cookie('role', roleCookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: 'strict',
    });

    res.send(LoginPresenter.toHTTP());
  }
}

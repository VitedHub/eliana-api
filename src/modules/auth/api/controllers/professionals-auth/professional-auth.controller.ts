import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ProfessionalLoginRequest } from './request/professional-login.request';
import { Response } from 'express';
import { LoginPresenter } from '../clients-auth/presenters/login.presenter';
import { ProfessionalOAuthLogInUseCase } from '@/auth/application/usecases/professional-oAuth-login.usecase';

@Controller('professional/auth')
export class ProfessionalAuthController {
  @Inject(ProfessionalOAuthLogInUseCase)
  private readonly oAuthLoginUseCase: ProfessionalOAuthLogInUseCase;

  @Post()
  async login(@Body() body: ProfessionalLoginRequest, @Res() res: Response) {
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

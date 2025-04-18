import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ProfessionalLoginRequest {
  @IsEnum(AUTH_PROVIDER, {
    message: 'Provider must be a valid AUTH_PROVIDER value',
  })
  @IsNotEmpty()
  provider: AUTH_PROVIDER;

  @IsString()
  @IsNotEmpty()
  code: string;
}

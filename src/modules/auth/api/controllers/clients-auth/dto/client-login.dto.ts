import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';

export class ClientLoginDto {
  provider: AUTH_PROVIDER;
  code: string;
}

import { Module } from '@nestjs/common';
import { IHttpClient } from './application/providers/http-client.provider';
import { AxiosHttpClient } from './infra/providers/axios-http-client.provider';

@Module({
  providers: [
    {
      provide: IHttpClient,
      useClass: AxiosHttpClient,
    },
  ],
  exports: [IHttpClient],
})
export class CoreModule {}

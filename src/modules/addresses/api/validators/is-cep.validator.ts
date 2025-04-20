import { IHttpClient } from '@/core/application/providers/http-client.provider';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complement: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  erro?: boolean;
}

@ValidatorConstraint({ async: true })
export class IsCepConstraint implements ValidatorConstraintInterface {
  @Inject(IHttpClient)
  private httpClient: IHttpClient;

  async validate(cep: string): Promise<boolean> {
    if (typeof cep !== 'string') return false;

    if (!/^\d{8}$/.test(cep)) return false;

    try {
      const response = await this.httpClient.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cep}/json/`,
      );

      return !response.data.erro;
    } catch (err) {
      throw new BadRequestException(`CEP ${err.message}`);
    }
  }

  defaultMessage(): string {
    return `invalid or non-existent CEP `;
  }
}

export function IsCep(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCepConstraint,
    });
  };
}

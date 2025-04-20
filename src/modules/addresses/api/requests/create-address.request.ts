import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IsCep } from '../validators/is-cep.validator';

export class CreateAddressRequest {
  @IsCep()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @Length(1, 20)
  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}

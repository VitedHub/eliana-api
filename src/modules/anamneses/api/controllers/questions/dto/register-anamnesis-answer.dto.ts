import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { AnamnesisAnswerDto } from './anamnesis-answer.dto';

export class RegisterAnamnesisAnswerDto {
  @IsUUID()
  anamnesisId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnamnesisAnswerDto)
  answers: AnamnesisAnswerDto[];
}

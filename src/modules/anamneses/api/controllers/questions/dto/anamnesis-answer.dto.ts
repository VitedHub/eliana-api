import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AnamnesisAnswerDto {
  @IsUUID()
  questionId: string;

  @IsArray()
  @ArrayNotEmpty()
  answer: string[];
}

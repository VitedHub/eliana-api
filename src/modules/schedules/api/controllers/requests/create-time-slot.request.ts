import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTimeSlotRequest {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

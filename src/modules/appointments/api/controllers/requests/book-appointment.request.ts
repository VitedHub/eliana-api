import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BookAppointmentRequest {
  @IsUUID()
  @IsNotEmpty()
  timeSlotId: string;

  @IsString()
  @IsNotEmpty()
  establishmentSlug: string;

  @IsUUID()
  @IsNotEmpty()
  professionalId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}

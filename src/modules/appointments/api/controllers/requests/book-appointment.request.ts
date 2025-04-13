import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class BookAppointmentRequest {
  @IsUUID()
  @IsNotEmpty()
  timeSlotId: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}

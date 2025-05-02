import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Schedule } from '../entities/schedule.entity';
import { TimeSlot } from '../entities/time-slot.entity';
import { randomUUID } from 'crypto';

export class TimeSlotBuilder {
  static create(data: TimeSlotData): TimeSlot {
    const timeSlot = new TimeSlot();
    timeSlot.id = randomUUID();
    timeSlot.establishment = data.establishment;
    timeSlot.schedule = data.schedule;
    timeSlot.professional = data.professional;
    timeSlot.startTime = data.startTime;
    timeSlot.endTime = data.endTime;

    return timeSlot;
  }
}

interface TimeSlotData {
  professional: Professional;
  establishment: Establishment;
  schedule: Schedule;
  startTime: string;
  endTime: string;
}

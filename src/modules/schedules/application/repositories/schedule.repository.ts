import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';

export abstract class IScheduleRepository {
  abstract getScheduleById(id: string): Promise<Schedule | null>;
  abstract getAvailableDays(establishmentId: string): Promise<Schedule[]>;
  abstract update(data: {
    id: string;
    isActive: boolean;
    establishment: Establishment;
  }): Promise<Schedule>;
}

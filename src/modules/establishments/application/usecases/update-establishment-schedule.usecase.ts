import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IScheduleRepository } from '@/schedules/application/repositories/schedule.repository';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';

export type UpdateEstablishmentScheduleInput = {
  ownerId: string;
  establishmentId: string;
  scheduleId: string;
  isActive: boolean;
};

export class UpdateEstablishmentSchedule {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishementRepo: IEstablishmentRepository;
  @Inject(IScheduleRepository)
  private readonly scheduleRepo: IScheduleRepository;

  async execute(data: UpdateEstablishmentScheduleInput): Promise<Schedule> {
    const owner = await this.professionalRepo.findById(data.ownerId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const establishment = await this.establishementRepo.findById(
      data.establishmentId,
    );

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    if (establishment.owner.id !== owner.id) {
      throw new ForbiddenException(
        'You must be the owner to change the schedule',
      );
    }

    const schedule = await this.scheduleRepo.getScheduleById(data.scheduleId);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return await this.scheduleRepo.update({
      id: schedule.id,
      establishment,
      isActive: data.isActive,
    });
  }
}

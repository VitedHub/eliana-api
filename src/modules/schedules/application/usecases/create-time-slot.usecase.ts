import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IScheduleRepository } from '../repositories/schedule.repository';
import { ITimeSlotRepository } from '../repositories/time-slot.repository';
import { TimeSlotBuilder } from '@/schedules/domain/builders/time-slot.builder';

export type CreateProfessionalTimeSlotInput = {
  requesterId: string;
  professionalId: string;
  scheduleId: string;
  startTime: string;
  endTime: string;
};

export class CreateProfessionalTimeSlot {
  @Inject(IProfessionalRepository)
  private professionalRepo: IProfessionalRepository;
  @Inject(IScheduleRepository)
  private scheduleRepo: IScheduleRepository;
  @Inject(ITimeSlotRepository)
  private timeSlotRepo: ITimeSlotRepository;

  async execute(data: CreateProfessionalTimeSlotInput) {
    const requester = await this.professionalRepo.findById(data.requesterId);

    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    const professional = await this.professionalRepo.findById(
      data.professionalId,
    );

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    const schedule = await this.scheduleRepo.getScheduleById(data.scheduleId);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (!schedule.isActive) {
      throw new BadRequestException(
        'Cannot create a time slot for an inactive schedule',
      );
    }

    const establishment = schedule.establishment;

    if (establishment.owner.id !== requester.id) {
      throw new UnauthorizedException(
        'Only the establishment owner can modify a professional time slot',
      );
    }

    if (data.startTime >= data.endTime) {
      throw new BadRequestException('Start time must be earlier than end time');
    }

    const isLinked =
      establishment.owner.id === professional.id ||
      establishment.professionals
        .getItems()
        .some((ep) => ep.professional.id === data.professionalId);

    if (!isLinked) {
      throw new UnauthorizedException(
        'Professional is not linked to this establishment',
      );
    }

    const hasTimeSlotConflit = await this.timeSlotRepo.hasOverlappingTimeSlot({
      professional,
      schedule,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    if (hasTimeSlotConflit) {
      throw new ConflictException(
        'There is already a time slot overlapping this time range',
      );
    }

    const timeSlot = TimeSlotBuilder.create({
      professional,
      schedule,
      establishment,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    await this.timeSlotRepo.create(timeSlot);
  }
}

import { User } from '@/auth/api/decorators/user.decorator';
import { ProfessionalAuthGuard } from '@/auth/api/guards/profesional-auth.guard';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTimeSlotRequest } from './requests/create-time-slot.request';
import { CreateProfessionalTimeSlot } from '@/schedules/application/usecases/create-time-slot.usecase';
import { CreateProfesionalTimeSlotPresenter } from './presenters/create-time-slot.presenter';

@UseGuards(ProfessionalAuthGuard)
@Controller('schedules')
export class ProfessionalScheduleController {
  @Inject(CreateProfessionalTimeSlot)
  private createTimeSlotUseCase: CreateProfessionalTimeSlot;

  @Post(':scheduleId/time-slots')
  async createProfessionalTimeSlot(
    @User() requester: Professional,
    @Param('scheduleId') scheduleId: string,
    @Body() body: CreateTimeSlotRequest,
  ) {
    await this.createTimeSlotUseCase.execute({
      ...body,
      scheduleId,
      requesterId: requester.id,
    });

    return CreateProfesionalTimeSlotPresenter.toHTTP();
  }
}

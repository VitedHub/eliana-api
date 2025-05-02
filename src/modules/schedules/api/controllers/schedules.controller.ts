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
import { CreateTimeSlot } from '@/schedules/application/usecases/create-time-slot.usecase';
import { CreateTimeSlotPresenter } from './presenters/create-time-slot.presenter';

@UseGuards(ProfessionalAuthGuard)
@Controller('schedules')
export class ScheduleController {
  @Inject(CreateTimeSlot)
  private createTimeSlotUseCase: CreateTimeSlot;

  @Post(':scheduleId/time-slots')
  async createTimeSlot(
    @User() requester: Professional,
    @Param('scheduleId') scheduleId: string,
    @Body() body: CreateTimeSlotRequest,
  ) {
    await this.createTimeSlotUseCase.execute({
      ...body,
      scheduleId,
      requesterId: requester.id,
    });

    return CreateTimeSlotPresenter.toHTTP();
  }
}

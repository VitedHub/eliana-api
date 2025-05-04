import { ClientAuthGuard } from '@/auth/api/guards/client-auth.guard';
import { ListAvailableDaysForClient } from '@/schedules/application/usecases/list-available-days-for-client.usecase';
import { ListAvailableTimeSlotsForClient } from '@/schedules/application/usecases/list-available-time-slots-for-client.usecase';
import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListAvailableTimeSlotsForClientPresenter } from './presenters/list-available-time-slots-for-client.presenter';

@UseGuards(ClientAuthGuard)
@Controller('establishment-schedules')
export class EstablishmentSchedulesController {
  @Inject(ListAvailableDaysForClient)
  private readonly listAvailableDaysUseCase: ListAvailableDaysForClient;
  @Inject(ListAvailableTimeSlotsForClient)
  private readonly listAvailableTimeSlotsUseCase: ListAvailableTimeSlotsForClient;

  @Get(':slug')
  async listAvailableDays(
    @Param('slug') slug: string,
    @Query('month') month: string,
    @Query('professionalId') professionalId: string,
  ) {
    const result = await this.listAvailableDaysUseCase.execute({
      slug,
      month,
      professionalId,
    });

    return result;
  }

  @Get(':slug/available-time-slots')
  async listAvailableTimeSlots(
    @Param('slug') slug: string,
    @Query('date') date: string,
    @Query('professionalId') professionalId: string,
  ) {
    const result = await this.listAvailableTimeSlotsUseCase.execute({
      slug,
      date,
      professionalId,
    });

    return result.map(ListAvailableTimeSlotsForClientPresenter.toHTTP);
  }
}

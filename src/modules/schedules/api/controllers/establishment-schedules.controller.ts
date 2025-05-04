import { ClientAuthGuard } from '@/auth/api/guards/client-auth.guard';
import { ListAvailableDaysForClient } from '@/schedules/application/usecases/list-available-days-for-client.usecase';
import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

@UseGuards(ClientAuthGuard)
@Controller('establishment-schedules')
export class EstablishmentSchedulesController {
  @Inject(ListAvailableDaysForClient)
  private readonly listAvailableDaysUseCase: ListAvailableDaysForClient;

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
}

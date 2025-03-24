import { GetAvailableDays } from '@/appointments/application/usecases/get-available-month-days.usecase';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('client/appointments')
export class ClientAppointmentController {
  @Inject(GetAvailableDays)
  private getAvailableDaysUseCase: GetAvailableDays;

  @Get('available')
  async getAvailableDays(@Query('month') month: string) {
    return this.getAvailableDaysUseCase.execute({ month });
  }
}

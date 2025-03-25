import { GetAvailableDayTimeSlots } from '@/appointments/application/usecases/get-available-day-time-slots.usecase';
import { GetAvailableDays } from '@/appointments/application/usecases/get-available-month-days.usecase';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('client/appointments')
export class ClientAppointmentController {
  @Inject(GetAvailableDays)
  private getAvailableDaysUseCase: GetAvailableDays;
  @Inject(GetAvailableDayTimeSlots)
  private getAvailableDayTimeSlotsUseCase: GetAvailableDayTimeSlots;

  @Get('available')
  async getAvailableDays(@Query('month') month: string) {
    return this.getAvailableDaysUseCase.execute({ month });
  }

  @Get('available-slots')
  async GetAvailableDayTimeSlots(@Query('date') date: string) {
    return this.getAvailableDayTimeSlotsUseCase.execute({ date });
  }
}

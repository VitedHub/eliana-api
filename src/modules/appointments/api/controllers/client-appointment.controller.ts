import { GetAvailableDayTimeSlots } from '@/appointments/application/usecases/get-available-day-time-slots.usecase';
import { GetAvailableDays } from '@/appointments/application/usecases/get-available-month-days.usecase';
import { ListClientAppointments } from '@/appointments/application/usecases/list-client-appointmnets.usecase';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ListClientAppointmentsPresenter } from './presenters/list-client-appointments.presenter';

@Controller('client/appointments')
export class ClientAppointmentController {
  @Inject(ListClientAppointments)
  private listAppointmentsUseCase: ListClientAppointments;
  @Inject(GetAvailableDays)
  private getAvailableDaysUseCase: GetAvailableDays;
  @Inject(GetAvailableDayTimeSlots)
  private getAvailableDayTimeSlotsUseCase: GetAvailableDayTimeSlots;

  @Get(':clientId')
  async listAppointments(@Param('clientId') clientId: string) {
    const result = await this.listAppointmentsUseCase.execute({ clientId });

    return result.map(ListClientAppointmentsPresenter.toHTTP);
  }

  @Get('available')
  async getAvailableDays(@Query('month') month: string) {
    return this.getAvailableDaysUseCase.execute({ month });
  }

  @Get('available-slots')
  async GetAvailableDayTimeSlots(@Query('date') date: string) {
    return this.getAvailableDayTimeSlotsUseCase.execute({ date });
  }
}

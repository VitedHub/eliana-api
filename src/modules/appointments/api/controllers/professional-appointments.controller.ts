import { ListProfessionalDailyAppointments } from '@/appointments/application/usecases/list-professional-daily-appointments.usecase';
import { ListProfessionalMonthAppointmentDays } from '@/appointments/application/usecases/list-professional-month-appointment-days.usecase';
import { User } from '@/auth/api/decorators/user.decorator';
import { ProfessionalAuthGuard } from '@/auth/api/guards/profesional-auth.guard';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ListProfessionalDailyAppointmentsPresenter } from './presenters/list-professional-daily-appointments.presenter';
import { ListProfessionalMonthAppointmentPresenter } from './presenters/list-professional-month-appointments.presenter';

@UseGuards(ProfessionalAuthGuard)
@Controller('professional/appointments')
export class ProfessionalAppointmentsController {
  @Inject(ListProfessionalMonthAppointmentDays)
  private listProfessionalMonthAppointmentDaysUseCase: ListProfessionalMonthAppointmentDays;
  @Inject(ListProfessionalDailyAppointments)
  private listProfessionalDailyAppointmentsUseCase: ListProfessionalDailyAppointments;

  @Get('/days')
  async listMonthAppointments(
    @User() professional: Professional,
    @Query('month') month: string,
    @Query('establishmentId') establishmentId?: string,
  ) {
    const result =
      await this.listProfessionalMonthAppointmentDaysUseCase.execute({
        professionalId: professional.id,
        month,
        establishmentId,
      });

    return ListProfessionalMonthAppointmentPresenter.toHTTP(result);
  }

  @Get()
  async listDailyAppointments(
    @User() professional: Professional,
    @Query('date') date: string,
    @Query('establishmentId') establishmentId?: string,
  ) {
    const result = await this.listProfessionalDailyAppointmentsUseCase.execute({
      professionalId: professional.id,
      establishmentId,
      date,
    });

    return result.map(ListProfessionalDailyAppointmentsPresenter.toHTTP);
  }
}

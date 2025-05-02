import { ListProfessionalMonthAppointmentDays } from '@/appointments/application/usecases/list-professional-month-appointment-days.usecase';
import { User } from '@/auth/api/decorators/user.decorator';
import { ProfessionalAuthGuard } from '@/auth/api/guards/profesional-auth.guard';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';

@UseGuards(ProfessionalAuthGuard)
@Controller('professional/appointments')
export class ProfessionalAppointmentsController {
  @Inject(ListProfessionalMonthAppointmentDays)
  private listProfessionalMonthAppointmentDaysUseCase: ListProfessionalMonthAppointmentDays;

  @Get('/days')
  async listProfessionalMonthAppointments(
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

    return result;
  }
}

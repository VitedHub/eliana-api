import { ListClientAppointments } from '@/appointments/application/usecases/list-client-appointmnets.usecase';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListClientAppointmentsPresenter } from './presenters/list-client-appointments.presenter';
import { BookAppointment } from '@/appointments/application/usecases/book-appointment.usecase';
import { BookAppointmentPresenter } from './presenters/book-appointment.presenter';
import { BookAppointmentRequest } from './requests/book-appointment.request';
import { ClientAuthGuard } from '@/auth/api/guards/client-auth.guard';
import { User } from '@/auth/api/decorators/user.decorator';
import { Client } from '@/clients/domain/entities/client.entity';

@UseGuards(ClientAuthGuard)
@Controller('client/appointments')
export class ClientAppointmentController {
  @Inject(ListClientAppointments)
  private listAppointmentsUseCase: ListClientAppointments;
  @Inject(BookAppointment)
  private bookAppointmentUseCase: BookAppointment;

  @Post('book')
  async bookAppointment(
    @User() client: Client,
    @Body() body: BookAppointmentRequest,
  ) {
    const result = await this.bookAppointmentUseCase.execute({
      clientId: client.id,
      ...body,
    });

    return BookAppointmentPresenter.toHTTP(result);
  }

  @Get()
  async listAppointments(
    @User() client: Client,
    @Query('establishmentId') establishmentId?: string,
    @Query('professionalId') professionalId?: string,
  ) {
    const result = await this.listAppointmentsUseCase.execute({
      clientId: client.id,
      establishmentId,
      professionalId,
    });

    return result.map(ListClientAppointmentsPresenter.toHTTP);
  }
}

import { User } from '@/auth/api/decorators/user.decorator';
import { ProfessionalAuthGuard } from '@/auth/api/guards/profesional-auth.guard';
import { CreateEstablishment } from '@/establishments/application/usecases/create-establishmet.usecase';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEstablishmentPresenter } from './presenter/create-establishment.presenter';
import { CreateEstablishmentRequest } from './requests/create-establishments.request';
import { ListEstablishments } from '@/establishments/application/usecases/list-establishments.usecase';
import { ListEstablishmentsPresenter } from './presenter/list-establishments.presenter';
import { DetailEstablishment } from '@/establishments/application/usecases/detail-establishment.usecase';
import { DetailEstablishmentPresenter } from './presenter/detail-establishment.presenter';
import { ListEstablishmentProfessionals } from '@/establishments/application/usecases/list-establishment-professionals.usecase';
import { ListEstablishmentProfessionalsPresenter } from './presenter/list-establishment-professionals.presenter';
import { UpdateEstablishmentSchedule } from '@/establishments/application/usecases/update-establishment-schedule.usecase';
import { UpdateEstablishmentSchedulePresenter } from './presenter/update-establishment-schedule.presenter';

@UseGuards(ProfessionalAuthGuard)
@Controller('establishments')
export class ProfessionalEstablishmentController {
  @Inject(CreateEstablishment)
  private readonly createEstablishmentUseCase: CreateEstablishment;
  @Inject(ListEstablishments)
  private readonly listEstablishmentsUseCase: ListEstablishments;
  @Inject(DetailEstablishment)
  private readonly detailEstablishmentUseCase: DetailEstablishment;
  @Inject(ListEstablishmentProfessionals)
  private readonly listEstablishmentProfessionalsUseCase: ListEstablishmentProfessionals;
  @Inject(UpdateEstablishmentSchedule)
  private readonly updateEstablishmentScheduleUseCase: UpdateEstablishmentSchedule;

  @Post()
  async createEstablishment(
    @User() professional: Professional,
    @Body() body: CreateEstablishmentRequest,
  ) {
    const result = await this.createEstablishmentUseCase.execute({
      ownerId: professional.id,
      ...body,
    });

    return CreateEstablishmentPresenter.toHTTP(result);
  }

  @Get()
  async listEstablishments(@User() professional: Professional) {
    const result = await this.listEstablishmentsUseCase.execute({
      ownerId: professional.id,
    });

    return ListEstablishmentsPresenter.toHTTP(professional.id, result);
  }

  @Get(':id')
  async detailEstablishment(
    @User() professional: Professional,
    @Param('id') id: string,
  ) {
    const result = await this.detailEstablishmentUseCase.execute({
      ownerId: professional.id,
      establishmentId: id,
    });

    return DetailEstablishmentPresenter.toHTTP(result);
  }

  @Get(':id/professionals')
  async listEstablishmentProfessionals(
    @User() professional: Professional,
    @Param('id') id: string,
  ) {
    const result = await this.listEstablishmentProfessionalsUseCase.execute({
      establishmentId: id,
      ownerId: professional.id,
    });

    return result.map(ListEstablishmentProfessionalsPresenter.toHTTP);
  }

  @Patch(':id/schedules/:scheduleId')
  async updateSchedule(
    @User() professional: Professional,
    @Param('id') id: string,
    @Param('scheduleId') scheduleId: string,
    @Body('isActive') isActive: boolean,
  ) {
    const result = await this.updateEstablishmentScheduleUseCase.execute({
      ownerId: professional.id,
      establishmentId: id,
      scheduleId,
      isActive,
    });

    return UpdateEstablishmentSchedulePresenter.toHTTP(result);
  }
}

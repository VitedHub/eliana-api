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
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEstablishmentPresenter } from './presenter/create-establishment.presenter';
import { CreateEstablishmentRequest } from './requests/create-establishments.request';
import { ListProfessionalEstablishments } from '@/establishments/application/usecases/list-professional-establishments.usecase';
import { ListProfessionalEstablishmentsPresenter } from './presenter/list-professional-establishments.presenter';
import { DetailEstablishment } from '@/establishments/application/usecases/detail-establishment.usecase';
import { DetailEstablishmentPresenter } from './presenter/detail-establishment.presenter';

@UseGuards(ProfessionalAuthGuard)
@Controller('professional/establishment')
export class ProfessionalEstablishmentController {
  @Inject(CreateEstablishment)
  private readonly createEstablishmentUseCase: CreateEstablishment;
  @Inject(ListProfessionalEstablishments)
  private readonly listProfessionalEstablishmentsUseCase: ListProfessionalEstablishments;
  @Inject(DetailEstablishment)
  private readonly detailEstablishmentUseCase: DetailEstablishment;

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
    const result = await this.listProfessionalEstablishmentsUseCase.execute({
      ownerId: professional.id,
    });

    return ListProfessionalEstablishmentsPresenter.toHTTP(
      professional.id,
      result,
    );
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
}

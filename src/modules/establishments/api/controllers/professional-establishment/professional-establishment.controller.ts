import { User } from '@/auth/api/decorators/user.decorator';
import { ProfessionalAuthGuard } from '@/auth/api/guards/profesional-auth.guard';
import { CreateEstablishment } from '@/establishments/application/usecases/create-establishmet.usecase';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateEstablishmentPresenter } from './presenter/create-establishment.presenter';
import { CreateEstablishmentRequest } from './requests/create-establishments.request';

@UseGuards(ProfessionalAuthGuard)
@Controller('professional/establishment')
export class ProfessionalEstablishmentController {
  @Inject(CreateEstablishment)
  private readonly createEstablishmentUseCase: CreateEstablishment;

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
}

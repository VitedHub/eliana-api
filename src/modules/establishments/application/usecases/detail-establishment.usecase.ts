import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export type DetailEstablishmentInput = {
  ownerId: string;
  establishmentId: string;
};

export class DetailEstablishment {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishementRepo: IEstablishmentRepository;

  async execute(data: DetailEstablishmentInput): Promise<Establishment> {
    const owner = await this.professionalRepo.findById(data.ownerId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const establishment = await this.establishementRepo.findById(
      data.establishmentId,
    );

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    if (establishment.owner.id !== owner.id) {
      throw new ForbiddenException(
        'You must be the owner of the establishment to view it',
      );
    }

    return establishment;
  }
}

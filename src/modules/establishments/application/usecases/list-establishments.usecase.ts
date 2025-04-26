import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export type ListEstablishmentsInput = {
  ownerId: string;
};

export class ListEstablishments {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;

  async execute(data: ListEstablishmentsInput): Promise<Establishment[]> {
    const owner = await this.professionalRepo.findById(data.ownerId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const establishments = await this.establishmentRepo.findByOwner(owner.id);

    return establishments;
  }
}

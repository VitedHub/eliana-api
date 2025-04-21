import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export type ListProfessionalEstablishmentsInput = {
  ownerId: string;
};

export class ListProfessionalEstablishments {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;

  async execute(
    data: ListProfessionalEstablishmentsInput,
  ): Promise<Establishment[]> {
    const owner = await this.professionalRepo.findById(data.ownerId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const establishments = await this.establishmentRepo.findByOwner(owner.id);

    return establishments;
  }
}

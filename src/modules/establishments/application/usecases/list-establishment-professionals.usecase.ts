import {
  ForbiddenException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';

export type ListEstablishmentProfessionalsInput = {
  ownerId: string;
  establishmentId: string;
};

export type ListEstablishmentProfessionalsOutput = {
  id: string;
  name: string;
  email: string;
  phone: string;
  owner: boolean;
};

export class ListEstablishmentProfessionals {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;

  async execute(
    data: ListEstablishmentProfessionalsInput,
  ): Promise<ListEstablishmentProfessionalsOutput[]> {
    const owner = await this.professionalRepo.findById(data.ownerId);

    if (!owner) {
      throw new UnauthorizedException('Owner not found');
    }

    const establishment = await this.establishmentRepo.findById(
      data.establishmentId,
    );

    if (!establishment) {
      throw new NotFoundException('Establishment not Found');
    }

    if (establishment.owner.id !== owner.id) {
      throw new ForbiddenException(
        'You must be the owner of the establishment to view it',
      );
    }

    const professionals = establishment.professionals.getItems().map((ep) => ({
      id: ep.professional.id,
      name: ep.professional.name,
      email: ep.professional.email,
      phone: ep.professional.phone,
      owner: false,
    }));

    return [
      {
        id: establishment.owner.id,
        name: establishment.owner.name,
        email: establishment.owner.email,
        phone: establishment.owner.phone,
        owner: true,
      },
      ...professionals,
    ];
  }
}

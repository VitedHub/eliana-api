import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { AddressBuilder } from '@/addresses/domain/builders/address.builder';
import { EstablishmentBuilder } from '@/establishments/domain/builders/establishment.builder';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export type CreateEstablishmentInput = {
  ownerId: string;
  description: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address: {
    zipCode: string;
    street: string;
    number?: string;
    district: string;
    complement: string;
    city: string;
    state: string;
  };
};

export class CreateEstablishment {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;

  async execute(data: CreateEstablishmentInput): Promise<Establishment> {
    const owner = await this.professionalRepo.findById(data.ownerId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const address = AddressBuilder.create({ ...data.address });

    const establishmentExists =
      (await this.establishmentRepo.findByCnpj(data.cnpj)) ||
      (await this.establishmentRepo.findByEmail(data.email));

    if (establishmentExists) {
      throw new ConflictException(
        'Establishment already registered with this CNPJ',
      );
    }

    const establishment = EstablishmentBuilder.create({
      ...data,
      address,
      owner,
    });

    return await this.establishmentRepo.create(establishment);
  }
}

import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IEstablishmentRepository } from '../repositories/establishment.repository';
import { AddressFactory } from '@/addresses/domain/factories/address.factory';
import { EstablishmentFactory } from '@/establishments/domain/factories/establishment.factory';
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

    const address = AddressFactory.create({ ...data.address });

    const establishmentExists = await this.establishmentRepo.findByCnpj(
      data.cnpj,
    );

    if (establishmentExists) {
      throw new ConflictException(
        'Establishment already registered with this CNPJ',
      );
    }

    const establishment = EstablishmentFactory.create({
      ...data,
      address,
      owner,
    });

    return await this.establishmentRepo.create(establishment);
  }
}

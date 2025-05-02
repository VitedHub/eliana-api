import { Address } from '@/addresses/domain/entities/address.entity';
import { Establishment } from '../entities/establishment.entity';
import { randomUUID } from 'crypto';
import { Professional } from '@/professionals/domain/entities/professionals.entity';

export class EstablishmentBuilder {
  static create(data: EstablishmentData): Establishment {
    const establishment = new Establishment();
    establishment.id = randomUUID();
    establishment.description = data.description;
    establishment.owner = data.owner;
    establishment.name = data.name;
    establishment.cnpj = data.cnpj;
    establishment.phone = data.phone;
    establishment.email = data.email;
    establishment.address = data.address;
    establishment.publicUrl = this.generateSlug(data.name);

    return establishment;
  }

  private static generateSlug(name: string): string {
    const cleanedName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const suffix = randomUUID().slice(0, 6); // Gerar um sufixo aleatório (6 caracteres)
    return `${cleanedName}-${suffix}`;
  }
}

interface EstablishmentData {
  owner: Professional;
  description: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address: Address;
}

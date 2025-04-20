import { randomUUID } from 'crypto';
import { Address } from '../entities/address.entity';

export class AddressFactory {
  static create(data: AddressData): Address {
    const address = new Address();
    address.id = randomUUID();
    address.zipCode = data.zipCode;
    address.street = data.street;
    address.number = data.number;
    address.district = data.district;
    address.complement = data.complement;
    address.city = data.city;
    address.state = data.state;

    return address;
  }
}

interface AddressData {
  zipCode: string;
  street: string;
  number?: string;
  district: string;
  complement: string;
  city: string;
  state: string;
}

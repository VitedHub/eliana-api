import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export class CreateEstablishmentPresenter {
  static toHTTP(data: Establishment) {
    return {
      message: `Establishment ${data.name} created successfully`,
    };
  }
}

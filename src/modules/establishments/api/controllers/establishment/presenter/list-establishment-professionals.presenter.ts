import { ListEstablishmentProfessionalsOutput } from '@/establishments/application/usecases/list-establishment-professionals.usecase';

export class ListEstablishmentProfessionalsPresenter {
  static toHTTP(data: ListEstablishmentProfessionalsOutput) {
    return {
      id: data.id,
      name: data.name,
      owner: data.owner,
      contact: {
        phone: data.phone,
        email: data.email,
      },
    };
  }
}

import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export class DetailEstablishmentPresenter {
  static toHTTP(data: Establishment) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      publicUrl: data.publicUrl,
      schedules: data.schedules.map((schedule) => ({
        id: schedule.id,
        dayOfWeek: schedule.dayOfWeek,
        isActive: schedule.isActive,
      })),
      email: data.email,
      phone: data.phone,
      address: {
        id: data.address.id,
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        district: data.address.district,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
      },
    };
  }
}

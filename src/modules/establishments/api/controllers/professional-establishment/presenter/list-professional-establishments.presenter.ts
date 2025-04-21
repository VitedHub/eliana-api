import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export class ListProfessionalEstablishmentsPresenter {
  static toHTTP(profesionalId: string, data: Establishment[]) {
    const mapEstablishment = (establishment: Establishment) => ({
      id: establishment.id,
      name: establishment.name,
      city: `${establishment.address.city}, ${establishment.address.state}`,
      professionals: establishment.professionals.length,
    });

    const owner = data
      .filter((establishment) => establishment.owner.id === profesionalId)
      .map(mapEstablishment);

    const profesional = data
      .filter((establishment) => {
        return establishment.professionals
          .toArray()
          .some((professional) => professional.id === profesionalId);
      })
      .map(mapEstablishment);

    return {
      owner,
      profesional,
    };
  }
}

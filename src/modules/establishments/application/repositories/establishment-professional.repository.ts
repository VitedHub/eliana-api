export abstract class IEstablishmentProfessionalRepository {
  abstract exists(data: ExistsEstablishmentProfessionalInput): Promise<boolean>;
}

export interface ExistsEstablishmentProfessionalInput {
  professionalId: string;
  establishmentId: string;
}

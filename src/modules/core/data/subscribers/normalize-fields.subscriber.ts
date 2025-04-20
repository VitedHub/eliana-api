import { Address } from '@/addresses/domain/entities/address.entity';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { EventSubscriber, EntityName, EventArgs } from '@mikro-orm/core';

export class NormalizeFieldsSubscriber implements EventSubscriber {
  private LOWERCASE_EXCEPTIONS = [
    'da',
    'das',
    'de',
    'do',
    'dos',
    "l'",
    'e',
    'em',
    'com',
    'a',
    'o',
    'ao',
    'aos',
    'na',
    'no',
  ];

  getSubscribedEntities(): EntityName<unknown>[] {
    return [Establishment, Address];
  }

  beforeCreate<T>(args: EventArgs<T>): void {
    this.normalize(args.entity);
  }

  beforeUpdate<T>(args: EventArgs<T>): void {
    this.normalize(args.entity);
  }

  private normalize<T>(entity: T) {
    const capitalize = (text?: string): string =>
      (text || '')
        .split(' ')
        .map((word) =>
          this.LOWERCASE_EXCEPTIONS.includes(word.toLowerCase())
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');

    if (entity instanceof Establishment) {
      entity.name = capitalize(entity.name);
      entity.description = capitalize(entity.description);
    }

    if (entity instanceof Address) {
      entity.street = capitalize(entity.street);
      entity.city = capitalize(entity.city);
      entity.district = capitalize(entity.district);
      if (entity.complement) entity.complement = capitalize(entity.complement);
    }
  }
}

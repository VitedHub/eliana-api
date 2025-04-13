import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';
import { IClientRepository } from '@/clients/application/repositories/client.repository';
import { Client } from '@/clients/domain/entities/client.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class ClientPgRepository implements IClientRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: Client): Promise<Client> {
    const client = this.entityManager.create(Client, data);
    await this.entityManager.persistAndFlush(client);

    const anamnesis = this.entityManager.create(Anamnesis, {
      id: randomUUID(),
      client,
    });
    await this.entityManager.persistAndFlush(anamnesis);

    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.entityManager.findOne(Client, { id: id });

    return client;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.entityManager.findOne(Client, { email: email });

    return client;
  }

  async findByProviderId(providerId: string): Promise<Client | null> {
    const client = await this.entityManager.findOne(Client, {
      oAuthId: providerId,
    });

    return client;
  }

  async update(data: Client): Promise<void> {
    const client = await this.entityManager.findOne(Client, { id: data.id });

    if (client) {
      this.entityManager.assign(client, data);
      await this.entityManager.flush();
    }
  }
}

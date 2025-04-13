import { Client } from '@/clients/domain/entities/client.entity';
import { Request } from 'express';

export interface ClientAuthenticatedRequest extends Request {
  user: Client;
}

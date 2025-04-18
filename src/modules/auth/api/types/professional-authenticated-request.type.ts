import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Request } from 'express';

export interface ProfessionalAuthenticatedRequest extends Request {
  user: Professional;
}

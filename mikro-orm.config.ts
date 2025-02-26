import { config } from 'dotenv';

import { AnamnesisAnswer } from '@/anamneses/domain/entities/anamnesis-answer.entity';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';
import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { Client } from '@/clients/domain/entities/client.entity';
import { NotificationTemplate } from '@/notifications/domain/entities/notification-template.entity';
import { Notification } from '@/notifications/domain/entities/notification.entity';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

config();

export default defineConfig({
  extensions: [Migrator],
  entities: [
    Schedule,
    TimeSlot,
    Notification,
    NotificationTemplate,
    Client,
    Appointment,
    Anamnesis,
    AnamnesisAnswer,
    AnamnesisQuestion,
  ],
  entitiesTs: ['./src/**/entities/*.ts'],
  driver: PostgreSqlDriver,
  dbName: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
});

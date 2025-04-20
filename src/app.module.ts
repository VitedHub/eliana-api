import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { NotificationTemplate } from '@/notifications/domain/entities/notification-template.entity';
import { Client } from '@/clients/domain/entities/client.entity';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';
import { AnamnesisAnswer } from '@/anamneses/domain/entities/anamnesis-answer.entity';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';
import { Notification } from '@/notifications/domain/entities/notification.entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AuthModule } from '@/auth/auth.module';
import { ClientsModule } from '@/clients/clients.module';
import { AnamnesisModule } from '@/anamneses/anamnesis.module';
import { ScheduleModule } from '@/schedules/schedule.module';
import { AppointmentModule } from '@/appointments/appointment.module';
import { ScheduleException } from '@/schedules/domain/entities/schedule-exception.entity';
import { EstablishmentsModule } from '@/establishments/establishments.module';
import { AddressesModule } from '@/addresses/addresses.module';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { NormalizeFieldsSubscriber } from '@/core/data/subscribers/normalize-fields.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
          ScheduleException,
        ],
        entitiesTs: ['./src/**/entities/*.ts'],
        driver: PostgreSqlDriver,
        dbName: configService.get('DB_DATABASE'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        subscribers: [NormalizeFieldsSubscriber],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ClientsModule,
    AnamnesisModule,
    ScheduleModule,
    AppointmentModule,
    ProfessionalModule,
    EstablishmentsModule,
    AddressesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

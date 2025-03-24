import { Migration } from '@mikro-orm/migrations';

export class Migration20250323033745_remodeling_appointment_schedule extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "scheduled_appointment" cascade;`);

    this.addSql(`alter table "appointments" drop column "date_time";`);

    this.addSql(`alter table "appointments" add column "time_slot_id" uuid not null, add column "date" date not null;`);
    this.addSql(`alter table "appointments" add constraint "appointments_time_slot_id_foreign" foreign key ("time_slot_id") references "time_slots" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "scheduled_appointment" ("id" uuid not null, "client_id" uuid not null, "time_slot_id" uuid not null, "date" date not null, "status" text check ("status" in ('CONFIRMED', 'CANCELLED')) not null, "created_at" timestamptz not null, constraint "scheduled_appointment_pkey" primary key ("id"));`);

    this.addSql(`alter table "scheduled_appointment" add constraint "scheduled_appointment_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade;`);
    this.addSql(`alter table "scheduled_appointment" add constraint "scheduled_appointment_time_slot_id_foreign" foreign key ("time_slot_id") references "time_slots" ("id") on update cascade;`);

    this.addSql(`alter table "appointments" drop constraint "appointments_time_slot_id_foreign";`);

    this.addSql(`alter table "appointments" drop column "time_slot_id", drop column "date";`);

    this.addSql(`alter table "appointments" add column "date_time" timestamptz not null;`);
  }

}

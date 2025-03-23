import { Migration } from '@mikro-orm/migrations';

export class Migration20250323015024_add_new_scheduler_related_tables extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "schedule_exception" ("id" uuid not null, "schedule_id" uuid not null, "exception_date" date not null, "start_time" time(0) not null, "end_time" time(0) not null, "is_blocked" boolean not null default true, constraint "schedule_exception_pkey" primary key ("id"));`);

    this.addSql(`create table "scheduled_appointment" ("id" uuid not null, "client_id" uuid not null, "time_slot_id" uuid not null, "date" date not null, "status" text check ("status" in ('CONFIRMED', 'CANCELLED')) not null, "created_at" timestamptz not null, constraint "scheduled_appointment_pkey" primary key ("id"));`);

    this.addSql(`alter table "schedule_exception" add constraint "schedule_exception_schedule_id_foreign" foreign key ("schedule_id") references "schedules" ("id") on update cascade;`);

    this.addSql(`alter table "scheduled_appointment" add constraint "scheduled_appointment_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade;`);
    this.addSql(`alter table "scheduled_appointment" add constraint "scheduled_appointment_time_slot_id_foreign" foreign key ("time_slot_id") references "time_slots" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "schedule_exception" cascade;`);

    this.addSql(`drop table if exists "scheduled_appointment" cascade;`);
  }

}

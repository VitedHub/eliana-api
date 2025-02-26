import { Migration } from '@mikro-orm/migrations';

export class Migration20250226195159_initial extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "anamnesis_questions" ("id" uuid not null, "text" varchar(255) not null, "type" text check ("type" in ('TEXT', 'MULTIPLE_CHOICE')) not null, "questions" jsonb null, "order" int null, constraint "anamnesis_questions_pkey" primary key ("id"));`);

    this.addSql(`create table "clients" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(11) not null, "password" varchar(255) null, "two_factor_enable" boolean null default false, "two_factor_code" varchar(255) null, "two_factor_code_expires_at" timestamptz null, "auth_provider" text check ("auth_provider" in ('EMAIL_PASSWORD', 'GOOGLE', 'FACEBOOK', 'APPLE')) not null, "oauth_id" varchar(255) null, "oauth_token" varchar(255) null, "created_at" timestamptz not null, constraint "clients_pkey" primary key ("id"));`);
    this.addSql(`alter table "clients" add constraint "clients_email_unique" unique ("email");`);

    this.addSql(`create table "appointments" ("id" uuid not null, "date_time" timestamptz not null, "status" text check ("status" in ('SCHEDULED', 'CANCELLED', 'RESCHEDULED')) not null, "google_calendar_event_id" varchar(255) null, "google_calendar_event_url" varchar(255) null, "client_id" uuid not null, "created_at" timestamptz not null, constraint "appointments_pkey" primary key ("id"));`);

    this.addSql(`create table "anamneses" ("id" uuid not null, "client_id" uuid not null, "created_at" timestamptz not null, constraint "anamneses_pkey" primary key ("id"));`);
    this.addSql(`alter table "anamneses" add constraint "anamneses_client_id_unique" unique ("client_id");`);

    this.addSql(`create table "anamnesis_answers" ("id" uuid not null, "anamnesis_id" uuid not null, "question_id" uuid not null, "answer" text null, "created_at" timestamptz not null, constraint "anamnesis_answers_pkey" primary key ("id"));`);

    this.addSql(`create table "notifications" ("id" uuid not null, "appointment_id" uuid null, "client_id" uuid null, "status" text check ("status" in ('PENDING', 'SENT', 'FAILED')) not null, "message" text null, "sent_at" time(0) null, "created_at" timestamptz not null, constraint "notifications_pkey" primary key ("id"));`);

    this.addSql(`create table "notification_templates" ("id" uuid not null, "title" varchar(255) not null, "type" text check ("type" in ('')) not null, "message" text not null, "image_url" varchar(255) null, "is_active" boolean not null default true, "send_before_hours" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "notification_templates_pkey" primary key ("id"));`);

    this.addSql(`create table "schedules" ("id" uuid not null, "day_of_week" text check ("day_of_week" in ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')) not null, "is_active" boolean not null default true, "created_at" timestamptz not null, constraint "schedules_pkey" primary key ("id"));`);

    this.addSql(`create table "time_slots" ("id" uuid not null, "start_time" time(0) not null, "end_time" time(0) not null, "schedule_id" uuid not null, "created_at" timestamptz not null, constraint "time_slots_pkey" primary key ("id"));`);

    this.addSql(`alter table "appointments" add constraint "appointments_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade;`);

    this.addSql(`alter table "anamneses" add constraint "anamneses_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade;`);

    this.addSql(`alter table "anamnesis_answers" add constraint "anamnesis_answers_anamnesis_id_foreign" foreign key ("anamnesis_id") references "anamneses" ("id") on update cascade;`);
    this.addSql(`alter table "anamnesis_answers" add constraint "anamnesis_answers_question_id_foreign" foreign key ("question_id") references "anamnesis_questions" ("id") on update cascade;`);

    this.addSql(`alter table "notifications" add constraint "notifications_appointment_id_foreign" foreign key ("appointment_id") references "appointments" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "notifications" add constraint "notifications_client_id_foreign" foreign key ("client_id") references "clients" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "time_slots" add constraint "time_slots_schedule_id_foreign" foreign key ("schedule_id") references "schedules" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "anamnesis_answers" drop constraint "anamnesis_answers_question_id_foreign";`);

    this.addSql(`alter table "appointments" drop constraint "appointments_client_id_foreign";`);

    this.addSql(`alter table "anamneses" drop constraint "anamneses_client_id_foreign";`);

    this.addSql(`alter table "notifications" drop constraint "notifications_client_id_foreign";`);

    this.addSql(`alter table "notifications" drop constraint "notifications_appointment_id_foreign";`);

    this.addSql(`alter table "anamnesis_answers" drop constraint "anamnesis_answers_anamnesis_id_foreign";`);

    this.addSql(`alter table "time_slots" drop constraint "time_slots_schedule_id_foreign";`);

    this.addSql(`drop table if exists "anamnesis_questions" cascade;`);

    this.addSql(`drop table if exists "clients" cascade;`);

    this.addSql(`drop table if exists "appointments" cascade;`);

    this.addSql(`drop table if exists "anamneses" cascade;`);

    this.addSql(`drop table if exists "anamnesis_answers" cascade;`);

    this.addSql(`drop table if exists "notifications" cascade;`);

    this.addSql(`drop table if exists "notification_templates" cascade;`);

    this.addSql(`drop table if exists "schedules" cascade;`);

    this.addSql(`drop table if exists "time_slots" cascade;`);
  }

}

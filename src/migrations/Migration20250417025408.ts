import { Migration } from '@mikro-orm/migrations';

export class Migration20250417025408 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "addresses" ("id" uuid not null, "number" varchar(255) not null, "complement" varchar(255) null, "district" varchar(255) not null, "city" varchar(255) not null, "state" varchar(255) not null, "zip_code" varchar(255) not null, "country" varchar(255) not null default 'Brasil', "latitude" real null, "longitude" real null, "created_at" timestamptz not null, constraint "addresses_pkey" primary key ("id"));`);

    this.addSql(`create table "professionals" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(11) null, "password" varchar(255) null, "auth_provider" text[] not null default '{}', "oauth_id" varchar(255) null, "created_at" timestamptz not null, constraint "professionals_pkey" primary key ("id"));`);
    this.addSql(`alter table "professionals" add constraint "professionals_email_unique" unique ("email");`);

    this.addSql(`create table "establishments" ("id" uuid not null, "cnpj" varchar(255) null, "owner_id" uuid not null, "name" varchar(255) not null, "description" text not null, "phone" varchar(11) null, "email" varchar(255) null, "public_url" varchar(255) not null, "address_id" uuid null, "created_at" timestamptz not null, constraint "establishments_pkey" primary key ("id"));`);
    this.addSql(`alter table "establishments" add constraint "establishments_cnpj_unique" unique ("cnpj");`);
    this.addSql(`alter table "establishments" add constraint "establishments_public_url_unique" unique ("public_url");`);

    this.addSql(`create table "establishment_professionals" ("id" uuid not null, "professional_id" uuid not null, "establishment_id" uuid not null, "created_at" timestamptz not null, constraint "establishment_professionals_pkey" primary key ("id"));`);

    this.addSql(`alter table "establishments" add constraint "establishments_owner_id_foreign" foreign key ("owner_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "establishments" add constraint "establishments_address_id_foreign" foreign key ("address_id") references "addresses" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "establishment_professionals" add constraint "establishment_professionals_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "establishment_professionals" add constraint "establishment_professionals_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade;`);

    this.addSql(`alter table "notification_templates" add column "professional_id" uuid null, add column "establishment_id" uuid null;`);
    this.addSql(`alter table "notification_templates" add constraint "notification_templates_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "notification_templates" add constraint "notification_templates_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "anamnesis_questions" add column "professional_id" uuid null, add column "establishment_id" uuid null;`);
    this.addSql(`alter table "anamnesis_questions" add constraint "anamnesis_questions_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "anamnesis_questions" add constraint "anamnesis_questions_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "anamneses" add column "professional_id" uuid not null, add column "establishment_id" uuid not null;`);
    this.addSql(`alter table "anamneses" add constraint "anamneses_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "anamneses" add constraint "anamneses_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade;`);

    this.addSql(`alter table "schedules" add column "professional_id" uuid not null, add column "establishment_id" uuid not null;`);
    this.addSql(`alter table "schedules" add constraint "schedules_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "schedules" add constraint "schedules_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade;`);

    this.addSql(`alter table "schedule_exception" add column "professional_id" uuid not null, add column "establishment_id" uuid not null;`);
    this.addSql(`alter table "schedule_exception" add constraint "schedule_exception_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "schedule_exception" add constraint "schedule_exception_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade;`);

    this.addSql(`alter table "appointments" add column "professional_id" uuid not null, add column "establishment_id" uuid not null;`);
    this.addSql(`alter table "appointments" add constraint "appointments_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "appointments" add constraint "appointments_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "establishments" drop constraint "establishments_address_id_foreign";`);

    this.addSql(`alter table "establishments" drop constraint "establishments_owner_id_foreign";`);

    this.addSql(`alter table "notification_templates" drop constraint "notification_templates_professional_id_foreign";`);

    this.addSql(`alter table "establishment_professionals" drop constraint "establishment_professionals_professional_id_foreign";`);

    this.addSql(`alter table "anamnesis_questions" drop constraint "anamnesis_questions_professional_id_foreign";`);

    this.addSql(`alter table "anamneses" drop constraint "anamneses_professional_id_foreign";`);

    this.addSql(`alter table "schedules" drop constraint "schedules_professional_id_foreign";`);

    this.addSql(`alter table "schedule_exception" drop constraint "schedule_exception_professional_id_foreign";`);

    this.addSql(`alter table "appointments" drop constraint "appointments_professional_id_foreign";`);

    this.addSql(`alter table "notification_templates" drop constraint "notification_templates_establishment_id_foreign";`);

    this.addSql(`alter table "establishment_professionals" drop constraint "establishment_professionals_establishment_id_foreign";`);

    this.addSql(`alter table "anamnesis_questions" drop constraint "anamnesis_questions_establishment_id_foreign";`);

    this.addSql(`alter table "anamneses" drop constraint "anamneses_establishment_id_foreign";`);

    this.addSql(`alter table "schedules" drop constraint "schedules_establishment_id_foreign";`);

    this.addSql(`alter table "schedule_exception" drop constraint "schedule_exception_establishment_id_foreign";`);

    this.addSql(`alter table "appointments" drop constraint "appointments_establishment_id_foreign";`);

    this.addSql(`drop table if exists "addresses" cascade;`);

    this.addSql(`drop table if exists "professionals" cascade;`);

    this.addSql(`drop table if exists "establishments" cascade;`);

    this.addSql(`drop table if exists "establishment_professionals" cascade;`);

    this.addSql(`alter table "anamnesis_questions" drop column "professional_id", drop column "establishment_id";`);

    this.addSql(`alter table "anamneses" drop column "professional_id", drop column "establishment_id";`);

    this.addSql(`alter table "notification_templates" drop column "professional_id", drop column "establishment_id";`);

    this.addSql(`alter table "schedules" drop column "professional_id", drop column "establishment_id";`);

    this.addSql(`alter table "schedule_exception" drop column "professional_id", drop column "establishment_id";`);

    this.addSql(`alter table "appointments" drop column "professional_id", drop column "establishment_id";`);
  }

}

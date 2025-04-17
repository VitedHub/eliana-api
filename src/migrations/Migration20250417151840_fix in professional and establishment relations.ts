import { Migration } from '@mikro-orm/migrations';

export class Migration20250417151840_fix extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "establishments" drop constraint "establishments_owner_id_foreign";`,
    );

    this.addSql(
      `alter table "notification_templates" drop constraint "notification_templates_professional_id_foreign";`,
    );

    this.addSql(
      `alter table "anamnesis_questions" drop constraint "anamnesis_questions_professional_id_foreign";`,
    );

    this.addSql(
      `alter table "anamneses" drop constraint "anamneses_professional_id_foreign";`,
    );

    this.addSql(
      `alter table "schedules" drop constraint "schedules_professional_id_foreign";`,
    );

    this.addSql(
      `alter table "establishments" rename column "owner_id" to "professional_id";`,
    );
    this.addSql(
      `alter table "establishments" add constraint "establishments_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "notification_templates" drop column "professional_id";`,
    );

    this.addSql(
      `alter table "anamnesis_questions" drop column "professional_id";`,
    );

    this.addSql(`alter table "anamneses" drop column "professional_id";`);

    this.addSql(`alter table "schedules" drop column "professional_id";`);

    this.addSql(
      `alter table "time_slots" add column "professional_id" uuid not null;`,
    );
    this.addSql(
      `alter table "time_slots" add constraint "time_slots_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "establishments" drop constraint "establishments_professional_id_foreign";`,
    );

    this.addSql(
      `alter table "time_slots" drop constraint "time_slots_professional_id_foreign";`,
    );

    this.addSql(
      `alter table "establishments" rename column "professional_id" to "owner_id";`,
    );
    this.addSql(
      `alter table "establishments" add constraint "establishments_owner_id_foreign" foreign key ("owner_id") references "professionals" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "notification_templates" add column "professional_id" uuid null;`,
    );
    this.addSql(
      `alter table "notification_templates" add constraint "notification_templates_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade on delete set null;`,
    );

    this.addSql(
      `alter table "anamnesis_questions" add column "professional_id" uuid null;`,
    );
    this.addSql(
      `alter table "anamnesis_questions" add constraint "anamnesis_questions_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade on delete set null;`,
    );

    this.addSql(
      `alter table "anamneses" add column "professional_id" uuid not null;`,
    );
    this.addSql(
      `alter table "anamneses" add constraint "anamneses_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "schedules" add column "professional_id" uuid not null;`,
    );
    this.addSql(
      `alter table "schedules" add constraint "schedules_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`,
    );

    this.addSql(`alter table "time_slots" drop column "professional_id";`);
  }
}

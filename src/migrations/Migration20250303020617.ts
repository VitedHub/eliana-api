import { Migration } from '@mikro-orm/migrations';

export class Migration20250303020617 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "notification_templates" drop constraint if exists "notification_templates_type_check";`);

    this.addSql(`alter table "clients" drop column "oauth_token";`);

    this.addSql(`alter table "notification_templates" add constraint "notification_templates_type_check" check("type" in (''));`);

    this.addSql(`alter table "schedules" alter column "day_of_week" type varchar using ("day_of_week"::varchar);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "notification_templates" drop constraint if exists "notification_templates_type_check";`);

    this.addSql(`alter table "clients" add column "oauth_token" varchar(255) null;`);

    this.addSql(`alter table "notification_templates" add constraint "notification_templates_type_check" check("type" in (''));`);

    this.addSql(`alter table "schedules" alter column "day_of_week" type text using ("day_of_week"::text);`);
  }

}

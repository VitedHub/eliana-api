import { Migration } from '@mikro-orm/migrations';

export class Migration20250304042430 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "clients" drop constraint if exists "clients_auth_provider_check";`);

    this.addSql(`alter table "clients" alter column "auth_provider" type text[] using ("auth_provider"::text[]);`);
    this.addSql(`alter table "clients" alter column "auth_provider" set default '{}';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "clients" drop constraint if exists "clients_auth_provider_check";`);

    this.addSql(`alter table "clients" alter column "auth_provider" drop default;`);
    this.addSql(`alter table "clients" alter column "auth_provider" type text using ("auth_provider"::text);`);
    this.addSql(`alter table "clients" add constraint "clients_auth_provider_check" check("auth_provider" in ('EMAIL_PASSWORD', 'GOOGLE', 'FACEBOOK', 'APPLE'));`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250306163239_turn_client_phone_optional extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "clients" alter column "phone" type varchar(11) using ("phone"::varchar(11));`);
    this.addSql(`alter table "clients" alter column "phone" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "clients" alter column "phone" type varchar(11) using ("phone"::varchar(11));`);
    this.addSql(`alter table "clients" alter column "phone" set not null;`);
  }

}

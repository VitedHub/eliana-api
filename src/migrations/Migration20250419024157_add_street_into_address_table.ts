import { Migration } from '@mikro-orm/migrations';

export class Migration20250419024157_add_street_into_address_table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "addresses" add column "street" varchar(255) not null;`);
    this.addSql(`alter table "addresses" alter column "number" type varchar(255) using ("number"::varchar(255));`);
    this.addSql(`alter table "addresses" alter column "number" drop not null;`);
    this.addSql(`alter table "addresses" alter column "country" type varchar(255) using ("country"::varchar(255));`);
    this.addSql(`alter table "addresses" alter column "country" set default 'Brazil';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "addresses" drop column "street";`);

    this.addSql(`alter table "addresses" alter column "number" type varchar(255) using ("number"::varchar(255));`);
    this.addSql(`alter table "addresses" alter column "number" set not null;`);
    this.addSql(`alter table "addresses" alter column "country" type varchar(255) using ("country"::varchar(255));`);
    this.addSql(`alter table "addresses" alter column "country" set default 'Brasil';`);
  }

}

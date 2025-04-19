import { Migration } from '@mikro-orm/migrations';

export class Migration20250419031410_turn_address_column_required_in_establishment_table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "establishments" drop constraint "establishments_address_id_foreign";`);

    this.addSql(`alter table "establishments" alter column "address_id" drop default;`);
    this.addSql(`alter table "establishments" alter column "address_id" type uuid using ("address_id"::text::uuid);`);
    this.addSql(`alter table "establishments" alter column "address_id" set not null;`);
    this.addSql(`alter table "establishments" add constraint "establishments_address_id_foreign" foreign key ("address_id") references "addresses" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "establishments" drop constraint "establishments_address_id_foreign";`);

    this.addSql(`alter table "establishments" alter column "address_id" drop default;`);
    this.addSql(`alter table "establishments" alter column "address_id" type uuid using ("address_id"::text::uuid);`);
    this.addSql(`alter table "establishments" alter column "address_id" drop not null;`);
    this.addSql(`alter table "establishments" add constraint "establishments_address_id_foreign" foreign key ("address_id") references "addresses" ("id") on update cascade on delete set null;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250421031909_resuming_address_state_to_length_of_two extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "addresses" alter column "state" type varchar(2) using ("state"::varchar(2));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "addresses" alter column "state" type varchar(255) using ("state"::varchar(255));`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250418193431_add_unique_into_establishment_email extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "establishments" add constraint "establishments_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "establishments" drop constraint "establishments_email_unique";`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250420171052_change_establishment_owner_cloumn_name extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "establishments" drop constraint "establishments_professional_id_foreign";`);

    this.addSql(`alter table "establishments" rename column "professional_id" to "owner_id";`);
    this.addSql(`alter table "establishments" add constraint "establishments_owner_id_foreign" foreign key ("owner_id") references "professionals" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "establishments" drop constraint "establishments_owner_id_foreign";`);

    this.addSql(`alter table "establishments" rename column "owner_id" to "professional_id";`);
    this.addSql(`alter table "establishments" add constraint "establishments_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250417152624_add_establishment_relation_into_time_slot extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "time_slots" add column "establishment_id" uuid not null;`);
    this.addSql(`alter table "time_slots" add constraint "time_slots_establishment_id_foreign" foreign key ("establishment_id") references "establishments" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "time_slots" drop constraint "time_slots_establishment_id_foreign";`);

    this.addSql(`alter table "time_slots" drop column "establishment_id";`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20250426210417_add_active_and_schedule_into_establishment_and_establishemt_professional extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "establishment_professionals" add column "is_active" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "establishment_professionals" drop column "is_active";`);
  }

}

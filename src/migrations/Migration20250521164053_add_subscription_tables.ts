import { Migration } from '@mikro-orm/migrations';

export class Migration20250521164053_add_subscription_tables extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "subscription_plan" ("id" uuid not null, "name" varchar(255) not null, "price" int not null, "stripe_price_id" varchar(255) null, "max_establishments" int null, "max_professionals_per_establishment" int null, "billing_cycle" varchar(255) null, constraint "subscription_plan_pkey" primary key ("id"));`);

    this.addSql(`create table "professional_subscription" ("id" uuid not null, "professional_id" uuid not null, "subscription_plan_id" uuid not null, "stripe_subscription_id" varchar(255) null, "start_date" timestamptz not null, "end_date" timestamptz null, "is_active" boolean not null, "created_at" timestamptz not null, constraint "professional_subscription_pkey" primary key ("id"));`);

    this.addSql(`alter table "professional_subscription" add constraint "professional_subscription_professional_id_foreign" foreign key ("professional_id") references "professionals" ("id") on update cascade;`);
    this.addSql(`alter table "professional_subscription" add constraint "professional_subscription_subscription_plan_id_foreign" foreign key ("subscription_plan_id") references "subscription_plan" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "professional_subscription" drop constraint "professional_subscription_subscription_plan_id_foreign";`);

    this.addSql(`drop table if exists "subscription_plan" cascade;`);

    this.addSql(`drop table if exists "professional_subscription" cascade;`);
  }

}

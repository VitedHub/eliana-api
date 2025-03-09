import { Migration } from '@mikro-orm/migrations';

export class Migration20250309034137_change_question_options_type extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "anamnesis_questions" drop column "questions";`);

    this.addSql(`alter table "anamnesis_questions" add column "options" text[] null;`);

    this.addSql(`alter table "anamnesis_answers" alter column "answer" type text[] using ("answer"::text[]);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "anamnesis_questions" drop column "options";`);

    this.addSql(`alter table "anamnesis_questions" add column "questions" jsonb null;`);

    this.addSql(`alter table "anamnesis_answers" alter column "answer" type text using ("answer"::text);`);
  }

}

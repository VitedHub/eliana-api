import { Seeder } from '@mikro-orm/seeder';
import { SubscriptionPlanSeeder } from './SubscriptionPlanSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]): Promise<void> {
    await this.call(em, [SubscriptionPlanSeeder]);
  }
}

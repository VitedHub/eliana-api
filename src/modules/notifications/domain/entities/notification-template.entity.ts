import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { NOTIFICATION_TEMPLATE_TYPE } from '../enums/notification-template-type.enum';

@Entity({ tableName: 'notification_templates' })
export class NotificationTemplate {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @Property({ name: 'title', type: 'varchar', length: 255 })
  title!: string;

  @Enum({
    items: () => NOTIFICATION_TEMPLATE_TYPE,
    name: 'type',
    type: 'varchar',
  })
  type!: NOTIFICATION_TEMPLATE_TYPE;

  @Property({ name: 'message', type: 'text' })
  message!: string;

  @Property({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Property({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean = true;

  @Property({ name: 'send_before_hours', type: 'int', nullable: true })
  sendBeforeHours?: number;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();

  @Property({
    name: 'updated_at',
    onUpdate: () => new Date(),
    type: 'timestamp with time zone',
  })
  updatedAt: Date = new Date();
}

import { AggregateRoot, AggregateRootConfig, ApplyEvent, StoredEvent } from '@event-nest/core';
import { CategoryCreatedEvent, CategoryUpdatedEvent } from '@share/libs/event-source/events/category.event';
import { AGGREGATE_NAME } from '@share/enums';

type CategorySnapshot = {
  name: string;
  icon: string;
};

@AggregateRootConfig({ name: AGGREGATE_NAME.CATEGORY, snapshotRevision: 1 })
export default class Category extends AggregateRoot {
  private name!: string;
  private icon!: string;

  private constructor(id: string) {
    super(id);
  }

  static createNew(id: string, name: string, icon: string) {
    const category = new Category(id);
    const event = new CategoryCreatedEvent(name, icon);
    category.applyCategoryCreatedEvent(event);
    category.append(event);
    return category;
  }

  toSnapshot(): CategorySnapshot {
    return { name: this.name, icon: this.icon };
  }

  applySnapshot(snapshot: CategorySnapshot) {
    this.name = snapshot.name;
    this.icon = snapshot.icon;
  }

  static fromEvents(id: string, events: Array<StoredEvent>, snapshot: CategorySnapshot): Category {
    const category = new Category(id);
    category.reconstitute(events, snapshot);
    return category;
  }

  public update(name: string, icon: string) {
    const event = new CategoryUpdatedEvent(name, icon);
    this.applyCategoryUpdatedEvent(event);
    this.append(event);
  }

  @ApplyEvent(CategoryCreatedEvent)
  private applyCategoryCreatedEvent(event: CategoryCreatedEvent) {
    this.name = event.name;
    this.icon = event.icon;
  }

  @ApplyEvent(CategoryUpdatedEvent)
  private applyCategoryUpdatedEvent(event: CategoryUpdatedEvent) {
    this.name = event.name;
    this.icon = event.icon;
  }
}

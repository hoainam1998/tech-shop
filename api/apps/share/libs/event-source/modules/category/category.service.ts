import { Inject, Injectable } from '@nestjs/common';
import { EVENT_STORE, type EventStore } from '@event-nest/core';
import Category from './category-aggregate-root';

@Injectable()
export default class CategoryService {
  constructor(@Inject(EVENT_STORE) private readonly eventStore: EventStore) {}

  async createCategory(id: string, name: string, icon: string) {
    const category = Category.createNew(id, name, icon);
    const categoryWithPublisher = this.eventStore.addPublisher(category);
    await categoryWithPublisher.commit();
    return category.id;
  }

  async updateCategory(id: string, name: string, icon: string) {
    const { events, snapshot } = await this.eventStore.findWithSnapshot(Category, id);
    const category = Category.fromEvents(id, events, snapshot!);
    category.update(name, icon);
    const categoryWithPublisher = this.eventStore.addPublisher(category);
    await categoryWithPublisher.commit();
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { EVENT_STORE, type EventStore } from '@event-nest/core';
import { randomUUID } from 'crypto';
import User from './user-aggregate-root';

@Injectable()
export default class UserService {
  constructor(@Inject(EVENT_STORE) private eventStore: EventStore) {}

  async createUser(name: string, email: string) {
    const id = randomUUID();
    const user = User.createNew(id, name, email);
    const userWithPublisher = this.eventStore.addPublisher(user);
    await userWithPublisher.commit();
    return user.id;
  }

  async updateUser(id: string, newName: string) {
    const events = await this.eventStore.findByAggregateRootId(User, id);
    const user = User.fromEvents(id, events);
    const userWithPublisher = this.eventStore.addPublisher(user);
    user.update(newName);
    await userWithPublisher.commit();
  }
}

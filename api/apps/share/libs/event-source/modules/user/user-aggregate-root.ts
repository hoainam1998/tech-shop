import { AggregateRoot, AggregateRootConfig, ApplyEvent, StoredEvent } from '@event-nest/core';
import { UserCreatedEvent, UserUpdatedEvent } from '@share/libs/event-source/events/user.event';

@AggregateRootConfig({ name: 'User' })
export default class User extends AggregateRoot {
  private name: string;
  private email: string;

  private constructor(id: string) {
    super(id);
  }

  public static createNew(id: string, name: string, email: string): User {
    const user = new User(id);
    const event = new UserCreatedEvent(name, email);
    user.applyUserCreatedEvent(event);
    user.append(event);
    return user;
  }

  public static fromEvents(id: string, events: Array<StoredEvent>): User {
    const user = new User(id);
    user.reconstitute(events);
    return user;
  }

  public update(newName: string) {
    const event = new UserUpdatedEvent(newName);
    this.applyUserUpdatedEvent(event);
    this.append(event);
  }

  @ApplyEvent(UserCreatedEvent)
  private applyUserCreatedEvent(event: UserCreatedEvent) {
    this.name = event.name;
    this.email = event.email;
  }

  @ApplyEvent(UserUpdatedEvent)
  private applyUserUpdatedEvent(event: UserUpdatedEvent) {
    this.name = event.newName;
  }
}

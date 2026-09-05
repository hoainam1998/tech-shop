import { DomainEvent } from '@event-nest/core';
import { EVENT_NAME } from '@share/enums';

@DomainEvent(EVENT_NAME.CATEGORY_CREATED_EVENT)
export class CategoryCreatedEvent {
  constructor(
    public name: string,
    public icon: string,
  ) {}
}

@DomainEvent(EVENT_NAME.CATEGORY_UPDATED_EVENT)
export class CategoryUpdatedEvent {
  constructor(
    public name: string,
    public icon: string,
  ) {}
}

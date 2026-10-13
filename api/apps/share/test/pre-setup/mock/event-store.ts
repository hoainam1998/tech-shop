const eventStore: any = {
  addPublisher: jest.fn((aggregate) => aggregate),
  findWithSnapshot: jest.fn(),
};

globalThis.eventStore = eventStore;

export default eventStore;

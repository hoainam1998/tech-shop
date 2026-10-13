const queue: any = {
  add: jest.fn().mockResolvedValue({}),
  close: jest.fn(),
};

globalThis.queue = queue;

export { queue };

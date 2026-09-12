import BaseRouter from './base';

class HealthyRouter extends BaseRouter {
  constructor() {
    super('healthy');
  }
}

export default new HealthyRouter();

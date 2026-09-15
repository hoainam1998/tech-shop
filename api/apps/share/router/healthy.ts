import BaseRouter from './base';

class HealthyRouter extends BaseRouter {}

export default HealthyRouter.getInstance<HealthyRouter>('healthy');

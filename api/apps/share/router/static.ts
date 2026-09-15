import BaseRouter from './base';

class StaticRouter extends BaseRouter {}

export default StaticRouter.getInstance<StaticRouter>('static');

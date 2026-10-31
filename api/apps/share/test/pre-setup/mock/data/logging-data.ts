import { pathToFileURL } from 'url';

const context = 'logging context';
const file = pathToFileURL(__filename).href;
const user = {
  mail: 'mock_user@gmai.com',
};
const message = 'error message';
const funcName = 'function name';
const payload: any = {};

export { context, file, user, message, funcName, payload };

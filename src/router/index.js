import compose from 'koa-compose';

import login from './login';
import user from './user';
import sync from './sync';

export default () => compose([
  login(),
  user(),
  sync()
]);

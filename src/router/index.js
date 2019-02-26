import compose from 'koa-compose';

import user from './user';
import sync from './sync';

export default () => compose([
  user(),
  sync()
]);

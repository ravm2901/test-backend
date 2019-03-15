// const config = require('config')
import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import config from './config';
import router from './router';
import db from './middleware/database';
import jwt from 'koa-jwt';
import key from './config/key.json';


console.info(`ROOT_PATH: ${config.ROOT_PATH}`);

const app = new Koa();


// Custom 401 handling
app.use(function(ctx, next){

  console.log(ctx.request);

  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});



app.use(jwt({
  secret: key.secret
}).unless({
  path: [/^\/(public|sync|login)/, "/"]
}));


// sequelize & squel
app.use(db);


// x-response-time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


// rest logger
app.use(logger());
app.use(bodyParser());

app.use(router());



app.listen(process.env.PORT || 3000);
console.info(`Node ${process.version} : ${config.NODE_ENV} listening on port ${process.env.PORT || 3000}`);

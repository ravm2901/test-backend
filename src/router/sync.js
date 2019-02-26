import Router from 'koa-router';

const router = new Router();

router.get('/sync', async (ctx) => {
  const sq = ctx.orm();
  const User = ctx.orm().user;

  sq.sync({ force: true })
    .then(() => User.create({
      name: 'Chuck',
      email: 'chuck@mail.com',
      birthday: new Date(1980, 6, 20)
    }));

  ctx.status = 200;
});

const routes = router.routes();
export default () => routes;

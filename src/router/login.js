import Router from 'koa-router';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/key.json';

const router = new Router();



/*******************
// Router
*******************/
router.post('/login', login);



//Login
async function login(ctx, next){


  try{
    const User = ctx.orm().user;

    const user = await User.findOne({
        where: {
            email: ctx.request.body.email
        }
    });



    if (!user) {
      ctx.status = 401;
      ctx.body = {
        error: "Email not found"
      }
    }
    else if (ctx.request.body.name == user.name) {
      ctx.body = {
        token: jsonwebtoken.sign({
          data: user
        }, config.secret)
      }
      next();
    } else {
      ctx.status = 401;
      ctx.body = {
        error: "Authentication failed"
      }
    }
  }
  catch(err){
    ctx.status = 401;
    ctx.body = {
      error: "Authentication failed"
    }
  }


};



const routes = router.routes();
export default () => routes;

import Router from 'koa-router';
import jwt from 'koa-jwt';
import key from '../config/key.json';
import { is } from '../../utils/utils';
import { userAuth } from '../middleware/userAuth';


const router = new Router();



/******************************************************************************
*** Auxiliar functions
******************************************************************************/
var setCTX = function(ctx, status, message){
  if(status == 200){
    ctx.status = status;
    ctx.body = message;
  }
  else{
    ctx.status = status;
    ctx.body = {
      error: status,
      description: message
    };
  }
}




var getErrMsg = function(v){
  let message = '';

  if(!v.email){
    message += 'Invalid email address|';
  }

  if(!v.name){
    message += 'The name is required|';
  }

  if(!v.birthday){
    message += 'Invalid birthday';
  }

  return message;
}






var validateData = function(body, type){

  let validData = {
    name: false,
    email: false,
    birthday: false
  };


  const fnName = (name = is.required) => name.length > 1;

  validData.email = is.vEmail(body.email);
  validData.name = fnName(body.name);

  if(type == 1){
    if( typeof body.birthday !== 'undefined'){
        validData.birthday = body.birthday.length == 10;
    }
  }
  else if( typeof body.birthday !== 'undefined'){
    validData.birthday = body.birthday.length == 10;
  }
  else{
    validData.birthday = true;
  }


  return {
    valid: validData.email && validData.name && validData.birthday,
    messages: getErrMsg(validData)
  }
}

/********************************************************************************/



/*******************
// User router
*******************/
router.post('/public/user/add', addUser);
router.get('/api/user/:id', userAuth, getUser);
router.put('/api/user/:id', userAuth, updateUser);
router.delete('/api/user/:id', userAuth, deleteUser);









//Add user
async function addUser(ctx){


  try{

    const User = ctx.orm().user;


    let {valid, messages} = validateData(ctx.request.body, 1);


    if(valid){

      ctx.request.body.birthday += ' 00:00:00';

      await User.findOne({where: {email: ctx.request.body.email}});
      await User.create(ctx.request.body);

      setCTX(ctx, 200, user);

    }
    else{
      setCTX(ctx, 409, messages);
    }
  }
  catch(err){
    setCTX(ctx, 409, err.message);
  }

};




//update user
async function updateUser(ctx, next){


  try{

      const User = ctx.orm().user;


      let {valid, messages} = validateData(ctx.request.body, 0);


      if(valid){

        if(ctx.request.body.birthday){
          ctx.request.body.birthday += ' 00:00:00';
        }


        await User.update(ctx.request.body, {where:{ id:ctx.params.id }});


        setCTX(ctx, 204, '');

      }
      else{
        setCTX(ctx, 409, messages);
      }
  }
  catch(err){
    setCTX(ctx, 409, err.message);
  }
}




//delete user
async function deleteUser(ctx){

  try{

      const User = ctx.orm().user;
      await User.destroy({where: {id: ctx.params.id}});

      ctx.status = 204;

  }
  catch(err){
    setCTX(ctx, 409, err.message);
  }
}




//get user
async function getUser(ctx){
    try{

        const User = ctx.orm().user;
        const user = await User.findOne({where: {id: ctx.params.id}});

        ctx.status = 200;
        ctx.body = user;

    }
    catch(err){
      ctx.status = 404;
      ctx.body = {
        message: err.message
      }
    };

}




const routes = router.routes();
export default () => routes;

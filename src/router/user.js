import Router from 'koa-router';
import jwt from 'koa-jwt';
import key from '../config/key.json';

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

  let patt = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  let validData = {
    name: false,
    email: false,
    birthday: false
  };


  validData.email = patt.test(body.email);
  validData.name = !body.name.length < 1;

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
router.get('/api/user/:id', getUser);
router.put('/api/user/:id', updateUser);
router.delete('/api/user/:id', deleteUser);





//Add user
async function addUser(ctx){
  const User = ctx.orm().user;


  let {valid, messages} = validateData(ctx.request.body, 1);


  if(valid){

    let result = await User.findOne({
        where: {
            email: ctx.request.body.email
        }
    })
    .then(user => {
        return !user;
    });



    if(result){
        ctx.request.body.birthday += ' 00:00:00';

        await User.create(ctx.request.body)
                    .then((user) => {
                        setCTX(ctx, 200, user);
        })
        .catch((err) => {
            console.log(err);
            setCTX(ctx, 409, err);
        });

    }
    else{
      setCTX(ctx, 409, 'email must be unique');
    }

  }
  else{
    setCTX(ctx, 409, messages);
  }

};




//update user
async function updateUser(ctx, next){

  if(ctx.state.user.data.id == ctx.params.id){
    const User = ctx.orm().user;

    //console.log(ctx.state.user.data);

    let {valid, messages} = validateData(ctx.request.body, 0);


    if(valid){

      if(ctx.request.body.birthday){
        ctx.request.body.birthday += ' 00:00:00';
      }

      await User.update(
          ctx.request.body, {
          where:{ id:ctx.params.id }
        })
        .then((user) => {
          if(user){
            setCTX(ctx, 204, '');
          }
          else{
            setCTX(ctx, 404, 'User not found');
          }
        })
        .catch((err) => {

            if(typeof err.errors[0] === 'string'){
              setCTX(ctx, 409, err.errors[0].message);
            }
            else{
              setCTX(ctx, 409, 'Unknown error');
            }
        });

    }
    else{
      setCTX(ctx, 409, messages);
    }
  }
  else{
    setCTX(ctx, 401, 'Invalid token, please log in again.');
  }
}




//delete user
async function deleteUser(ctx){

  if(ctx.state.user.data.id == ctx.params.id){
    const User = ctx.orm().user;

    await User.destroy({
      where: {
          id: ctx.params.id
      }
    })
    .then(user => {
      if(user){
        ctx.status = 204;
      }
      else{
        ctx.status = 404;
        ctx.body = {
          id: ctx.params.id,
          name: 'User not found'
        }
      }
    })
  }
  else{
    setCTX(ctx, 401, 'Invalid token, please log in again.');
  }
}




//get user
async function getUser(ctx){

  if(ctx.state.user.data.id == ctx.params.id){
    const User = ctx.orm().user;

    await User.findOne({
        where: {
            id: ctx.params.id
        }
    })
    .then(user => {
        if(user){
          ctx.status = 200;
          ctx.body = user;
        }
        else{
          ctx.status = 404;
          ctx.body = {
            id: ctx.params.id,
            name: 'User not found'
          }
        }
    })
    .catch(err => {
      ctx.status = 404;
      ctx.body = {
        id: ctx.params.id,
        name: 'User not found'
      }
    });
  }
  else{
    setCTX(ctx, 401, 'Invalid token, please log in again.');
  }
}




const routes = router.routes();
export default () => routes;

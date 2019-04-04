const is = {
  get required(){
    throw new Error('Required argument');
  },

  vEmail(email){
    let patt = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return patt.test(email);
  }
}









async function userAuth(ctx, next) {
  if(ctx.state.user.data.id == ctx.params.id) {
     await next();
  } else {
    ctx.status = 401;
    ctx.body = {
      error: 401,
      description: 'Invalid token, please login again.'
    };
  }
}


export { is, userAuth };

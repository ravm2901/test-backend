const is = {
  get required(){
    throw new Error('Required argument');
  },

  vEmail(email){
    let patt = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return patt.test(email);
  }
}



export { is };

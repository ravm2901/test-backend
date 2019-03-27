import { validEmail, is } from './utils';
import expect from 'expect';


it('Testing validate email', () => {
  let res = validEmail('vilchis40@gmail.com');

  expect(res).toBe(true);
})


it('Testing validate email', () => {
  let res = validEmail('v@gmail.com');

  expect(res).toBe(true);
})

/******************************** field required *************************/
it('Field name -a:false- required', () => {
  const fnName = (name = is.required) => name.length > 1;

  let res = fnName('a');

  expect(res).toBe(false);
})

it('Field name -Rodolfo:true- required', () => {
  const fnName = (name = is.required) => name.length > 1;

  let res = fnName('Rodolfo');

  expect(res).toBe(True);
})

it('Field name -Rodolfo Antonio:true- required', () => {
  const fnName = (name = is.required) => name.length > 1;

  let res = fnName('Rodolfo Antonio');

  expect(res).toBe(True);
})

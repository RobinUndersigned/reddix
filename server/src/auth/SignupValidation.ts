import {object, refine, size, string} from "superstruct";
import isEmail from "isemail";

const SignupValidation = object({
  // string and a valid email address
  email: refine(string(), 'email', (v) => isEmail.validate(v)),
  // password is between 7 and 30 characters long
  password: size(string(), 7, 30),
  // first name is between 2 and 50 characters long
  firstName: size(string(), 2, 50),
  // last name is between 2 and 50 characters long
  lastName: size(string(), 2, 50),
})

export default SignupValidation;

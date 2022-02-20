import {object, refine, size, string} from "superstruct";
import isEmail from "isemail";

const SigninValidation = object({
  // string and a valid email address
  email: refine(string(), 'email', (v) => isEmail.validate(v)),
  // password is between 7 and 30 characters long
  password: size(string(), 7, 30),
})

export default SigninValidation;

import {object, refine, size, string} from "superstruct";
import isEmail from "isemail";

const SignupValidation = object({
  email: refine(string(), 'email', (v) => isEmail.validate(v)),
  password: size(string(), 7, 30),
  firstName: size(string(), 2, 30),
  lastName: size(string(), 2, 30),
  userName: size(string(), 1, 30),
})

export default SignupValidation;

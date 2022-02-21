import {object, size, string} from "superstruct";

const SigninValidation = object({
  // string and a valid email address
  userName: size(string(), 4, 20),
  // password is between 7 and 30 characters long
  password: size(string(), 7, 30),
})

export default SigninValidation;

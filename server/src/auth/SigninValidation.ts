import {object, size, string} from "superstruct";

const SigninValidation = object({
  userName: size(string(), 4, 20),
  password: size(string(), 7, 30),
})

export default SigninValidation;

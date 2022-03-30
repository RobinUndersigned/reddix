import {AuthContextUserProfile} from "./AuthContextUserProfile";

export interface AuthContextUser  {
  id: number,
  firstName: string,
  lastName: string,
  userName: string,
  email: string;
  Profile: AuthContextUserProfile
}
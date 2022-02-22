import React from "react";

export interface AuthContextUser  {
  id: number,
  firstName: string,
  lastName: string,
  userName: string,
  email: string;
}

export interface AuthContextType {
  user?: AuthContextUser | null;
  signin: (user: AuthContextUser, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}
export const AuthContext = React.createContext<AuthContextType>(null!);

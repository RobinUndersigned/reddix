import React from "react";
import {AuthContextUser} from "../interfaces/AuthContextUser";

export interface AuthContextType {
  user?: AuthContextUser | null;
  signin: (user: AuthContextUser, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  signin() { return },
  signout() { return },
}

export const AuthContext = React.createContext<AuthContextType>(defaultAuthContext);

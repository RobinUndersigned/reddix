import React from "react";

export interface AuthContextUserProfile {
  id: number,
  bio: string,
  avatarId: number,
}

export interface AuthContextUser  {
  id: number,
  firstName: string,
  lastName: string,
  userName: string,
  email: string;
  Profile: AuthContextUserProfile
}

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

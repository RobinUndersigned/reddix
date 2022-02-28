import React from "react";
import {AuthContextType, AuthContextUser} from "../../context/AuthContext";
import {authProvider} from "../../utils/authProvider";
import useAuth from "../../hooks/useAuth";
import {Navigate, useLocation} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {AuthContext} from "../../context/AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const encryptedToken = localStorage.getItem('reddixAuthToken')
  const decodedToken: AuthContextUser | null = encryptedToken ? jwtDecode<AuthContextUser>(encryptedToken) : null

  const [user, setUser] = React.useState<AuthContextUser|null>(decodedToken)

  const signin = async (newUser: AuthContextUser, callback: VoidFunction) => {
    return authProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return authProvider.signout(() => {
      setUser(null)
      callback()
    });
  };

  const value: AuthContextType = { user, signin, signout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children
}
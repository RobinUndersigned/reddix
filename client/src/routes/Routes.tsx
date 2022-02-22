import {Routes, Route, Link} from "react-router-dom";
import React, {ReactElement} from "react";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../sites/auth/Signup";
import Signin from "../sites/auth/Signin";
import DashboardLayout from "../layouts/DashboardLayout";
import {AuthProvider, RequireAuth} from "../components/Provider/AuthProvider";

function PublicRoutes(): ReactElement {

  return (
    <AuthProvider>
      <Routes>
          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardLayout/>
            </RequireAuth>
          }/>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}


export default PublicRoutes;
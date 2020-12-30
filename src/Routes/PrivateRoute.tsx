import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated?: boolean;
  isLoadingAuthState?: boolean;
  authenticationPath: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
  if (props.isLoadingAuthState) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!props.isAuthenticated) {
    const pathname = props.authenticationPath;
    const redirect = () => <Redirect to={{ pathname }} />;
    return <Route {...props} component={redirect} />;
  }

  return <Route {...props} />;
};

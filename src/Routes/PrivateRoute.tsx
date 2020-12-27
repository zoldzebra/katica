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

  let redirectPath = '';
  if (!props.isAuthenticated) {
    redirectPath = props.authenticationPath;
  }

  if (redirectPath) {
    const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

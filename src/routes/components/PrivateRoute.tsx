import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { PATHS } from "src/constants/paths";
import { hasStorageJwtToken } from "src/helpers/storage";

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const isLogined = hasStorageJwtToken();

  if (!isLogined) {
    return (
      <Redirect
        to={{
          pathname: PATHS.login(),
        }}
      />
    );
  }

  return <Route {...props} />;
};

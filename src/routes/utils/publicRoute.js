import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { UserContext } from 'src/context';

const PublicRoute = ({ component, path }) => {
  const Component = component;
  const { userData } = React.useContext(UserContext);

  return (
    <Route
      path={path}
      render={(routeProps) =>
        userData.userName ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...routeProps} />
        )
      }
    />
  );
};

export default PublicRoute;

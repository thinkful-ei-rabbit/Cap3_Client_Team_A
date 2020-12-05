import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { TokenService } from 'src/services';

const PrivateRoute = ({ component, path }) => {
  const Component = component;
  const payload = TokenService.parseAuthToken();

  return (
    <Route
      path={path}
      render={(routeProps) =>
        !payload || !payload.message ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

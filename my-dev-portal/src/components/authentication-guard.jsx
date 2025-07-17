import React from "react";
import SecureRoute from "./okta/SecureRoute";
import KeycloakSecureRoute from "./keycloak/KeycloakSecureRoute";
import { PageLoader } from "./page-loader";
import { withAuthenticationRequired } from "@auth0/auth0-react";

export const AuthenticationGuard = ({ children }) => {
  const authProvider = import.meta.env.REACT_APP_AUTH_PROVIDER;

  if (authProvider === "Okta") {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <SecureRoute>{children}</SecureRoute>
      </React.Suspense>
    );
  } else if (authProvider === "Keycloak") {
    return <KeycloakSecureRoute>{children}</KeycloakSecureRoute>;
  } else if (authProvider === "Auth0") {
    const Component = withAuthenticationRequired(({ children }) => children, {
      onRedirecting: () => (
        <div className="page-layout">
          <PageLoader />
        </div>
      ),
    });

    return <Component>{children}</Component>;
  }
};
